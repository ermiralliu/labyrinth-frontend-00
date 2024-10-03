import { useState, useEffect } from "react";
import { SERVER_URL_LOGIN } from "./constants";

export default function SidePane(props: { score: number, children: JSX.Element[] }): JSX.Element {
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
    <aside>
      <h2>
        {user}
      </h2>
      <h1>
        {props.score}
      </h1>
      {props.children}
    </aside>
  )
}