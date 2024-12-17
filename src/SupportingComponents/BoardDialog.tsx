import { BoardObj } from "../SupportingLogic/BoardClasses";
import { BoardType, downloadBoard } from "../SupportingLogic/DownloadBoards";
import MyDialog from "./MyDialog";

export default function BoardListDialog(props: {
  showDialog: boolean,
  closeDialog: () => void,
  boardList: BoardType[]|null
  setGame: (gm: BoardObj, boardName: string, id: number)=> void
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
              <td> <button type='button' onClick={()=> {
                // props.setBoardId(element.boardId);
                const setGame = (board: BoardObj, boardName: string) => props.setGame(board, boardName, element.boardId);
                downloadBoard(element.boardId, setGame); 
                props.closeDialog()
              }}> Download </button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </MyDialog>
  )
}