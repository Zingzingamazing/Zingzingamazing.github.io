import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './Components/sign/login';
import SignUpForm from './Components/signup/signup';
import Home from './Components/Home/home';
import AdCampaign from './Components/Home/adcampaign';
import AdminPanel from './Components/AdminPanel';
import Users from './Components/Users';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/signin" component={LoginForm} />
          <Route path="/signup" component={SignUpForm} />
          <Route path="/home" component={Home} />
          <Route path="/adcampaign" component={AdCampaign} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/users" component={Users} />
          <Route path="/" component={LoginForm} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
