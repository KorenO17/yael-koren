import React, {useState,useEffect} from "react";
import { useLocation } from "react-router-dom";


function Drive() {
   
    const [allFiles, setAllFiles] = useState([]);
    const { state } = useLocation();

    useEffect(()=>{
        getFile();
    },[])

    const getFile = async () => {
        try{
            const res = await fetch(`http://localhost:8000/${state.username}/drive`)
            const data = await res.json();
            console.log(data);
            setAllFiles(data)
        }
        catch (error){
            console.log("error: " , error)
        }
    }

    return (
       <> <h1>hello user {state.username}</h1>
        {allFiles.map((file, index)=><div className="file" key={`file ${index}`}>{file}</div>)}
        </>
    )
}

export default Drive;