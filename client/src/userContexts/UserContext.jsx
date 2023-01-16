import { useEffect } from "react";
import { createContext, useContext } from "react"
import { useState } from "react"

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [passUsername, setPassUsername] = useState("")

    useEffect(()=>{
        if (!passUsername){
            setPassUsername(localStorage.getItem("user"))
        }
    },[passUsername])

    const setUser = (user) =>{
        setPassUsername(user);
        localStorage.setItem("user", user)
    }


    return (
        <UserContext.Provider value={{passUsername, setUser}}>
            {children}
        </UserContext.Provider>
    )
}