import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Import BrowserRouter, Route, and Switch

import signin from './Components/sign/login';
import signup from './Components/signup/signup';
import home from './Components/Home/home'

function App() {
  return (
    <Router>
      <Switch>
        {/* Define routes for login and signup */}
        <Route path="/signin" component={signin} />
        <Route path="/signup" component={signup} />
        <Route path="/home" component={home} />

        {/* Set the default route to render LogupForm */}
        <Route path="/" component={signin} />
      </Switch>
    </Router>
  );
}

export default App;

