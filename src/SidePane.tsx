import { useState, useEffect } from "react";
import { SERVER_URL_LOGIN } from "./constants";

export default function SidePane(props: { score: number, level:number, children: JSX.Element[] }): JSX.Element {
  const [user, setUser] = useState('guest');
  useEffect(() => {
    fetch(SERVER_URL_LOGIN, {
      method: 'GET'
    }).then(res => res.json())
      .then(data => {
        if (data.username)
          setUser(data.username)
      }).catch(err => console.error(err));
  }, [])

  return (
    <aside id='side-pane'className='lightGray'>
      <h2>
        User: {user}
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