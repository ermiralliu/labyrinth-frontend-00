//import { useEffect, useState } from "react";
import { useState } from "react";
import Game from "./Game";
import UserForm from "./UserForm";
import MyDialog from "./MyDialog";

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
      { 
        dialogOpened !== DialogType.CLOSED ? 
        <MyDialog closeDialog={()=>setDialog(DialogType.CLOSED)}>
          <UserForm dialogType={dialogOpened} />
        </MyDialog> : <></> 
      }
      <Game dialogOpened={dialogOpened !== DialogType.CLOSED} openDialog={setDialog}/>
    </>
  )
}

export default App;
