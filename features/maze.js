function recursive_maze(rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    // let relevantIds = [board.start, board.target];
    // if (board.object) relevantIds.push(board.object);
    const BOARD_HEIGHT = nodes.length;
    const BOARD_WIDTH = nodes[0].length;
    for(let row = 0; row < nodes.length; row++)
    {
      for(let col = 0; col < nodes[row].length; col++)
      {
        node = nodes[row][col];
        if (node.state != STATE.START && node.state != STATE.XSTART && node.state != STATE.FINISH && node.state != STATE.XFINISH && node.state != STATE.WALL)
        {
          if(row === 0 || col === 0 || row === BOARD_HEIGHT - 1 || col === BOARD_WIDTH - 1)
          {
            node.state = STATE.WALL;
          }
        }
      }
    }
    
    surroundingWalls = true;
  }
  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    for(let row = 0; row < nodes.length; row++)
    {
      for(let col = 0; col < nodes[row].length; col++)
      {
        node = nodes[row][col];
        if(row === currentRow && col !== colRandom && col >= colStart - 1 && col <= colEnd + 1)
        {
          if (node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.XSTART && node.state != STATE.XFINISH && node.state != STATE.WALL) 
         {
          node.state = STATE.WALL;
         }
        }
      }
    }
    
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursive_maze(rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursive_maze(rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursive_maze(currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
    } else {
      recursive_maze(currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
    }
  } 
  else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];

    for(let row = 0; row < nodes.length; row++)
    {
      for(let col = 0; col < nodes[row].length; col++)
      {
        node = nodes[row][col];
        if(col === currentCol && row !== rowRandom && row >= rowStart - 1 && row <= rowEnd + 1)
        {
          if (node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.XSTART && node.state != STATE.XFINISH && node.state != STATE.WALL) 
         {
          node.state = STATE.WALL;
         }
        }
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursive_maze(rowStart, rowEnd, colStart, currentCol - 2, "vertical", surroundingWalls);
    } else {
      recursive_maze(rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursive_maze(rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
    } else {
      recursive_maze(rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
    }
  }
}
