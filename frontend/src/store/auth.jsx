import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));

    const storeTokenInLS = (serverToken) => {
        // return localStorage.setItem("token", serverToken);
        localStorage.setItem("token", serverToken);
        setToken(serverToken); // now it will update state
    };

    const logoutUser = () => {
        setToken("");
        return localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, storeTokenInLS , logoutUser}}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () =>{
    return useContext(AuthContext);
}