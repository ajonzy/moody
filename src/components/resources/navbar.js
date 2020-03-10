import React from 'react'
import Cookies from "js-cookie"
import { withRouter } from "react-router"

function navbar(props) {
    function handleSignout() {
        Cookies.remove("username")
        props.handleSuccessfulSignout()
        props.history.push("/")
    }

   return (
       <div className='navbar-wrapper'>
           <h1 className="logo">Moody</h1>
           { Cookies.get("username") ?
                <div className="user-info">
                    <h6>Hello, {Cookies.get("username")}</h6>
                    <button onClick={handleSignout}>Sign&nbsp;Out</button>
                </div>
           : null }
       </div>
   )
}

export default withRouter(navbar)