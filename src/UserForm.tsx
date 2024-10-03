import { FormEvent, useMemo } from 'react';
import { SERVER_URL_LOGIN, SERVER_URL_REGISTER } from './constants';
import { DialogType } from './App';
import { send } from './UploadBoard';

export default function UserForm(props:{dialogType: DialogType}) {
  

  const formEventHandler = useMemo( ()=>{ //so it doesn't get reinitialized every time (althoug I'm not sure if that even matters here)
    return (event: FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement); //but we can't send this directly. It needs to be converted to a normal object
    const dataObj = Object.fromEntries(data);
    console.log(dataObj);
    if(!confirm('Are you sure you want to proceed?'))
      return;
    if(props.dialogType === DialogType.LOGIN)  
      send(SERVER_URL_LOGIN, dataObj);
    else if(props.dialogType === DialogType.REGISTER)
      send(SERVER_URL_REGISTER, dataObj);
  }},[props.dialogType]);

  return (
    <>
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
    </>
  );
}