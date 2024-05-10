import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Import BrowserRouter, Route, and Switch

import LoginForm from './Components/LoginForm';
import LogupForm from './Components/LogupForm';

function App() {
  return (
    <Router>
      <Switch>
        {/* Define routes for login and signup */}
        <Route path="/login" component={LoginForm} />
        <Route path="/logup" component={LogupForm} />
        {/* Set the default route to render LogupForm */}
        <Route path="/" component={LogupForm} />
      </Switch>
    </Router>
  );
}

export default App;

