import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import Cookies from "js-cookie"
import { withRouter } from "react-router"

import Navbar from "./resources/navbar"
import Homepage from "./pages/homepage"
import Auth from "./pages/login-signup"
import Messenger from "./pages/messengerWithHooks"

class App extends Component {
  constructor() {
    super()

    this.state = {
      username: ""
    }

    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this)
    this.handleSuccessfulSignout = this.handleSuccessfulSignout.bind(this)
  }

  componentDidMount() {
    if (Cookies.get("username")) {
      this.setState({ username: Cookies.get("username") })
    }
  }

  handleSuccessfulAuth(username) {
    this.setState({ username: username })
  }

  handleSuccessfulSignout() {
    this.setState({ username: "" })
  }

  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <div>
            <Navbar handleSuccessfulSignout={this.handleSuccessfulSignout} />
            <Switch>
              { Cookies.get("username") ?
                <Redirect exact from="/" to="/messenger" />
              : <Route exact path="/" component={Homepage} /> }
              <Route path="/signup" render={propsFromRoute => <Auth authType="signup" handleSuccessfulAuth={this.handleSuccessfulAuth} {...propsFromRoute} />} /> 
              <Route path="/login" render={propsFromRoute => <Auth authType="login" handleSuccessfulAuth={this.handleSuccessfulAuth} {...propsFromRoute} />} />
              <Route path="/messenger" render={propsFromRoute => <Messenger username={this.state.username} {...propsFromRoute} />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default withRouter(App)
