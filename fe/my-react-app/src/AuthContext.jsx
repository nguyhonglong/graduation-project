import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    const decodedToken = jwtDecode(accessToken);
                    if (Date.now() >= decodedToken.exp * 1000) {
                        await refreshTokens();
                    } else {
                        const storedUser = JSON.parse(localStorage.getItem('user'));
                        setUser(storedUser);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Invalid token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/v1/auth/login', { email, password });
            const { user, tokens } = response.data;
            
            localStorage.setItem('accessToken', tokens.access.token);
            localStorage.setItem('refreshToken', tokens.refresh.token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const refreshTokens = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post('http://localhost:3000/v1/auth/refresh-tokens', { refreshToken });
            const { access, refresh } = response.data;
            
            localStorage.setItem('accessToken', access.token);
            localStorage.setItem('refreshToken', refresh.token);
            
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            logout();
        }
    };

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/v1',
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await refreshTokens();
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, axiosInstance }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
