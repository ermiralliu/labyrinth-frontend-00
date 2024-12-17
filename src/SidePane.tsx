import { BoardObj } from "./SupportingLogic/BoardClasses"

export default function SidePane(props: { 
  username:string, 
  game: BoardObj
  children: JSX.Element[] ,
  boardName: string
}): JSX.Element {
  const {points, level} = props.game;
  return (
    <aside id='side-pane'className='lightGray'>
      <h2>
        User: {props.username}
      </h2>
      <h2>
        Board Name: {props.boardName}
      </h2>
      <h1>
        Score: {points}
      </h1>
      <h1>
        Level: {level}
      </h1>
      <div id='side-buttons'>
        {props.children}
      </div>
    </aside>
  )
}