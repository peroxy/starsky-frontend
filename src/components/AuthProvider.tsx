import React, {createContext, useContext, useState,} from 'react';
import {StarskyApiClient} from "../api/starskyApiClient";

interface AuthContextData {
    setToken(token: string): void;
    clearToken(): void;
    token: string | null;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({children}) => {

    const [accessToken, setAccessToken] = useState(localStorage.getItem("@Starsky:token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setToken = (token: string) => {
        localStorage.setItem('@Starsky:token', token);
        setAccessToken(token);
        setIsAuthenticated(true);
    };

    const clearToken = () => {
        localStorage.removeItem('@Starsky:token');
        setAccessToken("");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{setToken: setToken, clearToken: clearToken, token: accessToken, isAuthenticated : isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return context;
}