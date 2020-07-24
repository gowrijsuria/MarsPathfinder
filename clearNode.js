//Clears everything except for start and end nodes 
function clearPath(){
  if(!running){

    for(let row = 0; row < nodes.length; row++){
      nodes[row].forEach(node => {
        if(node.state == STATE.PATH || node.state == STATE.VISITED)
          node.state = STATE.EMPTY;
        else if(node.state == STATE.VISITED_TERRAIN || node.state == STATE.TERRAIN_PATH)
          node.state = STATE.TERRAIN;
      });
    }
  }
}

//Changes state of empty nodes to wall nodes on left-click
function createWall(e){
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];
  if (cell.state != STATE.START && cell.state != STATE.XSTART && cell.state != STATE.FINISH && cell.state != STATE.XFINISH && cell.state != STATE.VIA){
    cell.state = STATE.WALL;
  }
}
//Changes state of wall nodes to empty nodes on right-click
function deleteWall(e){
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];

  if(cell.state == STATE.WALL) {
    cell.state = STATE.EMPTY;
  }
}

// Sets all wall nodes in nodes[][] to STATE.EMPTY
function clearWalls() {
  if(!running){
    for(let row = 0; row < nodes.length; row++){
      nodes[row].forEach(node => {
        if(node.state == STATE.WALL)
          node.state = STATE.EMPTY;
      });
    }
  }
}

function clearTerrain() {
 if(!running){
    for(let row = 0; row < nodes.length; row++){
      nodes[row].forEach(node => {
        if(node.state == STATE.TERRAIN || node.state == STATE.VISITED_TERRAIN || node.state == STATE.TERRAIN_PATH)
          node.state = STATE.EMPTY;
      });
    }
  } 
}

function ClearVia() {
  if(!running){
    for(let row = 0; row < nodes.length; row++){
      nodes[row].forEach(node => {
        if(node.state == STATE.VIA)
          node.state = STATE.EMPTY;
      });
    }
    // enable_via = true;
    viaOrnot =false;
  }
}

function ClearDest() {
    if (!running) {
        let len = dest.length;
        for (let end = len - 1; end >= 0; end--) {
            nodes[dest[end].row][dest[end].col].state = STATE.EMPTY;
            multidest -= 1;
            dest.pop();
        }
    }
}

function ClearStartPoints() {
    if (!running) {
        let len = start.length;
        for (let end = len - 1; end >= 0; end--) {
            nodes[start[end].row][start[end].col].state = STATE.EMPTY;
            multistart -= 1;
            start.pop();
        }
    }
}