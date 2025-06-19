//context/AuthContext.js
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem('auth');
        return stored ? JSON.parse(stored) : {user: null, accessToken: null};
    })

    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth])

    const login = (userData, accessToken) => {
        setAuth({user: userData, accessToken});
    };


    const logout = () => {
        setAuth({ user: null, accessToken: null });
        localStorage.removeItem('auth');
    };


    return (
        <AuthContext.Provider value = {{auth, setAuth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;