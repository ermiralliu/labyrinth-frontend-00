import { BoardType, downloadBoard } from "../SupportingLogic/DownloadBoards";
import MyDialog from "./MyDialog";

export default function BoardListDialog(props: {
  showDialog: boolean,
  closeDialog: () => void,
  boardList: BoardType[]|null
  setGame: (b: Uint8Array, level: number, points: number, boardName: string)=> void
  setBoardId: (id: number)=> void 
}) {
  if(props.boardList === null)
    return <></>
  
  return (
    <MyDialog
      showDialog={props.showDialog}
      closeDialog={props.closeDialog}
    >
      <table>
        <thead> Board List </thead>
        <tbody>
          <tr>
            {
              Object.keys(props.boardList[0]).map( key => (<th key={key}> {key}</th>))
            }
          </tr>
          {
            props.boardList.map((element, index) => (
              <tr key={index}>
                {
                  Object.values(element).map((value, index) => (
                    <td key={index}> {value} </td>
                  ))
                }
              <td> <button type='button' onClick={()=> {props.setBoardId(element.boardId); downloadBoard(element.boardId, props.setGame); props.closeDialog()}}> Download </button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </MyDialog>
  )
}