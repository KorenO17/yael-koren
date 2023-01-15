import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContexts/UserContext';
// import "../css/Login.css"

function Login(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { userId, setUserId } = useUser(null);
    const [flag, setFlag] = useState(false)
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (userId)

        //     const data = await res.json();
        //     setAllFlavors(data)

        try {
            const response = await fetch(`http://localhost:8000/${username}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password }),
            })
            const data = await response.json();
            const item = (data)

            if (item.length === 0) { //username or password are incorrect
                setUserId(null)
                setFlag(true)
                return
            }
            else {
                console.log("item: ", item)
                setUserId(item.id)
                const toDriveResponse = await fetch(`http://localhost:8000/${item.username}/drive`)
                const toDriveData = await toDriveResponse.json()
                console.log("toDriveData: ", toDriveData)

                navigate(`../${item.username}/drive`, { state: {username: item.username }});
            }
        }
        catch (error) {
            console.log('error: ', error)
        }
    }

    return (
        <div id="parentDiv">
            <div id="container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input className="LoginInput" type="text" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <input className="LoginInput" type="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="Loginbutton" type="submit">login</ button>
                    <p>{flag ? "One or more of the details are incorrect" : ""}</p>
                </form>
            </div>
        </div>
    )
}

export default Login;
