import { FormEvent, useMemo } from 'react';
import { SERVER_URL_LOGIN, SERVER_URL_REGISTER } from '../SupportingLogic/constants';
import { DialogType } from '../App';
import { send } from '../SupportingLogic/UploadBoard';

export default function UserForm(props:{
  dialogType: DialogType,
  closeDialog: ()=> void
}) {

  const formEventHandler = useMemo( ()=>{ //so it doesn't get reinitialized every time (althoug I'm not sure if that even matters here)
    return async (event: FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement); //but we can't send this directly. It needs to be converted to a normal object
    const dataObj = Object.fromEntries(data);
    console.log(dataObj);
    if(!confirm('Are you sure you want to proceed?'))
      return;
    if(props.dialogType === DialogType.LOGIN)
      await send(SERVER_URL_LOGIN, dataObj, 'POST');        //I needed to do these awaits cause they'd fire and the dialog would be closed before they finished, and the user wouldn't be loaded when I wanted it to
    else if(props.dialogType === DialogType.REGISTER)
      await send(SERVER_URL_REGISTER, dataObj, 'POST');
    props.closeDialog();
  }}, [props]);

  return (
    <>
      <h1> {props.dialogType === DialogType.LOGIN ? 'Log In': 'Register'} </h1>
      <form onSubmit={async (event)=>await formEventHandler(event)}>
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