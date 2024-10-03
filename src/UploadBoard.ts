import { SERVER_URL_BOARD } from "./constants";

function convertBoardToString(board: Uint8Array) {
  let boardString = ''
  board.forEach((el) => boardString += el.toString());   //I'll try to send the UintArray, and if that doesn't work, send the string
  return boardString;
}
export function uploadBoard(data: Uint8Array) {
  if(!confirm('Do you want to upload the current board?'))
    return;
  const dataObj = convertBoardToString(data);
  send(SERVER_URL_BOARD, dataObj);
}

export function send(url: string, dataObj: { [k: string]: FormDataEntryValue } | Uint8Array | string) {
  fetch(url, {
    credentials: 'include',		//needed to send and recieve cookies //we send it so it stops us to register if we're logged in
    //although I'll probably remove the register and login buttons if the user is already logged in
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(dataObj),
  }).then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}