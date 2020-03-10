import React, { Component } from 'react'
import { NavLink } from "react-router-dom"
import Cookies from "js-cookie"

export default class Auth extends Component {
   constructor(props) {
       super(props)

       this.state = {
           username: "",
           password: "",
           confirmPassword: "",
           email: "",
           emptyFieldsError: false,
           missmatchedPasswordsError: false,
           invalidCredentialsError: false,
           serverDownError: false
       }

       this.handleChange = this.handleChange.bind(this)
       this.handleSubmit = this.handleSubmit.bind(this)
   }

   handleChange(event) {
       this.setState({ 
           [event.target.name]: event.target.value,
           emptyFieldsError: false,
           missmatchedPasswordsError: false,
           invalidCredentialsError: false,
           serverDownError: false
        })
   }

   handleSubmit(event) {
        event.preventDefault()

       if (this.props.authType === "signup") {
           if (this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "") {
               this.setState({ emptyFieldsError: true })
           }
           else if (this.state.password !== this.state.confirmPassword) {
               this.setState({ missmatchedPasswordsError: true })
           }
           else {
                fetch("https://moody-api-aoj.herokuapp.com/users/post", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                            username: this.state.username,
                            password: this.state.password,
                            email: this.state.email
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data === "User Created") {
                        Cookies.set("username", this.state.username)
                        this.props.handleSuccessfulAuth(this.state.username)
                        this.props.history.push("/messenger")
                    }
                })
                .catch(error => {
                    console.log("Error signing up: ", error)
                    this.setState({ serverDownError: true })
                })
            }
       }
       else if (this.props.authType === "login") {
           if (this.state.username === "" || this.state.password === "") {
               this.setState({ emptyFieldsError: true })
           } 
           else {
                fetch("https://moody-api-aoj.herokuapp.com/users/verification", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: this.state.password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data === "User NOT Verified: Username" || data === "User NOT Verified: Password") {
                        this.setState({ invalidCredentialsError: true })
                    }
                    else if (data === "User Verified") {
                        Cookies.set("username", this.state.username)
                        this.props.handleSuccessfulAuth(this.state.username)
                        this.props.history.push("/messenger")
                    }
                })
                .catch(error => {
                    console.log("Error logging in: ", error)
                    this.setState({ serverDownError: true })
                })
            }
       }
   }

   render() {
       return (
           <div className='auth-wrapper'>
               <form onSubmit={this.handleSubmit}>
                   <input 
                        name="username" 
                        value={this.state.username} 
                        onChange={this.handleChange}
                        type="text"
                        placeholder="Username"
                    />
                   <input 
                        name="password" 
                        value={this.state.password} 
                        onChange={this.handleChange}
                        type="password"
                        placeholder="Password"
                    />
                    { this.props.authType === "signup" ?
                   <input 
                        name="confirmPassword" 
                        value={this.state.confirmPassword} 
                        onChange={this.handleChange}
                        type="password"
                        placeholder="Confirm Password"
                    />
                    : null }
                    { this.props.authType === "signup" ?
                   <input 
                        name="email" 
                        value={this.state.email} 
                        onChange={this.handleChange}
                        type="email"
                        placeholder="Email (optional)"
                    />
                    : null }
                    <button type="submit">Submit</button>
               </form>

                <NavLink to="/">
                    <button>Back</button>
                </NavLink>

               <div className="error-wrapper">
                    {this.state.emptyFieldsError ?
                        <p>Error: Please fill out all required fields</p>
                    : null}
                    {this.state.missmatchedPasswordsError ?
                        <p>Error: Confirmation password did not match. Please try again.</p>
                    : null}
                    {this.state.invalidCredentialsError ? 
                        <p>Invalid Username or Password.</p>
                    : null}
                    {this.state.serverDownError ?
                        <p>An error occured. Please try again later.</p>
                    : null}
               </div>
           </div>
       )
   }
}