import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAdmin(decoded.isAdmin || false);
      } catch (error) {
        console.error('Invalid token:', error);
        setUser(null);
        setIsAdmin(false);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAdmin(decoded.isAdmin || false);
  };

  const loginAdmin = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};