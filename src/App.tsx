//import { useEffect, useState } from "react";
import { useState } from "react";
import Game from "./Game";
import UserDialog from "./UserDialog";

export const DialogType = Object.freeze({
  CLOSED: -1,
  LOGIN: 0,
  REGISTER: 1,
  DOWNLOAD_GAME: 2
});
export type DialogType = -1 | 0 | 1 | 2; //Idk if this is a good idea

function App() {
  const [dialogOpened, setDialog] = useState<DialogType>(DialogType.CLOSED);
  
  return (
    <>
      { dialogOpened !== DialogType.CLOSED ? <UserDialog dialogType={dialogOpened} closeDialog={()=>setDialog(DialogType.CLOSED)}/> : <></> }
      <Game dialogOpened={dialogOpened !== DialogType.CLOSED} openDialog={setDialog}/>
    </>
  )
}

export default App;
