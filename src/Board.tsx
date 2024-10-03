import { useEffect, useMemo, useRef, useState } from "react";
import { TileBoardOptions, TileType } from "./LabyrinthLogic/Generator";
import Tile from "./Tile";

export default function Board(props:{ dialogOpened: boolean, startingBoard: Uint8Array, updatePoints:()=>void}): JSX.Element {
  const [board, setBoard] = useState(props.startingBoard);
  
  const boardRef = useRef(props.startingBoard); //So we don't put board in the dependency array on useEffect;
  const player = useRef( (()=>{  //initializiation of Player
    const index = board.findIndex(element=> element === TileType.PLAYER);
    const x = index % TileBoardOptions.WIDTH;
    const y = (index - x)/TileBoardOptions.WIDTH; 
    return{
      x,
      y
    }
  })());
  const makePlayer = useMemo(()=> ()=>{  //initializiation of Player
    const index = boardRef.current.findIndex(element=> element === TileType.PLAYER);
    const x = index % TileBoardOptions.WIDTH;
    const y = (index - x)/TileBoardOptions.WIDTH; 
    return{
      x,
      y
    }
  },[]);
  useEffect(()=>{
    setBoard(props.startingBoard);
    boardRef.current = props.startingBoard;
    player.current = makePlayer();;
  },[props.startingBoard, makePlayer]); //makePlayer will never change anyway
  
  const updatePointsRef = useRef(props.updatePoints); //we create this, so we don't have to put props.updatePoints in any dependency arrays
  const gameEvent = useMemo(() => {
    //we need to keep this function the same if we want to remove it later, cause React reinitializes it each time, so removeEventListener didn't recognize it
    return (event: { preventDefault: () => void; key: string; }) => {
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

      if (boardRef.current[x + y * TileBoardOptions.WIDTH] === TileType.WALL)
        return;
      if (boardRef.current[x + y * TileBoardOptions.WIDTH] === TileType.COIN)
        updatePointsRef.current();
      nextBoard[player.current.x + player.current.y * TileBoardOptions.WIDTH] = TileType.ROAD;
      nextBoard[x + y * TileBoardOptions.WIDTH] = TileType.PLAYER;

      boardRef.current = nextBoard;
      player.current = { x, y };

      setBoard(nextBoard);
    }
  }, [])  //This should technically never or rarely change, so it should hopefully not be a problem

  useEffect(() => {
    //here we add a keyboard listener that uses setBoard to make stuff up
    window.removeEventListener('keydown', gameEvent);//we remove this every time, just to be sure;
    if (props.dialogOpened) {
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
    <section>
      {tileBoard}
    </section>
  )

}