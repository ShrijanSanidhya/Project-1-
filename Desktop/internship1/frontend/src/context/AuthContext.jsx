import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Verify token by fetching profile
                const res = await api.get('/user/profile');
                setUser(res.data);
            } catch (err) {
                console.error('Auth check user error', err);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const register = async (email, password, assistantName, assistantImage) => {
        const res = await api.post('/auth/register', { email, password, assistantName, assistantImage });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateAssistant = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateAssistant }}>
            {children}
        </AuthContext.Provider>
    );
};
