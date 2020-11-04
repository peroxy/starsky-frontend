import React, {
    createContext,
    useState,
    useContext,
} from 'react';

interface AuthContextData {
    setToken(token: string): void;

    clearToken(): void;

    token: string | null;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({children}) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("@Starsky:token"));

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
            value={{setToken: setToken, clearToken: clearToken, token: accessToken}}>
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