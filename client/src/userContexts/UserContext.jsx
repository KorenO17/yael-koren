import { createContext, useContext } from "react"
import { useState } from "react"

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [userId, setUserId] = useState([])

    return (
        <UserContext.Provider value={{userId , setUserId}}>
            {children}
        </UserContext.Provider>
    )
}