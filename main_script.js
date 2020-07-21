const STATE = {EMPTY: 'e',WALL: 'w',START: 's',FINISH: 'f',PATH: 'p',VISITED: 'v',TERRAIN: 't', VIA: 'via'};
const ALGORITHMS = {BFS: 'bfs', DFS: 'dfs', GREEDY: 'greedy', ASTAR: 'astar', DIJKSTRA: 'dijkstra'};

Object.freeze(STATE);
Object.freeze(ALGORITHMS);

const WIDTH = (80/100)*2000;
const HEIGHT = 1000;

//Size of each pixel in the grid
const rectWidth = 27;
const rectHeight = 27;

const num_rows = Math.floor((screen.height - 70)/rectWidth);
const num_cols = Math.floor(screen.width/rectHeight) - 13;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const nodes = [];
var path = [];
const startNode = {
  row: 7,
  col: 7
};
const finishNode = {
  row: 7,
  col: num_cols-20
};
const viaNode = {
  row: null,
  col: null
};
const NewFinishnode = {
  row: 7,
  col: num_cols - 20
};

// const dest = [{ row: null, col: null }];
var dest = [];

const startBtn = document.getElementById('startBtn');

var BOARD_HEIGHT;
var BOARD_WIDTH;
let closedest = false;
let draw_flag = true;
let newdest_flag = false;
let LMBDown = false;
let RMBDown = false;
let enable_via = true;
let moveStart = false;
let moveFinish = false;
let moveVia = false;
let addvia = false;
let viaOrnot = false;
let addDestn = false;
let multidest = 0;
let currentAlgorithm = ALGORITHMS.ASTAR;
let running = false;
let speed = 1; // sleep time in ms between each iteration in algos

function manhattan(row, col) {
  return Math.abs(row - finishNode.row) + Math.abs(col - finishNode.col);
}

