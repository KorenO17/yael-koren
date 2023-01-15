import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./userContexts/UserContext";
import Drive from "./components/Drive";
import Login from "./components/Login";


function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route index element={<Navigate replace to={'/login'}/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/:id/drive" element={<Drive/>}/>
        </Routes>
        {/* <Route path="*" element={<Error/>} /> */}
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
