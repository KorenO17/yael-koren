import { createContext, useContext } from "react"
import { useState } from "react"

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [passUsername, setPassUsername] = useState("")

    return (
        <UserContext.Provider value={{passUsername, setPassUsername}}>
            {children}
        </UserContext.Provider>
    )
}