import { useEffect, useMemo, useRef} from "react";
import { TileBoardOptions, TileType } from "./LabyrinthLogic/Generator";
import Tile from "./Tile";

export default function Board(props:{ dialogOpened: boolean, board: Uint8Array, setBoard: (arr:Uint8Array)=> void,updatePoints:()=>void}): JSX.Element {
  const boardRef = useRef(props.board); //So we don't put board in the dependency array on useEffect;
  const makePlayer = useMemo(()=> ()=>{  //initializiation of Player
    const index = boardRef.current.findIndex(element=> element === TileType.PLAYER);
    const x = index % TileBoardOptions.WIDTH;
    const y = (index - x)/TileBoardOptions.WIDTH; 
    return{
      x,
      y
    }
  },[]);
  const player = useRef(makePlayer());
  
  const setBoardRef = useRef(props.setBoard);
  useEffect(()=>{ //everytime the board is changed
    boardRef.current = props.board
    player.current = makePlayer();
  },[makePlayer, props.board]); //makePlayer will never change anyway
  
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

      setBoardRef.current(nextBoard);
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
        row.push(<Tile key={x} type={props.board[x + y * TileBoardOptions.WIDTH]} />);
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