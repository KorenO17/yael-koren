import React, {useState,useEffect, useContext} from "react";

function Drive() {
    const [fileName, setFileName] = useState("")
    const [fileContent, setFileContent] = useState("")
    const [allFiles, setAllFiles] = useState([]);
    const [currUser, setCurrUser] = useState("")
    const [folderName, setFolderName] = useState("")


    useEffect(()=>{
        getFile();
    
    }, [])

    const getFile = async () => {
     
        try{
            const res2 = await fetch(`http://localhost:8000/shlimziGibut`)
            const data2 = await res2.json();
            setCurrUser(data2)
            const res = await fetch(`http://localhost:8000/${data2}/drive`)
            const data = await res.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    return (
        <> <h1>hello {currUser}</h1>
            <form method="POST" action={`http://localhost:8000/${currUser}/drive`}>
                <input name="folderName" value={folderName} onChange={(e)=>setFolderName(e.target.value)} type="text" required />
                <button>add new folder</button>
            </form>
            <form method="POST" action={`http://localhost:8000/${currUser}/drive`}>
                <input name="fileName" value={fileName} onChange={(e)=>setFileName(e.target.value)} type="text" required />
                <textarea name="fileContent" value={fileContent} onChange={(e)=>setFileContent(e.target.value)} required rows="4" cols="50"/>
                <button>add new file</button>
            </form>
            {allFiles.map((file, index) => <div className="file" key={`file ${index}`}><button value={file.name}>{file.name}</button></div>)}
        </>
    )
}

export default Drive;