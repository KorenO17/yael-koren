import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../userContexts/UserContext";
// import Files from "./Files";
import '../CSS/Drive.css'

function Drive() {
    const [fileName, setFileName] = useState("")
    const [newFileName, setnewFileName] = useState("")
    const [fileContent, setFileContent] = useState("")
    const [allFiles, setAllFiles] = useState([]);
    const [files, setFiles] = useState([])
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
            let arr = url.split(`/${passUsername}/drive`)
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

    const addFile = async (e, fileNameToCopy, fileContentToCopy) => {
        e?.preventDefault();
        try {
            const res = await fetch(`http://localhost:8000/${passUsername}/drive?path=${folderPath}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: fileNameToCopy?  fileNameToCopy:fileName, fileContent: fileContentToCopy? fileContentToCopy:fileContent, username: passUsername }),
            })
        const data = await res.json();
        setAllFiles(data)
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
                    body: JSON.stringify({ folderName: folderName, username: passUsername }),
                })
            const data = await res.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    const sendRenameToServer = async (prevFileName) => {
        try {
            const response = await fetch(`http://localhost:8000/${passUsername}/renameFile?path=${folderPath}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: prevFileName, username: passUsername, newFileName: newFileName }),
                })
            const data = await response.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    const deleteFile = async (FileNameToDelete, index)=> {
        try {
            const response = await fetch(`http://localhost:8000/${passUsername}/deleteFile?path=${folderPath}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: FileNameToDelete, username: passUsername, index: index }),
                })
            const data = await response.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }

    }

    const enter =(name)=>{
        navigate(`${location.pathname}/${name}`)
    }

    return (
        <>
            <h1>hello {passUsername}</h1>
            <form onSubmit={(e) => addFolder(e)}>
            <input name="folderName" value={folderName} placeholder="Folder Name" onChange={(e) => setFolderName(e.target.value)} type="text" required />
            <button>add new folder</button>
        </form>
            <form onSubmit={(e) => addFile(e)}>
                <input className="DriveFileNameInput" type="text" value={fileName} placeholder="File Name" onChange={(e) => setFileName(e.target.value)} required />
                <textarea className="DriveFileContentInput" value={fileContent} placeholder="File Content" onChange={(e) => setFileContent(e.target.value)} required rows="4" cols="50" />
                <button>add new file</button>
            </form>

            {allFiles.map((file, index) => <div className="container" key={`file ${index}`}>

                {file.type === "file" ?
                    <div className="filesDiv">
                        <h1>File Name : {file.name.name}</h1>

                        {/* show file info */}
                        <button onClick={() => {
                            const allFilesTemp = [...allFiles];
                            allFilesTemp[index].info.infoFlag = !allFilesTemp[index].info.infoFlag
                            setAllFiles(allFilesTemp)
                        }}>Info</button>
                        <p>{file.info.infoFlag ? (`create time: ` + file.info.createTime) : null}</p>

                        {/* show file content */}
                        <button onClick={() => {
                            const allFilesTemp = [...allFiles];
                            allFilesTemp[index].content.contentFlag = !allFilesTemp[index].content.contentFlag
                            setAllFiles(allFilesTemp)
                        }}>Show</button>
                        <p>{file.content.contentFlag ? (`file content: ` + file.content.content) : null}</p>
                        
                        {/* rename file */}
                        <button onClick={() => {
                            const allFilesTemp = [...allFiles];
                            allFilesTemp[index].name.nameFlag = !allFilesTemp[index].name.nameFlag
                            setAllFiles(allFilesTemp)
                        }}>Rename</button>
                        <div>{file.name.nameFlag ? <form>
                            <input type="text" value={newFileName} placeholder="New File Name" onChange={(e) => setnewFileName(e.target.value)} required />
                            <button onClick={(e) => {
                                e.preventDefault()
                                sendRenameToServer(file.name.name);
                                const allFilesTemp = [...allFiles];
                                allFilesTemp[index].name.name = newFileName
                                setAllFiles(allFilesTemp)
                            }}>Rename</button>
                        </form> : null}</div>
                        <p></p>

                        {/* copy file */}
                        <button onClick={(e) => {addFile(e, file.name.name, file.content.content)}}>Copy</button>
                        <p></p>

                        {/* delete file */}
                        <button onClick={()=>{deleteFile(file.name.name, index) 
                        const allFilesTemp = [...allFiles];
                        allFilesTemp.splice(index, 1)
                        setAllFiles(allFilesTemp)
                        }}>Delete</button>


                    </div> : <button className="folderButton" value={file.name} onClick={()=>enter(file.name)}>{file.name}</button> }

            </div>)}
        </>
    )
}

export default Drive;