import React, {createContext, useContext, useState,} from 'react';
import {UserResponse} from "../api/responses";

interface AuthContextData {
    setToken(token: string): void;
    clearToken(): void;
    token: string | null;
    user: UserResponse | undefined;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({children}) => {

    const [accessToken, setAccessToken] = useState(localStorage.getItem("@Starsky:token"));
    const [user, setUser] = useState<UserResponse>();

    const setToken = (token: string) => {
        localStorage.setItem('@Starsky:token', token);
        setAccessToken(token);
    };

    const clearToken = () => {
        localStorage.removeItem('@Starsky:token');
        setAccessToken("");
    };

    return (
        <AuthContext.Provider
            value={{setToken: setToken, clearToken: clearToken, token: accessToken, user: user}}>
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