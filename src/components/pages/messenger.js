import React, { Component } from 'react'

export default class Messenger extends Component {
   constructor(props) {
       super(props)

       this.state = {
           existingMessages: [],
           users: [],
           currentUser: {},
           newMessage: "",
           color: "black"
       }

       this.handleChange = this.handleChange.bind(this)
       this.handleSubmit = this.handleSubmit.bind(this)
       this.getPostsAndUsers = this.getPostsAndUsers.bind(this)
   }

   componentDidMount() {
       this.getPostsAndUsers()

       this.intervalID = setInterval(this.getPostsAndUsers, 1000)
   }

   componentWillUnmount() {
       clearInterval(this.intervalID)
   }

   getPostsAndUsers() {
        fetch("https://moody-api-aoj.herokuapp.com/posts/get", {
           method: "GET"
       })
       .then(response => response.json())
       .then(data => {
           this.setState({ existingMessages: data })
       })
       .catch(error => console.log("Error getting posts: ", error))

       fetch("https://moody-api-aoj.herokuapp.com/users/get", {
           method: "GET"
       })
       .then(response => response.json())
       .then(data => {
           let currentUser = {}
            for (let user of data) {
                if (user.username === this.props.username) {
                    currentUser = user
                    break
                }
            }

           this.setState({ 
               users: data,
               currentUser: currentUser
            })
       })
       .catch(error => console.log("Error getting users: ", error))
   }

   componentDidUpdate() {
       this.scrollToBottom()
   }

   renderMessages() {
       return this.state.existingMessages.map(message => {
           let username = ""
           for (let user of this.state.users) {
               if (user.id === message.userID) {
                   username = user.username
                   break
               }
           }
           
           return (
                <div className="single-message-wrapper" style={{ textAlign: message.userID === this.state.currentUser.id ? "right" : "left" }}>
                        <h5>{username}</h5>
                        <p style={{ color: message.color }}>{message.content}</p>
                </div>
           )
       })
   }

   handleChange(event) {
        this.setState({ 
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()

        fetch("https://moody-api-aoj.herokuapp.com/posts/post", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                content: this.state.newMessage,
                color: this.state.color,
                userID: this.state.currentUser.id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data === "Post Created") {
                const currentMessages = this.state.existingMessages
                currentMessages.push({
                    content: this.state.newMessage,
                    color: this.state.color,
                    userID: this.state.currentUser.id
                })

                this.setState({
                    existingMessages: currentMessages,
                    newMessage: ""
                })
            }
        })
    }

    scrollToBottom() {
        const chatWindow = document.querySelector(".existing-messages-wrapper")
        chatWindow.scrollTo(0, chatWindow.scrollHeight)
    }

   render() {
       return (
           <div className='messenger-wrapper'>
               <div className="existing-messages-wrapper">
                    {this.renderMessages()}
               </div>
               <form onSubmit={this.handleSubmit}>
                    <div className="color-selection-wrapper">
                        <div>
                            <input type="radio" name="color" defaultChecked={true} value="black" onChange={this.handleChange} />
                            <label>Black</label>
                        </div>

                        <div>
                            <input type="radio" name="color" value="orange" onChange={this.handleChange} />
                            <label>Orange</label>
                        </div>

                        <div>
                            <input type="radio" name="color" value="red" onChange={this.handleChange} />
                            <label>Red</label>
                        </div>

                        <div>
                            <input type="radio" name="color" value="blue" onChange={this.handleChange} />
                            <label>Blue</label>
                        </div>

                        <div>
                            <input type="radio" name="color" value="purple" onChange={this.handleChange} />
                            <label>Purple</label>
                        </div>

                        <div>
                            <input type="radio" name="color" value="green" onChange={this.handleChange} />
                            <label>Green</label>
                        </div>
                    </div>
                   <input 
                        type="text" 
                        name="newMessage" 
                        value={this.state.newMessage}
                        onChange={this.handleChange}
                    />
                    <button type="submit">Send</button>
               </form>
           </div>
       )
   }
}