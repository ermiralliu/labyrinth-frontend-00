import { TileType } from "./LabyrinthLogic/Generator"

export default function Tile(props:{type:number}){  //props.children contains the type
    let src = '';
    let altText = '';
    switch(props.type){
        case TileType.ROAD:
            src = '/Assets/Asphalt.jpg';
            altText = 'Road';
            break;
        case TileType.WALL:
            src = '/Assets/Lava.png';
            altText = 'Lava';
            break;
        case TileType.COIN:
            src = '/Assets/Coin.jpg';
            altText = 'Coin';
            break;
        case TileType.PLAYER:
            src = '/Assets/Player.png';
            altText = 'Player';
            break;
        case TileType.FINISH:
            src = '/Assets/Flag.png';
            altText = 'Finish';
            break;
    }
    // new URL(src, import.meta.url).href
    return <img className='tile' src={ src } alt={altText} />
}