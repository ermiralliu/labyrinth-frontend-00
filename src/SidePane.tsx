// import { useEffect, useState } from "react";
// import { SERVER_URL_LOGIN } from "./constants";

export default function SidePane(props:{score:number, children: JSX.Element}) :JSX.Element{
    //const [user, setUser] = useState('guest');
    const user = 'guest';
    // useEffect(()=>{
    //     fetch( SERVER_URL_LOGIN, {
    //         method: 'GET'
    //     }).then(res => res.json())
    //     .then(data => setUser(data.username))
    //     .catch(err => console.error(err));
    // },[])

    
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