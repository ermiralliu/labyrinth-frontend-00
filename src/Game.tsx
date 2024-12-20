import { useEffect, useMemo, useRef, useState } from "react"
// import { makeLab, MazeOptions } from "./LabyrinthLogic/Generator"
import SidePane from "./SidePane";
import Board from "./Board";
import { DialogType } from "./App";
import { updateBoard, uploadBoard } from "./SupportingLogic/UploadBoard";
import { SERVER_URL, SERVER_URL_LOGOUT } from "./SupportingLogic/constants";
import { BoardNamer } from "./SupportingComponents/MyDialog";
import BoardListDialog from "./SupportingComponents/BoardDialog";
import { BoardType, downloadBoardsList } from "./SupportingLogic/DownloadBoards";
import { BoardInfo, BoardObj } from "./SupportingLogic/BoardClasses";


export default function Game(props: {
  dialogType: DialogType,
  openDialog: (variant: DialogType) => void
}): JSX.Element {

  const [username, setUsername] = useState('Guest');
  const [info, setInfo] = useState(new BoardInfo());
  const [game, setGame] = useState(new BoardObj());

  const [firstMove, setFirstMove] = useState(true);

  const dialogOpened = props.dialogType !== DialogType.CLOSED;
  const lastDialogType = useRef(props.dialogType);

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
    setFirstMove(true);
    setGame(new BoardObj());
    setInfo(new BoardInfo());
  }, []);

  const [showBoardListDialog, setBoardListDialog] = useState(false);
  const [showBoardRenameDialog, setBoardRenameDialog] = useState(false);
  const [boardsList, setBoardsList] = useState<BoardType[]|null>(null);

  return (
    <div id='main'>
      <Board
        board={game.board}
        firstMove={firstMove}
        setFirstMove={setFirstMove}
        setGame={setGame}
        dialogOpened={dialogOpened || showBoardRenameDialog ||showBoardListDialog}
      />
      <SidePane username={username} game={game} boardName={info.boardName}>
        {username === 'Guest' ? <>
          <button type='button' onClick={() => props.openDialog(DialogType.LOGIN)}> Log In </button>
          <button type='button' onClick={() => props.openDialog(DialogType.REGISTER)}> Register </button>
        </> : <>
          <BoardNamer showDialog={showBoardRenameDialog} closeDialog={()=> setBoardRenameDialog(false)} setBoardName={
            (str:string) => setInfo(info.changeName(str))
          }/>
          <button type='button' onClick={async ()=> {await downloadBoardsList(setBoardsList); setBoardListDialog(true)}}>Download Board</button>
          <button type='button' onClick={ ()=> setBoardRenameDialog(true)}>Rename Board</button>
          {
            info.boardId === -1 ? 
            <button type='button' onClick={() => uploadBoard(game, info.boardName)}>Upload Board</button> :
            <button type='button' onClick={() => updateBoard(info, game)}>Update Board</button>
          }

          <button type='button' onClick={ async() => { await logout(); checkLogIn(setUsername)}}> Log Out </button>
        </>
        }
        <button type='button' onClick={ resetBoard}> New Game </button>
        <BoardListDialog 
          showDialog={showBoardListDialog} 
          closeDialog={()=>setBoardListDialog(false)} 
          boardList={boardsList}
          setGame={ ( gm: BoardObj, boardName: string, id: number)=>{ 
            setGame(gm);
            setFirstMove(true); 
            setInfo(new BoardInfo(boardName, id));
          }}
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