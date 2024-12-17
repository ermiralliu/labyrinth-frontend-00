import { MazeOptions, makeLab } from "../LabyrinthLogic/Generator";

function generateBoard() {
  const x = Math.floor(Math.random() * MazeOptions.WIDTH);
  const y = Math.floor(Math.random() * MazeOptions.HEIGHT);
  return makeLab(x, y);
}

export class BoardObj{

  constructor(
    public readonly points = 0, 
    public readonly level = 1, 
    public readonly board = generateBoard()
  ) {}
  
  readonly nextMove = (board: Uint8Array, addPoints: number = 0) => new BoardObj(this.points+addPoints, this.level, board);

  readonly nextLevel = (x: number, y: number) => new BoardObj(this.points+1, this.level+1, makeLab((x-1)/2,(y-1)/2));

}

export class BoardInfo{
  constructor(
    public readonly boardName = 'Default', 
    public readonly boardId = -1
  ) {}
  readonly changeName = (name: string) => new BoardInfo(name, this.boardId);
}