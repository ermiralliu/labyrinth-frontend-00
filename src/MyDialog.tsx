import { useEffect, useRef} from "react";

export default function MyDialog({ children, closeDialog }: { children: JSX.Element | JSX.Element[], closeDialog: ()=>void}) {
  const dialogRef = useRef(null);

  const closeDialogRef = useRef(closeDialog);
  useEffect(()=>{
    const dialogElement = dialogRef.current as unknown as HTMLDialogElement;
    dialogElement.showModal();
    dialogElement.addEventListener('keydown',()=>{
      closeDialogRef.current();
    });
  }, []);

  return (
    <dialog ref={dialogRef}>
      {children}
    </dialog>
  )
}