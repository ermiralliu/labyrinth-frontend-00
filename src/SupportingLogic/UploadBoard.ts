import { SERVER_URL_BOARD } from "./constants";

function convertBoardToString(board: Uint8Array) {
  let boardString = ''
  board.forEach((el) => boardString += el.toString());   //I'll try to send the UintArray, and if that doesn't work, send the string
  return boardString;
}
export function uploadBoard(data: Uint8Array, points: number, level: number, boardName: string) {
  if(!confirm('Do you want to upload the current board?'))
    return;
  const dataObj = {
    points,
    level,
    boardName,
    boardString:  convertBoardToString(data)
  };
  send(SERVER_URL_BOARD, dataObj, 'POST');
}

export async function send(url: string, dataObj: { [k: string]: FormDataEntryValue| number| string } | Uint8Array | string, method: string) {
  try{ 
    const _res = await fetch(url, {
      credentials: 'include',		//needed to send and recieve cookies //we send it so it stops us to register if we're logged in
      //although I'll probably remove the register and login buttons if the user is already logged in
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method,
      body: JSON.stringify(dataObj),
    })
    const response = await _res.json();
    if(response.message)
      alert(response.message);
    else
      alert('No message recieved');
  } catch (e){
    console.log(e);
  }
}

export function updateBoard(boardId:number, data: Uint8Array, points: number, level: number, boardName: string) {
  if(!confirm('Do you want to update the current board?'))
    return;
  const dataObj = {
    boardId,
    points,
    level,
    boardName,
    boardString:  convertBoardToString(data)
  };
  send(SERVER_URL_BOARD, dataObj, 'PUT');
}