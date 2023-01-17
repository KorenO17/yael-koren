import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContexts/UserContext';
// import "../css/Login.css"

function Register(props) {
    const [registerUsername, setRegisterUsername] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const {setUser} = useUser()
    const [flag, setFlag] = useState(false)
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8000/register/${registerUsername}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: registerUsername, password: registerPassword }),
            })
            const data = await response.json();
            
            if (data === "This username is already in use") {
                setFlag(true)
                return
            }
            else {
                setUser(registerUsername)
                navigate(`../${registerUsername}/drive`);
            }
        }
        catch (error) {
            console.log('error: ', error)
        }
    }

    return (
        <div id="parentDiv">
            <div id="container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input className="RegisterInput" type="text" value={registerUsername} placeholder="username" onChange={(e) => setRegisterUsername(e.target.value)} />
                    <input className="RegisterInput" type="password" value={registerPassword} placeholder="password" onChange={(e) => setRegisterPassword(e.target.value)} />
                    <button className="Registerbutton" type="submit">Register</ button><br/>
                    <button className="toLoginButton" type="" onClick={()=>navigate(`../login`)}>To Login Page</ button>
                    <p>{flag ? "This username is already in use" : ""}</p>
                </form>
            </div>
        </div>
    )
}

export default Register;