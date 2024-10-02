import { FormEvent, useEffect, useMemo, useRef } from 'react';
import { SERVER_URL_LOGIN } from './constants';

export default function LogIn() {
  const dialogRef = useRef(null);
  useEffect(()=>{
    (dialogRef.current as unknown as HTMLDialogElement).showModal();
  },[])

  const formEventHandler = useMemo( ()=>{ //so it doesn't get reinitialized every time (althoug I'm not sure if that even matters here)
    return (event: FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement); //but we can't send this directly. It needs to be converted to a normal object
    const dataObj = Object.fromEntries(data);
    console.log(dataObj);
    fetch( SERVER_URL_LOGIN, {
      credentials: 'include',		//needed to send and recieve cookies
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
  },[])

  return (
    <dialog ref={dialogRef}>
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