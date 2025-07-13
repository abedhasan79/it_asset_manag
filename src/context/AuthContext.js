import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check token and fetch user on load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        getCurrentUser()
            .then((data) => setUser(data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    // const login = (userData) => {
    //     setUser(userData);
    //     localStorage.setItem("token", userData.token); 
    // };

    // const logout = () => {
    //     localStorage.removeItem("token");
    //     setUser(null);
    // };

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);