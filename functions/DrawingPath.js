async function drawViaPath(parent, beginNode, endpt, oldpath) {
  clearPath();
  var path = [];
  
  path.push(endpt);
  let endNode = endpt;
  while (!(endNode.row == beginNode.row && endNode.col == beginNode.col)) {
    endNode = parent.get(`${endNode.row},${endNode.col}`);
    path.push(endNode);
  }

  fpath = path.concat(oldpath);
  await sleep(20);
  return fpath;
}

//Given an array of {row, col} tuples, this function will change the state of each node to STATE.PATH
async function drawPath(parent, beginNode, currentendpt,oldpath,via=false){
  
  clearPath();
  var path = [];
  if(!via && oldpath.length == 0){
    path.push(currentendpt);
  } 
  if(oldpath.length != 0){
    path.push(currentendpt);
  }

  let endNode = path[path.length - 1];
  while(!(endNode.row == beginNode.row && endNode.col == beginNode.col)) {
    endNode = parent.get(`${endNode.row},${endNode.col}`);
    path.push(endNode);
  }
  if(oldpath.length != 0){
    var path2 = path.concat(oldpath);
    path = path2;
  }
 
  if (draw_flag == true) {
    for (let i = path.length - 1; i >= 0; i--) {
      let node = path[i];
      if (node.col === undefined) {
        alert('Path could not be found!');
        running = false;
        startBtn.textContent = 'Find Path';
      }
      let curNode = nodes[node.row][node.col];
      if (curNode.state != STATE.START && curNode.state != STATE.XSTART && curNode.state != STATE.XFINISH && curNode.state != STATE.FINISH && curNode.state != STATE.VIA) {
        if (curNode.state != STATE.VISITED_TERRAIN){
          curNode.state = STATE.PATH;
        }
        else{
          curNode.state = STATE.TERRAIN_PATH;
        }
        await sleep(20);
      }
    }
  } 
  console.log(`pathlength ${path.length}`);
  return path.length;
}

function manhattan(startrow, startcol, finishrow, finishcol) {
  return Math.abs(startrow - finishrow) + Math.abs(startcol - finishcol);
}

function findNeighbours(curNode) {
  const neighbours = [];
  const nodeOffset = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  
  nodeOffset.forEach(offset => {
    let newNode = {
      row: curNode.row + offset[0],
      col: curNode.col + offset[1],
    }
    // check that offset node is in bounds and not a wall
    if (newNode.row >= 0 && newNode.row < num_rows && newNode.col >= 0 && newNode.col < num_cols) {
      if (nodes[newNode.row][newNode.col].state != STATE.WALL)
        neighbours.push(newNode);
    }
  });
  return neighbours;
}
