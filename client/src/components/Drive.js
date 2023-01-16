import React, { useState, useEffect, useContext } from "react";
import { useUser } from "../userContexts/UserContext";

function Drive() {
    const [fileName, setFileName] = useState("")
    const [fileContent, setFileContent] = useState("")
    const [allFiles, setAllFiles] = useState([]);
    const [folderName, setFolderName] = useState("")
    const { passUsername } = useUser()

    useEffect(() => {
        getFiles();

    }, [])

    const getFiles = async (e) => {
        e.preventDefault();
  
        try {
            const res = await fetch(`http://localhost:8000/${passUsername}/drive`)
            const data = await res.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    
    // const addFile = async () => {
        //     try {
            //         const res = await fetch(`http://localhost:8000/${passUsername}/drive`,
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
        
        const handleSubmitFolder = async (e) => {
            e.preventDefault();
            try {
                const res = await fetch(`http://localhost:8000/${passUsername}/drive`,
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

    return (
        <>
            <h1>hello {passUsername}</h1>
            <form onSubmit={handleSubmitFolder}>
                <input className="DriveFolderInput" type="text" value={folderName} placeholder="folderName" onChange={(e)=>setFolderName(e.target.value)} required />
                <button className="DriveFolderButton">add new folder</button>
            </form>
            {/* <form onSubmit={(e) => addFile(e)}>
                <input value={fileName} onChange={(e) => setFileName(e.target.value)} type="text" required />
                <textarea value={fileContent} onChange={(e) => setFileContent(e.target.value)} required rows="4" cols="50" />
                <button>add new file</button>
            </form> */}
            {allFiles.map((file, index) => <div className="file" key={`file ${index}`}>
                <button value={file.name}>{file.name}</button>
            </div>)}
        </>
    )
}

export default Drive;