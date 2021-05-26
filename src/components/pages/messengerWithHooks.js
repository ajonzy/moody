import React, { useState, useEffect } from 'react'

export default function Messenger(props) {
    const [existingMessages, updateExistingMessages] = useState([])
    const [users, updateUsers] = useState([])
    const [currentUser, updateCurrentUser] = useState({})
    const [newMessage, updateNewMessage] = useState("")
    const [color, updateColor] = useState("black")
    const [componentMounted, updateComponentMounted] = useState(false)
    let intervalID

    useEffect(() => {
        if (componentMounted === false) {
            getPostsAndUsers()
            updateComponentMounted(true)
        }
        console.log(componentMounted)

        intervalID = setInterval(getPostsAndUsers, 1000)

        scrollToBottom()

        return () => {
            clearInterval(intervalID)
        }
    }, [existingMessages])

    function scrollToBottom() {
        const chatWindow = document.querySelector(".existing-messages-wrapper")
        chatWindow.scrollTo(0, chatWindow.scrollHeight)
    }

    function getPostsAndUsers() {
        // console.log("Getting post and users")

        fetch("https://moody-api-aoj.herokuapp.com/posts/get", {
           method: "GET"
       })
       .then(response => response.json())
       .then(data => {
           updateExistingMessages(data)
       })
       .catch(error => console.log("Error getting posts: ", error))

       fetch("https://moody-api-aoj.herokuapp.com/users/get", {
           method: "GET"
       })
       .then(response => response.json())
       .then(data => {
           let currentUser = {}
            for (let user of data) {
                if (user.username === props.username) {
                    currentUser = user
                    break
                }
            }

            updateUsers(data)
            updateCurrentUser(currentUser)
       })
       .catch(error => console.log("Error getting users: ", error))
   }

    function renderMessages() {
        return existingMessages.map(message => {
            let username = ""
            for (let user of users) {
                if (user.id === message.userID) {
                    username = user.username
                    break
                }
            }
            
            return (
                 <div className="single-message-wrapper" style={{ textAlign: message.userID === currentUser.id ? "right" : "left" }}>
                         <h5>{username}</h5>
                         <p style={{ color: message.color }}>{message.content}</p>
                 </div>
            )
        })
    }

    function handleSubmit(event) {
        event.preventDefault()

        fetch("https://moody-api-aoj.herokuapp.com/posts/post", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                content: newMessage,
                color: color,
                userID: currentUser.id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data === "Post Created") {
                const currentMessages = existingMessages
                currentMessages.push({
                    content: newMessage,
                    color: color,
                    userID: currentUser.id
                })

                updateExistingMessages(currentMessages)
                updateNewMessage("")
            }
        })
    }

   return (
       <div className='messenger-wrapper'>
           <div className="existing-messages-wrapper">
                {renderMessages()}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="color-selection-wrapper">
                    <div>
                        <input type="radio" name="color" defaultChecked={true} onChange={() => updateColor("black")} />
                        <label>Black</label>
                    </div>

                    <div>
                        <input type="radio" name="color" onChange={() => updateColor("orange")} />
                        <label>Orange</label>
                    </div>

                    <div>
                        <input type="radio" name="color" onChange={() => updateColor("red")} />
                        <label>Red</label>
                    </div>

                    <div>
                        <input type="radio" name="color" onChange={() => updateColor("blue")} />
                        <label>Blue</label>
                    </div>

                    <div>
                        <input type="radio" name="color" onChange={() => updateColor("purple")} />
                        <label>Purple</label>
                    </div>

                    <div>
                        <input type="radio" name="color" onChange={() => updateColor("green")} />
                        <label>Green</label>
                    </div>
                </div>
                <input type="text" value={newMessage} onChange={event => updateNewMessage(event.target.value)} />
                <button type="submit">Send</button>
            </form>
       </div>
   )
}