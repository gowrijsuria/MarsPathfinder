function drawRect(x, y, width, height, state, colour = null) {
  if(colour){
    ctx.fillStyle = colour;
  } else {
    if (state == STATE.START)
    ctx.fillStyle = "#1fd613";
    else if (state == STATE.FINISH)
      ctx.fillStyle = "#e81344";
    else if (state == STATE.TERRAIN)
      {
        ctx.fillStyle = "#a34a40";
        console.log("Terrain detected!!")
      }
    else if (state == STATE.WALL)
      ctx.fillStyle = "#696969";
    else if (state == STATE.VIA)
      ctx.fillStyle = "#146c91";
    else if (state == STATE.PATH)
      ctx.fillStyle = "#ebeb2a";
    else if (state == STATE.VISITED)
      ctx.fillStyle = "#58c4b7";
    else
      ctx.fillStyle = "#ffcc99";
  }

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.closePath();
  ctx.fill();
}

//Creates a 2d grid of nodes and stores them in the global nodes[] array
function createGrid() {
  for(let row = 0; row < num_rows; row++) {
    nodes[row] = [];
    for(let col = 0; col < num_cols; col++) {
      nodes[row][col] = {
        x: col *(rectWidth + 1),
        y: row * (rectHeight + 1),
        state: STATE.EMPTY,
        prevState: STATE.EMPTY, // used for when the start/end nodes are being moved
        weight: 0
      };
    }
  }
  nodes[startNode.row][startNode.col].state = STATE.START;
  nodes[finishNode.row][finishNode.col].state = STATE.FINISH;
  BOARD_HEIGHT = nodes.length;
  BOARD_WIDTH = nodes[0].length;
}

//renders grid by drawing the rectangles
function drawGrid(){
  clear();
  for(row = 0; row < num_rows; row++){
    for(col = 0; col < num_cols; col++){
      cell = nodes[row][col];
      drawRect(cell.x, cell.y, rectWidth, rectHeight, cell.state);
    }
  }
}
