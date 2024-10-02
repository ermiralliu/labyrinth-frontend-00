//import { useEffect, useState } from "react";
import { useState } from "react";
import Game from "./Game";
import LogIn from "./LogIn";

function App() {
  // const [logged, setLogged] = useState<boolean>(false);
  // useEffect(()=>{
  const [dialogOpened, openDialog] = useState(false);
  function toggleDialog(){
    openDialog((current)=> !current);
  }
  // }, []);
  return (
    <>
      { dialogOpened ? <LogIn/> : <></> }
      <Game dialogOpened={dialogOpened} toggleDialog={toggleDialog}/>
    </>
  )
}

export default App;
