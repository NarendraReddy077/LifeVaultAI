import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you might verify the token or fetch user profile
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login(email, password);
        localStorage.setItem('token', res.data.access_token);
        setUser({ token: res.data.access_token });
        return res.data;
    };

    const register = async (userData) => {
        const res = await authAPI.register(userData);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
