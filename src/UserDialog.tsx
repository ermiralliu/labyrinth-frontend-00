import { FormEvent, useEffect, useMemo, useRef } from 'react';
import { SERVER_URL_LOGIN, SERVER_URL_REGISTER } from './constants';
import { DialogType } from './App';

function send(url:string, credentials: RequestCredentials, dataObj:{[k: string]: FormDataEntryValue}){
  fetch( url, {
    credentials,		//needed to send and recieve cookies
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(dataObj),
  }).then(res => res.json())
  .then(data => console.log(data))
  .catch( err => console.error(err));
}

export default function UserDialog(props:{dialogType: DialogType, closeDialog:()=>void}) {
  const dialogRef = useRef(null);
  useEffect(()=>{
    const dialogElement = dialogRef.current as unknown as HTMLDialogElement;
    dialogElement.showModal();
    dialogElement.addEventListener('keydown', (event)=>{
      event.preventDefault();
      props.closeDialog();
    })
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const formEventHandler = useMemo( ()=>{ //so it doesn't get reinitialized every time (althoug I'm not sure if that even matters here)
    return (event: FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement); //but we can't send this directly. It needs to be converted to a normal object
    const dataObj = Object.fromEntries(data);
    console.log(dataObj);
    if(props.dialogType === DialogType.LOGIN)  
      send(SERVER_URL_LOGIN, 'include', dataObj);
    else if(props.dialogType === DialogType.REGISTER)
      send(SERVER_URL_REGISTER, 'omit', dataObj);
  }},[props.dialogType]);

  return (
    <dialog ref={dialogRef}>
      <h1> {props.dialogType === DialogType.LOGIN ? 'Log In': 'Register'} </h1>
      <form onSubmit={formEventHandler}>
        <div>
          <label htmlFor="username">Username: </label> 
          <input name='username' id='username' type='text' defaultValue='' required></input>
        </div>
        <div>
        <label htmlFor="password">Password: </label> 
        <input name='password' id='password' type='password' defaultValue='' required></input>
        </div>
        <button type='submit'> Submit </button>
      </form>
    </dialog>
  );
}