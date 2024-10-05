import { useEffect, useMemo, useRef } from "react"; //We ended up not having a single state in here, tf
import { makeLab, TileBoardOptions, TileType } from "./LabyrinthLogic/Generator";
import Tile from "./SupportingComponents/Tile";

function findPlayer(board: Uint8Array){
  const index = board.findIndex(element=> element === TileType.PLAYER);
  const x = index % TileBoardOptions.WIDTH;
  const y = (index - x)/TileBoardOptions.WIDTH; 
  console.log('Starting position: ' +x+', ' +y)
  console.log('initialized new player on new board')
  return{ x, y }
}

export default function Board( props:{ 
  dialogOpened: boolean, 
  board: Uint8Array, 
  level: number,
  firstMove: boolean,
  setFirstMove: (isItTrue: boolean)=> void
  setBoard: (arr:Uint8Array) => void,
  resetBoard: () => void,
  updateLevel: () => void,
  updatePoints:() => void
}): JSX.Element {
  
  const boardRef = useRef(props.board); //We need this, cause we only want to add one EventListener, and if we use the board itself, we'll need to remove and add the action listener each time

  useEffect(()=>{ //everytime the board is changed
    console.log('updated board reference')
    boardRef.current = props.board
  }, [props.board]); //makePlayer will never change anyway

  const player = useRef({x:1, y:1}); //it will immediately be initialized to the correct value below anyway;

  const {firstMove, board, setFirstMove }= props;
  useEffect(()=>{
    if(firstMove){
      console.log('finding Player');
      player.current = findPlayer(board);
      setFirstMove(false);
    }
  }, [firstMove, board, setFirstMove]);
  
  const updateGameRef = useRef((()=>{// in-place initialization
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {dialogOpened, board, level, ...rest} = props;
    return rest;
  })()); //we create this, so we don't have to put these in any dependency arrays

  const gameEvent = useMemo(() => {
    //we need to keep this function the same if we want to remove it later, cause React reinitializes it each time, so removeEventListener didn't recognize it
    return (event: { preventDefault: () => void; key: string; }) => {
      if (!['a', 's', 'd', 'w'].includes(event.key))
        return;
      event.preventDefault();
      //console.log(event.key);
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
      const nextPosition = boardRef.current[x + y * TileBoardOptions.WIDTH];
      switch(nextPosition){
        case TileType.WALL:
          updateGameRef.current.resetBoard();
          alert('Current Game Lost');
          return;
        case TileType.COIN:
          updateGameRef.current.updatePoints();
          break;
        case TileType.FINISH:
          updateGameRef.current.updateLevel();
          updateGameRef.current.setBoard(makeLab((x-1)/2,(y-1)/2));
          player.current = { x, y }
          return;
      }
      nextBoard[player.current.x + player.current.y * TileBoardOptions.WIDTH] = TileType.ROAD;
      nextBoard[x + y * TileBoardOptions.WIDTH] = TileType.PLAYER;

      player.current = { x, y };
      //console.log('Current coordinates:'+x+', '+y);
      updateGameRef.current.setBoard(nextBoard);
    }
  }, []);

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