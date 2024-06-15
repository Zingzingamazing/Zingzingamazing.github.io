import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        <Routes>
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/adcampaign" element={<AdCampaign />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
