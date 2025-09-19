import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
        else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue = {
        token,
        setToken
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export {AuthProvider, AuthContext};