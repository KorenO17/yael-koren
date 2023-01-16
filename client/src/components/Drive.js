import React, { useState, useEffect, useContext } from "react";
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

    const [infoFlag, setInfoFlag] = useState(false)

    useEffect(() => {
        if (passUsername) {
            getFiles();
        }

    }, [passUsername])

    const getFiles = async (e) => {
        e?.preventDefault();

        try {
            const res = await fetch(`http://localhost:8000/${passUsername}/drive`)
            const data = await res.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    // const addFolder = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await fetch(`http://localhost:8000/${passUsername}/drive`,
    //             {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ folderName: folderName, username: passUsername })
    //             })
    //         const data = await res.json();
    //         setAllFiles(data)
    //     }
    //     catch (error) {
    //         console.log("error: ", error)
    //     }
    // }

    const addFile = async (e) => {
        e?.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/${passUsername}/drive`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: fileName, fileContent: fileContent, username: passUsername }),
                })
            const data = await response.json();
            setAllFiles(data)
        }
        catch (error) {
            console.log("error: ", error)
        }
    }

    const sendRenameToServer = async (prevFileName) => {
        console.log("aaaaaaaaaaa")
        try {
            const response = await fetch(`http://localhost:8000/${passUsername}/renameFile`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: prevFileName, fileContent: fileContent, username: passUsername, newFileName: newFileName }),
                })
            const data = await response.json();
            console.log("bbbbbbbbbbbbbb")
            console.log("data: ", data)
            setAllFiles(data)

        }
        catch (error) {
            console.log("error: ", error)
        }
    }


    return (
        <>
            <h1>hello {passUsername}</h1>
            {/* <form onSubmit={(e) => addFolder(e)}>
                <input type="text" value={folderName} placeholder="folderName" onChange={(e)=>setFolderName(e.target.value)} required />
                <button className="DriveFolderButton">add new folder</button>
            </form> */}
            <form onSubmit={(e) => addFile(e)}>
                <input className="DriveFileNameInput" type="text" value={fileName} placeholder="File Name" onChange={(e) => setFileName(e.target.value)} required />
                <textarea className="DriveFileContentInput" value={fileContent} placeholder="File Content" onChange={(e) => setFileContent(e.target.value)} required rows="4" cols="50" />
                <button>add new file</button>
            </form>

            {allFiles.map((file, index) => <div className="container" key={`file ${index}`}>
                {/* <button value={file.name}>{file.name}</button> */}

                {/* files rendering: */}
                {console.log(file)}
                {file.type === "file" ?
                    <div className="filesDiv">
                        <h1>File Name : {file.name.name}</h1>

                        <button onClick={() => {
                            const allFilesTemp = [...allFiles];
                            allFilesTemp[index].info.infoFlag = !allFilesTemp[index].info.infoFlag
                            setAllFiles(allFilesTemp)
                        }}>Info</button>
                        <p>{file.info.infoFlag ? (`create time: ` + file.info.createTime) : null}</p>

                        <button onClick={() => {
                            const allFilesTemp = [...allFiles];
                            allFilesTemp[index].content.contentFlag = !allFilesTemp[index].content.contentFlag
                            setAllFiles(allFilesTemp)
                        }}>Show</button>
                        <p>{file.content.contentFlag ? (`file content: ` + file.content.content) : null}</p>

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

                    </div> : null}

            </div>)}
        </>
    )
}

export default Drive;