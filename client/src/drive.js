import React, {useState,useEffect} from "react";

function App() {
   
    const [allFiles, setAllFiles] = useState([]);
    
    useEffect(()=>{
        getFile();
    },[])

    const getFile = async () => {
        try{
            const res = await fetch("http://localhost:8000/:id")
            const data = await res.json();
            setAllFiles(data)
        }
        catch (error){
            console.log("error: " , error)
        }
    }

    return (
       <> <h1>hello user</h1>
        {allFiles.map(file=><div className="file">{file}</div>)}
        </>
    )
}

export default App;