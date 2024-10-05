//import { useEffect, useState } from "react";
import { useState } from "react";
import Game from "./Game";
import UserForm from "./SupportingComponents/UserForm";
import MyDialog from "./SupportingComponents/MyDialog";

export const DialogType = Object.freeze({
  CLOSED: -1,
  LOGIN: 0,
  REGISTER: 1,
  DOWNLOAD_GAME: 2
});
export type DialogType = -1 | 0 | 1 | 2; //Idk if this is a good idea //At a later point of the project. You know what? I think it is

function App() {
  const [dialogType, setDialog] = useState<DialogType>(DialogType.CLOSED);
  
  return (
    <>
      <MyDialog showDialog={dialogType !== DialogType.CLOSED} closeDialog={()=>setDialog(DialogType.CLOSED)}>
        <UserForm dialogType={dialogType} closeDialog={()=>setDialog(DialogType.CLOSED)}/>
      </MyDialog>
      <Game dialogType={dialogType} openDialog={setDialog}/>
    </>
  )
}

export default App;