function findNeighbours(curNode) {
  const neighbours = [];
  // diagonal: [1, 1], [1, -1], [-1, -1], [-1, 1]
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

/* Helper Functions */
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

function getX(e){
  return e.clientX - canvas.getBoundingClientRect().left;
}

function getY(e){
  return e.clientY - canvas.getBoundingClientRect().top;
}

function getCol(x){
// 2nd term's numerator changes based on the constant value that separates cells in createGrid()
  return parseInt((x - (x / rectHeight)) / rectHeight); 
}

function getRow(y){
// 2nd term's numerator changes based on the constant value that separates cells in createGrid()
  return parseInt((y - (y / rectWidth)) / rectWidth); 
}

async function drawViaPath(parent, beginNode, endpt){
  clearPath();
  path = [];
  path.push(endpt);
  let endNode = path[path.length - 1];
  while(!(endNode.row == beginNode.row && endNode.col == beginNode.col)) {
    endNode = parent.get(`${endNode.row},${endNode.col}`);
    path.push(endNode);
  }
  await sleep(20);
  return path;

}

//Given an array of {row, col} tuples, this function will change the state of each node to STATE.PATH
async function drawPath(parent, beginNode, currentendpt,oldpath,via=false){
  
  clearPath();
  if(!via && oldpath.length == 0){
  var path = [];
  path.push(currentendpt);
  } 
  if(oldpath.length != 0){
    var path = [];
    var path2 = path.concat(oldpath);
    path = path2;
    path.push(currentendpt);
  }
  
  let endNode = path[path.length - 1];
  // console.log(`endNode row: ${endNode.row} col: ${endNode.col}`);
  while(!(endNode.row == beginNode.row && endNode.col == beginNode.col)) {
    endNode = parent.get(`${endNode.row},${endNode.col}`);
    //console.log(`endNode row: ${endNode.row} col: ${endNode.col}`);
    path.push(endNode);
  }
  // clearPath();
  console.log('done');  
  if (draw_flag == true) {
    for (let i = path.length - 1; i >= 0; i--) {
      let node = path[i];
      let curNode = nodes[node.row][node.col];
      if (curNode.state != STATE.START && curNode.state != STATE.FINISH && curNode.state != STATE.VIA) {
        curNode.state = STATE.PATH;
        await sleep(20);
      }
    }
  } 
  console.log(`pathlength ${path.length}`);
  return path.length;
}

/* Button Eventlisteners */
function removeDiv() {
  let div = document.getElementById('tutorial');
  div.parentNode.removeChild(div);
  return false;
}

//Calls the appropriate search algorithm to solve the maze
async function search() {
  console.log(`search`);
  if (!running) {
    clearPath();
    let result = 0;
    running = true;
    startBtn.textContent = 'Cancel';
    startBtn.classList.toggle('btn', 'btn-danger');

    console.log(`finishnode row:`, finishNode.row, `col:`, finishNode.col);
    newendNode = finishNode;
    //check for closest path
    if (multidest >= 0 && closedest == true) {
      draw_flag = false;
      console.log(`search for closest node`);
      if (currentAlgorithm == ALGORITHMS.BFS) {
        result = await bfs(startNode, finishNode);
        for (let end = 0; end < dest.length; end++){
          distance = await bfs(startNode, dest[end]);
          if (result > distance && distance != -1) {
            end_point = end;
            result = distance;
            newdest_flag = true;
          }
        }
        if (newdest_flag) {
          newendNode.row = dest[end_point].row;
          newendNode.col = dest[end_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.DFS) {
        result = await dfs(startNode, finishNode);
        for (let end = 0; end < dest.length; end++) {
          distance = await dfs(startNode, dest[end]);
          if (result > distance && distance != -1) {
            end_point = end;
            newdest_flag = true;
            result = distance;
          }
        }
        if (newdest_flag) {
          newendNode.row = dest[end_point].row;
          newendNode.col = dest[end_point].col;
        }
      }
        
      else if (currentAlgorithm == ALGORITHMS.GREEDY) {
        console.log(`finishnode row:`, finishNode.row, `col:`, finishNode.col);
        result = await greedy(startNode, finishNode);
        for (let end = 0; end < dest.length; end++) {
          distance = await greedy(startNode, dest[end]);
          if (result > distance && distance != -1) {
            end_point = end;
            newdest_flag = true;
            result = distance;
          }
        }
        if (newdest_flag) {
          console.log(`new_flag`, newdest_flag);
          console.log(`finishnode row:`, finishNode.row, `col:`, finishNode.col);
          newendNode.row = dest[end_point].row;
          newendNode.col = dest[end_point].col;
          console.log(`finishnode row:`, finishNode.row, `col:`, finishNode.col);
        }
      }
      
      else if (currentAlgorithm == ALGORITHMS.ASTAR) {
        result = await astar(startNode, finishNode);
        for (let end = 0; end < dest.length; end++) {
          distance = await astar(startNode, dest[end]);
          if (result > distance && distance != -1) {
            end_point = end;
            newdest_flag = true;
            result = distance;
          }
        }
        if (newdest_flag) {
          newendNode.row = dest[end_point].row;
          newendNode.col = dest[end_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA) {
        result = await dijkstra(startNode, finishNode);
        for (let end = 0; end < dest.length; end++){
          distance = await dijkstra(startNode, dest[end]);
          if (result > distance && distance != -1) {
            end_point = end;
            result = distance;
            newdest_flag = true;
          }
        }
        if (newdest_flag) {
          newendNode.row = dest[end_point].row;
          newendNode.col = dest[end_point].col;
        }
      }

      draw_flag = true;
    }

    if(viaOrnot == true)
    {
      if (currentAlgorithm == ALGORITHMS.BFS) {
        path1 = await bfs(startNode, viaNode, true);
        result = await bfs(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.DFS){
        path1 = await dfs(startNode, viaNode, true);
        result = await dfs(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.GREEDY){
        path1 = await greedy(startNode, viaNode, true);
        result = await greedy(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.ASTAR){
        path1 = await astar(startNode, viaNode, true);
        result = await astar(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
        path1 = await dijkstra(startNode, viaNode, true);
        result = await dijkstra(viaNode, newendNode,false,path1);  
      }
    }
    else
    {
      if (currentAlgorithm == ALGORITHMS.BFS) {
        result = await bfs(startNode, newendNode);
      }
      else if (currentAlgorithm == ALGORITHMS.DFS){
        result = await dfs(startNode, newendNode);
      }
      else if (currentAlgorithm == ALGORITHMS.GREEDY){
        result = await greedy(startNode, newendNode);
      }
      else if (currentAlgorithm == ALGORITHMS.ASTAR){
        result = await astar(startNode, newendNode);
      }
      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
        result = await dijkstra(startNode, newendNode);
      }
    }

    if(result == -1)
      alert('Path could not be found!');

    running = false;
    startBtn.textContent = 'Find Path';
  } 
  else {
    running = false;
    startBtn.textContent = 'Find Path';
    //startBtn.classList.toggle('btn', 'btn-success');
  }
}


//Clears everything except for start and end nodes 
function clearPath(){
  if(!running){

    for(let row = 0; row < nodes.length; row++){
      nodes[row].forEach(node => {
        if(node.state == STATE.PATH || node.state == STATE.VISITED)
          node.state = STATE.EMPTY;
      });
    }
  }
}

//Changes state of empty nodes to wall nodes on left-click
function createWall(e){
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];
  if(cell.state != STATE.START && cell.state != STATE.FINISH && cell.state != STATE.VIA){
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
        if(node.state == STATE.TERRAIN)
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
    enable_via = true;
    viaOrnot =false;
  }
}

function MultiDest(e) {
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];
  if (cell.state != STATE.START && cell.state != STATE.FINISH) {
    cell.state = STATE.FINISH;
    multidest += 1;
    dest.push({ row, col });
    console.log(dest);
  }
}

function ClearDest() {
  if (!running) {
    for (let end = 0; end < dest.length; end++) {
      dest.pull;
      console.log(dest);
      nodes[dest[end].row][dest[end].col].state = STATE.EMPTY;
    }
  }
}

const random = (min, max) => Math.random() * (max - min) + min;

//  Creates random obstales
function CreateRandomObs() {
  if(!running){
    clearPath();
    clearWalls();
    randomObs();
      
  }
}    

function CreateMaze() {
  if(!running){
    clearPath();
    clearWalls();
    recursive_maze(2,HEIGHT - 3, 2, WIDTH - 3, "horizontal", false);
  }
}

function AddVia() {
  console.log(`entered addvia: ${addvia}`);
  no_of_via = 1;
  addvia = true;
}

function AddDestn() {
  console.log(`entered adddestn: ${addDestn}`);
  addDestn = true;
}

function ClosestDestination() {
  console.log(`entered adddestn: ${addDestn}`);
  var isChecked = document.getElementById("switch").checked;
  console.log(isChecked);
  if (isChecked == true) {
    closedest = true;
  }
  else {
    closedest = false;
  }
}

function CreateVia(e) {
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];
  if (cell.state != STATE.START && cell.state != STATE.FINISH) {
    cell.state = STATE.VIA;
    console.log(`created via state ${addvia}`);
    viaOrnot = true;
    viaNode.row = row;
    viaNode.col = col;
  }

}

function CreateTerrain() {
  if(!running){
    clearPath();
    Createterrain(); 
  }  
}

function CallTutorial(){
document.getElementById("tutorial").classList.toggle("show");
}

function Pause() {

}


// Moves the start node when dragged
function moveStartNode(e){
  let col = getCol(getX(e));
  let row = getRow(getY(e));

  let cell1 = nodes[startNode.row][startNode.col];
  console.log(`cell1: ${cell1.state}`);
  let cell2 = nodes[row][col];

  if(cell2.state != STATE.FINISH && cell2.state != STATE.WALL && cell2.state != STATE.VIA)
  {
    cell1.state = cell1.prevState;
    cell1.prevState = STATE.START;
    console.log(`cell1inside: ${cell1.state}`);
    startNode.row = row;
    startNode.col = col;

    cell1 = nodes[startNode.row][startNode.col];
    cell1.prevState = cell1.state;
    cell1.state = STATE.START;
  }
}

// Moves the finish node when dragged
function moveFinishNode(e){
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  console.log(`col: ${col}, row: ${row}`);
  let r = NewFinishnode.row;
  let c = NewFinishnode.col;
  let cell1 = nodes[r][c];
  console.log(`dest`,dest,`r:`,r,`c:`,c);
  const index = dest.indexOf({ r, c });
  dest.splice(index, 1);
  console.log(dest);
  console.log(`cell1: ${cell1.state}`);
  let cell2 = nodes[row][col];
  dest.push({ row, col });
  console.log(dest);


  if(cell2.state != STATE.START && cell2.state != STATE.WALL && cell2.state != STATE.VIA)
  {
    console.log(`previous state: ${cell1.prevState}`)
    cell1.state = cell1.prevState;
    cell1.prevState = STATE.FINISH;
    console.log(`cell1inside: ${cell1.state}`);
    NewFinishnode.row = row;
    NewFinishnode.col = col;

    cell1 = nodes[NewFinishnode.row][NewFinishnode.col];
    cell1.prevState = cell1.state;
    cell1.state = STATE.FINISH
  }
}

function moveViaNode(e) {
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell1 = nodes[viaNode.row][viaNode.col];
  let cell2 = nodes[row][col];

  if(cell2.state != STATE.START && cell2.state != STATE.WALL && cell2.state != STATE.FINISH)
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


/* Canvas Eventlisteners */
canvas.onmouseup = function(e) {
  LMBDown = false;
  RMBDown = false;
  moveStart = false;
  moveFinish = false;
  moveVia = false;
  addvia = false;
  addDestn = false;
}

canvas.onmousedown = function(e) {
  if(running)
    return;
  if(e.button == 0) { // left click
    LMBDown = true;
  } else if (e.button == 2) { //right click
    RMBDown = true;
  }
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  if(nodes[row][col].state == STATE.START){
    moveStart = true;
  } else if (nodes[row][col].state == STATE.FINISH) {
    moveFinish = true;
    console.log(`row: ${row},col:${col}`);
    NewFinishnode.row = row;
    NewFinishnode.col = col;
    console.log(`row: ${NewFinishnode.row},col:${NewFinishnode.col}`);
  } else if (nodes[row][col].state == STATE.VIA) {
    moveVia = true;
  }
  else if (addvia) {
    if (e.button == 0 && enable_via) {

      CreateVia(e);
      enable_via = false;
    }
  }
  else if (addDestn) {
    if (e.button == 0) {
      MultiDest(e);
    }
  }
  else {
    if (e.button == 0) {
      createWall(e);
    }
    else if (e.button == 2){
      deleteWall(e);
    }
  }
}

/**
 * Recalls the appropriate functions depending on the
 * status of the mouse and which buttons were pressed
 * @param {} e 
 */
canvas.onmousemove = function(e) {
  if (LMBDown) {
    if (moveStart) {
      moveStartNode(e);
    } else if (moveFinish) {
      moveFinishNode(e);
    } else if (moveVia) {
      moveViaNode(e);
    }
    else if (addvia) {
      console.log(`addvia: ${addvia}`);
      CreateVia(e);
    }
    else if (addDestn) {
      console.log(`addvia: ${addvia}`);
      MultiDest(e);
    }
    else {
      createWall(e);
    }
  } else if (RMBDown) {
    deleteWall(e)
  }
}

window.onload=function init() {
  // Creating button event listeners
  let algorithmText = document.getElementById('algorithm-text');
  // Close tutorial
  let btn = document.getElementById('tutorialBtn');
  if(btn) btn.addEventListener('click', removeDiv, false);
  // Clear walls
  btn = document.getElementById('clrWallBtn');
  if(btn) btn.addEventListener('click', clearWalls, false);
  // Clear path
  btn = document.getElementById('clrPathBtn');
  if(btn) btn.addEventListener('click', clearPath, false);
  // Clear Terrain
  btn = document.getElementById('clrTerrainBtn');
  if(btn) btn.addEventListener('click', clearTerrain, false);
  // Set speed
  btn = document.getElementById('speed');
  if(btn) btn.addEventListener('input', () => speed = document.getElementById('speed').value);
  // Start search algorithm
  if(startBtn) {
    // not working
    //startBtn.classList.add('btn' ,'btn-danger');
    //startBtn.classList.add('btn', 'btn-success');
    startBtn.addEventListener('click', search, false);

  }
  // Select BFS algorithm
  btn = document.getElementById('bfs');
  if(btn) btn.addEventListener('click', () => {currentAlgorithm = ALGORITHMS.BFS; algorithmText.textContent = "Breadth-First Search"}, false);
  // Select DFS algorithm
  btn = document.getElementById('dfs');
  if(btn) btn.addEventListener('click', () => {currentAlgorithm = ALGORITHMS.DFS; algorithmText.textContent = "Depth-First Search"}, false);
  // Select Greedy Best-First Search algorithm
  btn = document.getElementById('greedy');
  if(btn) btn.addEventListener('click', () => {currentAlgorithm = ALGORITHMS.GREEDY; algorithmText.textContent = "Greedy Best-First Search"}, false);
  // Select A* Search algorithm
  btn = document.getElementById('astar');
  if(btn) btn.addEventListener('click', () => {currentAlgorithm = ALGORITHMS.ASTAR; algorithmText.textContent = "A* Search"}, false);
  // Select Dijkstra algorithm
  btn = document.getElementById('dijkstra');
  if(btn) btn.addEventListener('click', () => {currentAlgorithm = ALGORITHMS.DIJKSTRA; algorithmText.textContent = "Dijkstra Algorithm"}, false);
  
  //Extra functionalities 
  
  // Create Random Obstacles
  btn = document.getElementById('RandomObs');
  if(btn) btn.addEventListener('click', CreateRandomObs, false);
  // Create Maze Button
  btn = document.getElementById('Maze');
  if(btn) btn.addEventListener('click', CreateMaze, false);
  // Create Via Points
  btn = document.getElementById('Via');
  if(btn) btn.addEventListener('click', AddVia, false);
  // Clear Via Points
  btn = document.getElementById('ClearVia');
  if(btn) btn.addEventListener('click', ClearVia, false);
  // Create Multiple Destinations
  btn = document.getElementById('multipleDestinations');
  if (btn) btn.addEventListener('click', AddDestn, false);
  //Find path to Closest destination
  btn = document.getElementById('switch');
  if (btn) btn.addEventListener('click', ClosestDestination, false);
  // Clear Via Points
  btn = document.getElementById('Cleardest');
  if (btn) btn.addEventListener('click', ClearDest, false);
  // Create Terrain
  btn = document.getElementById('Terrain');
  if(btn) btn.addEventListener('click', CreateTerrain, false);  

  btn = document.getElementById('instructions');
  if(btn) btn.addEventListener('click', CallTutorial, false);  

  let pause_btn = document.getElementById('pauseSearch');
  if(btn) btn.addEventListener('click', Pause, false);  
  if(pause_btn) pause_btn.addEventListener('click', () => { pause_btn.textContent = "Resume Search"}, false);


  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  createGrid();
  setInterval(drawGrid, 10);

  return;
}

