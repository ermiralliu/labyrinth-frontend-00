import { useState } from "react"
import { makeLab, MazeOptions } from "./LabyrinthLogic/Generator"
import SidePane from "./SidePane";
import Board from "./Board";
import { DialogType } from "./App";

function generateBoard(){
  const x =  Math.floor(Math.random()*MazeOptions.WIDTH);
  const y = Math.floor(Math.random()*MazeOptions.HEIGHT);
  // const board = makeLab(x,y)
  // return { x, y, board };
  return makeLab(x,y);
}

export default function Game(props: { dialogOpened: boolean, openDialog: (variant:DialogType)=> void }): JSX.Element {
  const [points, setPoints] = useState(0);
  const [startingBoard, setStartingBoard] = useState(generateBoard()); //It's probably enough to only have one board up here
  //I've made this more complicated than needed

  return (
    <div id='main'>
      <Board updatePoints={()=>setPoints(pt=>pt+1)} startingBoard={startingBoard} dialogOpened={props.dialogOpened}/>
      <SidePane score={points}>
        <button type='button' onClick={()=> props.openDialog(DialogType.LOGIN)}> Log In </button>
        <button type='button' onClick={()=> props.openDialog(DialogType.REGISTER)}> Register </button>
        <button type='button' onClick={()=> setStartingBoard(generateBoard())}> New Game </button>
      </SidePane>
    </div>
  )
}