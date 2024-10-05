export default function SidePane(props: { 
  username:string, 
  score: number, 
  level: number, 
  children: JSX.Element[] ,
  boardName: string
}): JSX.Element {

  return (
    <aside id='side-pane'className='lightGray'>
      <h2>
        User: {props.username}
      </h2>
      <h2>
        Board Name: {props.boardName}
      </h2>
      <h1>
        Score: {props.score}
      </h1>
      <h1>
        Level: {props.level}
      </h1>
      <div id='side-buttons'>
        {props.children}
      </div>
    </aside>
  )
}