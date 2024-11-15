import { useEffect, useMemo, useRef, useState } from "react"
import { makeLab, MazeOptions } from "./LabyrinthLogic/Generator"
import SidePane from "./SidePane";
import Board from "./Board";
import { DialogType } from "./App";
import { updateBoard, uploadBoard } from "./SupportingLogic/UploadBoard";
import { SERVER_URL, SERVER_URL_LOGOUT } from "./SupportingLogic/constants";
import { BoardNamer } from "./SupportingComponents/MyDialog";
import BoardListDialog from "./SupportingComponents/BoardDialog";
import { BoardType, downloadBoardsList } from "./SupportingLogic/DownloadBoards";

function generateBoard() {
  const x = Math.floor(Math.random() * MazeOptions.WIDTH);
  const y = Math.floor(Math.random() * MazeOptions.HEIGHT);
  return makeLab(x, y);
}

export default function Game(props: {
  dialogType: DialogType,
  openDialog: (variant: DialogType) => void
}): JSX.Element {
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState('Guest'); //do na duhet te bejme nje fetch request qe kemi nje user present, ku te marrim dhe username dhe ta vendosim ne sidepane, then we won't have much more to do
  const [points, setPoints] = useState(0);
  const [board, setBoard] = useState(generateBoard()); //It's probably enough to only have one board up here
  //I've made this more complicated than needed
  const [boardName, setBoardName] = useState('default');
  const [level, setLevel] = useState(1);
  //here we'll add sth to check if we're logged in, and based on that, we'll change the buttons below
  const [firstMove, setFirstMove] = useState(true);

  const dialogOpened = props.dialogType !== DialogType.CLOSED;
  const lastDialogType = useRef(props.dialogType);

  const [boardId, setBoardId] = useState<null| number>(null);
  
  useEffect(()=>{
    checkLogIn(setUsername);
    //console.log('username:' + username);
    //here we do the first fetch request
  },[]);
  useEffect(()=>{
    if(props.dialogType !== DialogType.CLOSED){
      lastDialogType.current = props.dialogType;  //we only change this when it's not closed
      return;
    }
    if(lastDialogType.current !== DialogType.LOGIN)
      return;

    checkLogIn(setUsername);
  }, [props.dialogType]);  //we check if we're logged in every time the dialog window is opened

  
  const resetBoard = useMemo(() => () => {
    setPoints(0);
    setLevel(1);
    setFirstMove(true);
    const next_board = generateBoard();
    setBoard(next_board);
    setBoardName('default');
    setBoardId(null);
  },[]);

  const [showBoardListDialog, setBoardListDialog] = useState(false);
  const [showBoardRenameDialog, setBoardRenameDialog] = useState(false);
  const [boardsList, setBoardsList] = useState<BoardType[]|null>(null);

  return (
    <div id='main'>
      <Board
        board={board}
        level={level}
        firstMove={firstMove}
        setFirstMove={setFirstMove}
        updatePoints={() => setPoints(pt => pt + 1)}
        updateLevel={() => setLevel(lev => lev + 1)}
        setBoard={setBoard}
        resetBoard={resetBoard}
        dialogOpened={dialogOpened || showBoardRenameDialog ||showBoardListDialog}
      />
      <SidePane username={username} score={points} level={level} boardName={boardName}>
        {username === 'Guest' ? <>
          <button type='button' onClick={() => props.openDialog(DialogType.LOGIN)}> Log In </button>
          <button type='button' onClick={() => props.openDialog(DialogType.REGISTER)}> Register </button>
        </> : <>
          <BoardNamer showDialog={showBoardRenameDialog} closeDialog={()=> setBoardRenameDialog(false)} setBoardName={setBoardName}/>
          <button type='button' onClick={async ()=> {await downloadBoardsList(setBoardsList); setBoardListDialog(true)}}>Download Board</button>
          <button type='button' onClick={ ()=> setBoardRenameDialog(true)}>Rename Board</button>
          {
            boardId === null ? 
            <button type='button' onClick={() => uploadBoard(board, points, level, boardName)}>Upload Board</button> :
            <button type='button' onClick={() => updateBoard(boardId, board, points, level, boardName)}>Update Board</button>
          }

          <button type='button' onClick={ async() => { await logout(); checkLogIn(setUsername)}}> Log Out </button>
        </>
        }
        <button type='button' onClick={ resetBoard}> New Game </button>
        <BoardListDialog 
          showDialog={showBoardListDialog} 
          closeDialog={()=>setBoardListDialog(false)} 
          boardList={boardsList} 
          setBoardId={setBoardId}
          setGame={(b, level, points, boardName)=>{ 
            setBoard(b); 
            setLevel(level); 
            setPoints(points); 
            setFirstMove(true); 
            setBoardName(boardName)}}
        />
      </SidePane>
    </div>
  )
}

async function logout() {
  if (!confirm('Are you sure you want to log out?'))
    return;
  try{
    const _res = await fetch(SERVER_URL_LOGOUT, {
      credentials: 'include',		//important
      headers: {
        'Accept': 'application/json'
      },
      method: 'DELETE'
    });
    const response = await _res.json();
    console.log(response);
  } catch(err){ 
    console.error(err)
  }
}

function checkLogIn(setLogin: (name:string)=> void){
  fetch(SERVER_URL, {
    credentials: 'include',		//needed to send and recieve cookies //we send it so it stops us to register if we're logged in
    //although I'll probably remove the register and login buttons if the user is already logged in
    headers: {
      'Accept': 'application/json'
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => {
      setLogin(data.username ?? "Guest");
      console.log(data);
    })
    .catch(err => console.error(err));
}