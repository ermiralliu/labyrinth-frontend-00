import { useEffect, useMemo, useRef, useState } from "react"
import { makeLab, MazeOptions, TileBoardOptions, TileType } from "./LabyrinthLogic/Generator"
import Tile from "./Tile";
import SidePane from "./SidePane";

export default function Game(props: { dialogOpened: boolean, toggleDialog: ()=> void }): JSX.Element {
  const starting = useMemo(()=> {
    const x =  Math.floor(Math.random()*MazeOptions.WIDTH);
    const y = Math.floor(Math.random()*MazeOptions.HEIGHT);
    const board = makeLab(x,y)
    return {
        x,
        y,
        board
    };
  }, []);  //only calculated once

  const [board, setBoard] = useState(starting.board);  //everytime the board is changed, so are the Table and the SidePane

  const player = useRef({ x: starting.x * 2 + 1, y: starting.y * 2 + 1, points: 0 });

  const boardRef = useRef(board); //So we don't put board in the dependency array on useEffect;

  const gameEvent = useMemo(()=>{ 
    //we need to keep this function the same if we want to remove it later, cause React reinitializes it each time, so removeEventListener didn't recognize it
    return (event: { preventDefault: () => void; key: string; })=> {
      if (!['a', 's', 'd', 'w'].includes(event.key))
        return;
      event.preventDefault();
      console.log(event.key);
      const nextBoard = boardRef.current.slice(); //making the copy
      let { x, y } = player.current;
      switch (event.key) {
        case 'a':
          x -= 1;
          break;
        case 's':
          y += 1;
          break;
        case 'd':
          x += 1;
          break;
        case 'w':
          y -= 1;
          break;
      }

      if(boardRef.current[x + y * TileBoardOptions.WIDTH] === TileType.WALL)
        return;
      let points = player.current.points;
      if(boardRef.current[x + y * TileBoardOptions.WIDTH] ===TileType.COIN)
        points++;
      nextBoard[player.current.x + player.current.y * TileBoardOptions.WIDTH] = TileType.ROAD;
      nextBoard[x + y * TileBoardOptions.WIDTH] = TileType.PLAYER;

      boardRef.current = nextBoard;
      player.current = { x, y, points };
      
      setBoard(nextBoard);
    }
  }, [])  //empty cause it never changes

  useEffect(() => {
    //here we add a keyboard listener that uses setBoard to make stuff up
    if(props.dialogOpened){
      window.removeEventListener('keydown', gameEvent);
      console.log('eventlistener removed')
      return;
    }

    window.addEventListener('keydown', gameEvent);  //this only ends up being assigned when the dialog isn't opened, and the useEffect only has two variants
    console.log('eventlistener added')
    //return ()=> window.removeEventListener('keydown', gameEvent);
  }, [props.dialogOpened, gameEvent]); //gameEvent doesn't change, but we're putting it here cause it's required


  const tileBoard: JSX.Element[] = [];
  {   //making a block for readability, where I fill the tileBoard JSX array
    for (let y = 0; y < TileBoardOptions.HEIGHT; ++y) {
      const row = [];
      for (let x = 0; x < TileBoardOptions.WIDTH; ++x) {
        row.push(<Tile key={x} type={board[x + y * TileBoardOptions.WIDTH]} />);
      }
      tileBoard.push(<div key={y}>{row}</div>);
    }
  };

  return (
    <div id='main'>
      <section>
        {tileBoard}
      </section>
      <SidePane score={player.current.points}>
        <button type='button' onClick={props.toggleDialog}> Log In </button>
      </SidePane>
    </div>
  )
}