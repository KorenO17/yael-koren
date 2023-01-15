import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./userContexts/UserContext";
import Register from "./components/Register";
import Drive from "./components/Drive";
import Login from "./components/Login";
import { createContext } from "react";

export const UsernameContext = createContext()

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route index element={<Navigate replace to={'/login'}/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/:username/drive" element={<Drive/>}/>
        </Routes>
        
        {/* <Route path="*" element={<Error/>} /> */}
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
