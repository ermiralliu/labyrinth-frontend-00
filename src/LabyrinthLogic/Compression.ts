import { TileBoardOptions } from "./Generator";

export function prematurelyOptimizedMatrixCompression(matrix: Uint8Array){
    const totalLength = TileBoardOptions.HEIGHT*TileBoardOptions.WIDTH;
    const optimizedArr = new Uint8Array(Math.floor(totalLength/4+1));
    optimizedArr.fill(0);
    for(let i=0; i< totalLength; ++i){
        const wordIndex = i%4;  //we have 4 main numbers, which can be saved in 2 bits, the matrix itself is 8 bits
        const currentIndex = Math.floor(i/4);
        
        const offset = 6 - 2*(wordIndex);
        optimizedArr[currentIndex] |= matrix[i] << offset;
    }
    return optimizedArr;
}

export function convertToTiles(matrix:Uint8Array){    //I guess it was cool to work in a lower level
    const totalLength = TileBoardOptions.HEIGHT*TileBoardOptions.WIDTH;
    const uncompressedArr = new Uint8Array(totalLength);

    for(let i=0; i< uncompressedArr.length; ++i){
        const index = Math.floor(i / 4);
        const offset = 6 - ((i % 4) * 2);   //we have 4 groups in each index, we need to start from the 2 bits on the left and so on

        uncompressedArr[i] = (matrix[index] >> offset) %4
    }
    uncompressedArr[uncompressedArr.length-1] = 1; //the last one is always going to be a wall anyway //actually, the entire final row
    return uncompressedArr;
}