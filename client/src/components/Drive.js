import React, { useState, useEffect } from "react";


function Drive() {
    const [fileName, setFileName] = useState("")
    const [fileContent, setFileContent] = useState("")
    const [allFiles, setAllFiles] = useState([]);
    const [folderName, setFolderName] = useState("")
    useEffect(() => {
        getFile();
    }, [])

    const getFile = async () => {
        try {
            const res = await fetch("http://localhost:8000/1/drive")
            const data = await res.json();
            console.log(data);
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

//    const enterFolder = async (e) => {
//     try {
//         const res = await fetch("http://localhost:8000/1/drive",{method: "post", headers: {'Content-Type': 'application/json'},body: JSON.stringify(e.target.value)})
//         const data = await res.json();
//         console.log(data);
//         setAllFiles(data)
//     }
//     catch (error) {
//         console.log("error: ", error)
//     }
//    }

    return (
        <> <h1>hello user</h1>
            <form method="POST" action="http://localhost:8000/1/drive">
                <input name="folderName" value={folderName} onChange={(e)=>setFolderName(e.target.value)} type="text" required />
                <button>add new folder</button>
            </form>
            <form method="POST" action="http://localhost:8000/1/drive">
                <input name="fileName" value={fileName} onChange={(e)=>setFileName(e.target.value)} type="text" required />
                <textarea name="fileContent" value={fileContent} onChange={(e)=>setFileContent(e.target.value)} required rows="4" cols="50"/>
                <button>add new file</button>
            </form>
            {allFiles.map((file, index) => <div className="file" key={`file ${index}`}><button value={file.name}>{file.name}</button></div>)}
        </>
    )
}

export default Drive;