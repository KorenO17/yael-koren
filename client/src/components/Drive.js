import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../userContexts/UserContext";

function Drive() {
    // const [fileName, setFileName] = useState("")
    // const [fileContent, setFileContent] = useState("")
    const [allFiles, setAllFiles] = useState([]);
    const [folderName, setFolderName] = useState("")
    const { passUsername } = useUser()
    let [folderPath, setFolderPath] = useState("")
    const navigate=useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (passUsername)
            getFile();
    }, [passUsername,location])

    const getFile = async (e) => {
        e?.preventDefault();

        try {
            let url = location.pathname
            console.log(passUsername);
            console.log(url);
            let arr = url.split(`/${passUsername}/drive`)
            console.log(arr[1]);
            setFolderPath(arr[1])
            const res = await fetch(`http://localhost:8000/${passUsername}/drive?path=${arr[1]}`)
            const data = await res.json();
            setAllFiles(data)
            if (data == []) {
                console.log("empty");
            }
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    const addFolder = async (e) => {
        e?.preventDefault();
        try {
            const res = await fetch(`http://localhost:8000/${passUsername}/drive?path=${folderPath}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folderName: folderName, username: passUsername })
                })
            const data = await res.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    // const addFile = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await fetch(`http://localhost:8000/${passUsername}/drive/:folderPath`,
    //             {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ fileName: fileName, fileContent: fileContent, username: passUsername })
    //             })
    //         const data = await res.json();
    //         setAllFiles(data)
    //     }
    //     catch (error) {
    //         console.log("error: ", error)
    //     }
    // }

    const enter =(name)=>{
        navigate(`${location.pathname}/${name}`)
    }

    return (
        <>
            <h1>hello {passUsername}</h1>
            <form onSubmit={(e) => addFolder(e)}>
                <input name="folderName" value={folderName} onChange={(e) => setFolderName(e.target.value)} type="text" required />
                <button>add new folder</button>
            </form>
            {/* <form onSubmit={(e) => addFile(e)}>
                <input value={fileName} onChange={(e) => setFileName(e.target.value)} type="text" required />
                <textarea value={fileContent} onChange={(e) => setFileContent(e.target.value)} required rows="4" cols="50" />
                <button>add new file</button>
            </form> */}
            {allFiles.map((file, index) => <div className="file" key={`file ${index}`}>
                {file.type == 'folder' ? <button value={file.name} onClick={()=>enter(file.name)}>{file.name}</button> : null}
            </div>)}
        </>
    )


}

export default Drive;