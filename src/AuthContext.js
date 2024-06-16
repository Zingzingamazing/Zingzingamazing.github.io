import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);  // Corrected usage
                setUser(decoded);
            } catch (error) {
                console.error('Invalid token:', error);
                setUser(null);
            }
        }
    }, []);

    const login = ({ token }) => {  // Destructuring to get token
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);  // Corrected usage
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
