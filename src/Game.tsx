import { useEffect, useMemo, useState } from "react"
import { makeLab, MazeOptions } from "./LabyrinthLogic/Generator"
import SidePane from "./SidePane";
import Board from "./Board";
import { DialogType } from "./App";
import { uploadBoard } from "./UploadBoard";
import { SERVER_URL_LOGOUT } from "./constants";

function generateBoard() {
  const x = Math.floor(Math.random() * MazeOptions.WIDTH);
  const y = Math.floor(Math.random() * MazeOptions.HEIGHT);
  return makeLab(x, y);
}

export default function Game(props: {
  dialogOpened: boolean,
  openDialog: (variant: DialogType) => void
}): JSX.Element {
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loggedIn] = useState(false); //do na duhet te bejme nje fetch request qe kemi nje user present, ku te marrim dhe username dhe ta vendosim ne sidepane, then we won't have much more to do
  const [points, setPoints] = useState(0);
  const [board, setBoard] = useState(generateBoard()); //It's probably enough to only have one board up here
  //I've made this more complicated than needed
  const [level, setLevel] = useState(1);
  //here we'll add sth to check if we're logged in, and based on that, we'll change the buttons below
  const [firstMove, setFirstMove] = useState(true);

  useEffect(() => {
    if(level < 1){
      setLevel(1);
      return;
    }
    setBoard(generateBoard());//I wanted it to start where it left off, but let's leave that for a later time
    setFirstMove(true);
  }, [level]);
  
  const resetBoard = useMemo(() => () => {
    setPoints(0); 
    setLevel((lev) => (lev === 1) ? lev - 1 : 1);
    setFirstMove(true);
  },[]);

  return (
    <div id='main'>
      <Board
        board={board}
        level={level}
        firstMove={firstMove}
//        setFirstMove={setFirstMove}
        updatePoints={() => setPoints(pt => pt + 1)}
        updateLevel={() => setLevel(lev => lev + 1)}
        setBoard={setBoard}
        resetBoard={resetBoard}
        dialogOpened={props.dialogOpened}
      />
      <SidePane score={points} level={level}>
        {!loggedIn ? <>
          <button type='button' onClick={() => props.openDialog(DialogType.LOGIN)}> Log In </button>
          <button type='button' onClick={() => props.openDialog(DialogType.REGISTER)}> Register </button>
        </> : <>
          <button type='button' onClick={() => uploadBoard(board)}>Upload Board</button>
          <button type='button' onClick={logout}> Log Out </button>
        </>
        }
        <button type='button' onClick={ resetBoard}> New Game </button>
      </SidePane>
    </div>
  )
}

function logout() {
  if (!confirm('Are you sure you want to log out?'))
    return;
  fetch(SERVER_URL_LOGOUT, {
    credentials: 'include',		//important
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'DELETE'
  }).then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}