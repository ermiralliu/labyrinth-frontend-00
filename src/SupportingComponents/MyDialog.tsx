import { useEffect, useRef} from "react";

export default function MyDialog({showDialog, closeDialog, children}: {
  showDialog: boolean, 
  closeDialog: ()=>void,
  children: JSX.Element | JSX.Element[]
}){
  return(
  <>
  { showDialog ?
    <DialogHelper closeDialog={ closeDialog } >
      {children}
    </DialogHelper> : 
    <></>
  }
  </>
  )
}

export function BoardNamer(props:{
  setBoardName: (name:string)=> void, 
  showDialog: boolean, 
  closeDialog: ()=> void}
){
  return (
    <MyDialog showDialog={props.showDialog} closeDialog={props.closeDialog}>
      <form onSubmit={(event)=>{
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        props.setBoardName(data.boardName as string);
        props.closeDialog();
      }}>
        <label htmlFor='boardName'>Name of Board: </label>
        <input type='text' name='boardName' id='boardName'></input>
        <button type='submit'> Rename </button>
      </form>
    </MyDialog>
  )
}

function DialogHelper({ children, closeDialog }: { children: JSX.Element | JSX.Element[], closeDialog: ()=>void}) {
  const dialogRef = useRef(null);

  const closeDialogRef = useRef(closeDialog);
  useEffect(()=>{
    const dialogElement = dialogRef.current as unknown as HTMLDialogElement;
    dialogElement.showModal();
    dialogElement.addEventListener('keydown',(event)=>{
      if(event.key === 'Escape')
        closeDialogRef.current();
    });
  }, []);

  return (
    <dialog ref={dialogRef}>
      {children}
    </dialog>
  )
}