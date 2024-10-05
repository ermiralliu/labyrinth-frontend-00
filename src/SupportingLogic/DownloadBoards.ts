import { SERVER_URL_BOARD } from "./constants";

export type BoardType = { boardId: number, boardName: string, date: string };


//these could be made much shorter but whatever. We ride for now
export async function downloadBoardsList(setBoardList: (board: BoardType[]) => void) {
  await fetch(SERVER_URL_BOARD, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }).then((res) => {
    if (res.ok)
      return res.json();
    throw new Error('The response is not okey');
  }).then(res => setBoardList(res))
    .catch(err => console.log(err));
}

export function downloadBoard(boardId: number, setGame: (b: Uint8Array, level: number, points: number, boardName: string)=> void){
  fetch(SERVER_URL_BOARD + '/' + boardId, {
    credentials: 'include',		//needed to send and recieve cookies //we send it so it stops us to register if we're logged in
    //although I'll probably remove the register and login buttons if the user is already logged in
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }).then((res) => {
    if (res.ok)
      return res.json();
    throw new Error('The response is not okay');
  }).then(res => {
    console.log(res);
    setGame(convertStringToBoard(res.boardString), res.level, res.points, res.boardName)}
  )
    .catch(err => console.log(err));
}

function convertStringToBoard(board: string){
  const boardArray = new Uint8Array(board.length);
  for(let i = 0; i< board.length; ++i){
    boardArray[i] = parseInt(board.charAt(i));
  }
  return boardArray;
}