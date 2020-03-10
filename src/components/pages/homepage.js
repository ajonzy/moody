import React from 'react'
import { NavLink } from "react-router-dom"

export default function homepage() {
   return (
       <div className='homepage-wrapper'>
           <h3>Welcome to the Moody App!</h3>
           <NavLink to="/login">
                <button>Login</button>
           </NavLink>
           <NavLink to="/signup">
                <button>Signup</button>
            </NavLink>
       </div>
   )
}