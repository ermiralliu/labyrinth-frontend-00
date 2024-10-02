export const MazeOptions = Object.freeze({
    WIDTH: 10,
    HEIGHT: 10
});

export const TileBoardOptions = Object.freeze({
    WIDTH: MazeOptions.WIDTH*2+1,
    HEIGHT: MazeOptions.HEIGHT*2+1
})

const Coordinates : {[key: string]:{ x: number, y: number}} = Object.freeze({
    N : {x: 0, y: -1},
    S : {x: 0, y: 1},
    E : {x : 1, y: 0},  //east is right, west is left, just to be sure
    W : {x: -1, y: 0},
});

export const TileType = Object.freeze({
    ROAD: 0,
    WALL: 1,
    COIN: 2,
    FINISH: 3,
    PLAYER: 4,
});

export function makeLab(x:number, y:number){
    //initialization
    const stack: Array<{x:number, y:number}> = [];
    
    const visited = new Uint8Array(MazeOptions.WIDTH * MazeOptions.HEIGHT);   //needed to check if a neighboring cell is visited
    visited.fill(0);
    
    const tiles = (()=>{
        const tileArray = new Uint8Array(TileBoardOptions.WIDTH * TileBoardOptions.HEIGHT);
        for(let j=0; j< TileBoardOptions.HEIGHT; ++j){
            for(let i = 0; i< TileBoardOptions.WIDTH; ++i){
                if(i%2 ===0 || j%2 === 0)    
                    tileArray[i+j*TileBoardOptions.WIDTH] = TileType.WALL;
                else
                    tileArray[i+j*TileBoardOptions.WIDTH] = TileType.ROAD;
            }
        }
        return tileArray;
    })();

    stack.push({x,y});
    
    const offset = (x: number, y: number) => stack[stack.length-1].x+ x + MazeOptions.WIDTH*(stack[stack.length-1].y+ y);    //this captures the stack, so it'll always give the top;
    const stackPush = (i: number, j:number) => {    //enter the offset to push to the stack, based on the previous position
        const top = stack[stack.length-1];
        let {x,y} = top;
        x+=i;
        y+=j;
        stack.push({x,y});
    }

    visited[offset(0,0)] = 1;
    //the loop
    let count =0;
    let mainRoad = true;
    while(stack.length>0){  //while the stack is not empty
        count++;
        const top = stack[stack.length-1];
        const neigbors: string[] = [];

        visited[offset(0,0)] = 1;

        if(top.y > 0 && visited[offset(0,-1)] === 0) //North Neighbor
                neigbors.push('N');
        if(top.y < MazeOptions.HEIGHT-1 && visited[offset(0,1)] === 0) //South Neighbors
                neigbors.push('S');
        if(top.x > 0  && visited[offset(-1,0)] === 0)  //WEST Neighbor
                neigbors.push('W');
        if(top.x < MazeOptions.WIDTH-1 && visited[offset(1,0)] === 0) //EAST Neighbor
                neigbors.push('E');

        if(neigbors.length > 0){    //if there are neighboring cells unvisited
            const neighIndex = Math.floor(Math.random()*neigbors.length);
            const nextDir = neigbors[neighIndex];
            const offs = Coordinates[nextDir];

            tiles[top.x*2+1+offs.x + (top.y*2+1+offs.y)*TileBoardOptions.WIDTH] = TileType.ROAD;    //clears the wall of that direction in the tile matrix
            stackPush( offs.x, offs.y );
        }
        else{
            if(mainRoad){
                mainRoad = false;
                tiles[2*top.x+1 + (2*top.y+1)*TileBoardOptions.WIDTH] = TileType.FINISH;
            }
            stack.pop();
        }
            
    }
    for( let i =0; i< tiles.length; i++){
        if(tiles[i]=== TileType.ROAD && Math.floor(Math.random()*5)=== 0)
            tiles[i] = TileType.COIN;
    }
    tiles[2*x+1 + (2*y+1)*TileBoardOptions.WIDTH] = TileType.PLAYER;
    
    console.log(count);
    return tiles;
}