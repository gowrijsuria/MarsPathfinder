// Moves the start node when dragged
function moveStartNode(e){
  let col = getCol(getX(e));
  let row = getRow(getY(e));

  let cell1 = nodes[startNode.row][startNode.col];
  let cell2 = nodes[row][col];

  if (cell2.state != STATE.FINISH && cell2.state != STATE.XFINISH && cell2.state != STATE.START && cell2.state != STATE.XSTART && cell2.state != STATE.WALL && cell2.state != STATE.VIA)
  {
    cell1.state = cell1.prevState;
    cell1.prevState = STATE.EMPTY;
    startNode.row = row;
    startNode.col = col;

    cell1 = nodes[startNode.row][startNode.col];
    cell1.prevState = cell1.state;
    cell1.state = STATE.START;
  }
}

// Moves the finish node when dragged
function moveFinishNode(e) {
    let col = getCol(getX(e));
    let row = getRow(getY(e));
    let cell1 = nodes[finishNode.row][finishNode.col];
    let cell2 = nodes[row][col];

  if (cell2.state != STATE.START && cell2.state != STATE.XSTART && cell2.state != STATE.WALL && cell2.state != STATE.FINISH && cell2.state != STATE.XFINISH && cell2.state != STATE.VIA)
    {
      cell1.state = cell1.prevState;
      cell1.prevState = STATE.EMPTY;
      finishNode.row = row;
      finishNode.col = col;

      cell1 = nodes[finishNode.row][finishNode.col];
      cell1.prevState = cell1.state;
      cell1.state = STATE.FINISH;
    }
}

function moveViaNode(e) {
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell1 = nodes[viaNode.row][viaNode.col];
  let cell2 = nodes[row][col];

  if (cell2.state != STATE.START && cell2.state != STATE.XSTART && cell2.state != STATE.WALL && cell2.state != STATE.FINISH && cell2.state != STATE.XFINISH)
  {
    cell1.state = cell1.prevState;
    cell1.prevState = STATE.EMPTY;

    viaNode.row = row;
    viaNode.col = col;

    cell1 = nodes[viaNode.row][viaNode.col];
    cell1.prevState = cell1.state;
    cell1.state = STATE.VIA;
  }
}