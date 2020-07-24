const STATE = {EMPTY: 'e',WALL: 'w',START: 's', XSTART: 'xs', FINISH: 'f', XFINISH: 'xf', PATH: 'p',VISITED: 'v',TERRAIN: 't', VIA: 'via',VISITED_TERRAIN: 'vt',TERRAIN_PATH: 'tp'};
const ALGORITHMS = {BFS: 'bfs', DFS: 'dfs', GREEDY: 'greedy', ASTAR: 'astar', DIJKSTRA: 'dijkstra'};

Object.freeze(STATE);
Object.freeze(ALGORITHMS);

// const WIDTH = (80/100)*2000;
// const HEIGHT = 1000;
const WIDTH = 1920;
const HEIGHT = 940;

//Size of each pixel in the grid
const rectWidth = 27;
const rectHeight = 27;

const num_rows = Math.floor((screen.height - 350) / rectWidth);
const num_cols = Math.floor(screen.width / rectHeight) - 15;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const nodes = [];
var path = [];
var TSP_Matrix = [];
var perms = [];

const startNode = {
  row: 7,
  col: 7
};
const finishNode = {
  row: 7,
  col: num_cols-20
};
const viaNode = {
  row: 7,
  col: 6
};

var dest = [];
var start = [];
var start_end = [startNode,finishNode];
var all_nodes = [];

const startBtn = document.getElementById('startBtn');

var Viabtn_flag = true;
let closedest = false;
let draw_flag = true;
let newdest_flag = false;
let newstart_flag = false;
let LMBDown = false;
let RMBDown = false;
let moveStart = false;
let moveFinish = false;
let moveVia = false;
let addvia = false;
let viaOrnot = false;
let addDestn = false;
let addstart = false;
let multidest = 0;
let multistart = 0;
let currentAlgorithm = ALGORITHMS.GREEDY;
let running = false;
let speed = 1; // sleep time in ms between each iteration in algos

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

  console.log('done');  
  if (draw_flag == true) {
    for (let i = path.length - 1; i >= 0; i--) {
      let node = path[i];
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

/* Button Eventlisteners */
function removeDiv() {
  /*
  let div = document.getElementById('tutorial');
  div.parentNode.removeChild(div);
  return false;
  */
  let div = document.getElementById('tutorial');
  //div.parentNode.removeChild(div);
  div.style.display = "none";
  //div.style.visibility = "visible";
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

    var newendNode = {
      row: null,
      col: null
    };

    var newbeginNode = {
      row: null,
      col: null
    };
    newendNode.row = finishNode.row;
    newendNode.col = finishNode.col;

    newbeginNode.row = startNode.row;
    newbeginNode.col = startNode.col;
    
    newdest_flag = false;
    newstart_flag = false;
    //check for closest dest path
    if (multidest > 0 && closedest == true) {
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
          newendNode.row = dest[end_point].row;
          newendNode.col = dest[end_point].col;
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

    // check for closest path: start
    if (multistart > 0 && closedest == true) {
      draw_flag = false;
      if (currentAlgorithm == ALGORITHMS.BFS) {
        result1 = await bfs(startNode, finishNode);
        for (let end = 0; end < start.length; end++) {
          distance = await bfs(start[end], finishNode);
          if (result1 > distance && distance != -1) {
            start_point = end;
            result1 = distance;
            newstart_flag = true;
          }
        }
        if (newstart_flag) {
          newbeginNode.row = start[start_point].row;
          newbeginNode.col = start[start_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.DFS) {
        result1 = await dfs(startNode, finishNode);
        for (let end = 0; end < start.length; end++) {
          distance = await dfs(start[end], finishNode);
          if (result1 > distance && distance != -1) {
            start_point = end;
            newstart_flag = true;
            result1 = distance;
          }
        }
        if (newstart_flag) {
          newbeginNode.row = start[start_point].row;
          newbeginNode.col = start[start_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.GREEDY) {
        result1 = await greedy(startNode, finishNode);
        for (let end = 0; end < start.length; end++) {
          distance = await greedy(start[end], finishNode);
          if (result1 > distance && distance != -1) {
            start_point = end;
            newstart_flag = true;
            result1 = distance;
          }
        }
        if (newstart_flag) {
          newbeginNode.row = start[start_point].row;
          newbeginNode.col = start[start_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.ASTAR) {
        result1 = await astar(startNode, finishNode);
        for (let end = 0; end < start.length; end++) {
          distance = await astar(start[end], finishNode);
          if (result1 > distance && distance != -1) {
            start_point = end;
            newstart_flag = true;
            result1 = distance;
          }
        }
        if (newstart_flag) {
          newbeginNode.row = start[start_point].row;
          newbeginNode.col = start[start_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA) {
        result1 = await dijkstra(startNode, finishNode);
        for (let end = 0; end < start.length; end++) {
          distance = await dijkstra(start[end], finishNode);
          if (result1 > distance && distance != -1) {
            start_point = end;
            result1 = distance;
            newstart_flag = true;
          }
        }
        if (newstart_flag) {
          newbeginNode.row = start[start_point].row;
          newbeginNode.col = start[start_point].col;
        }
      }
      draw_flag = true;
    }

    if(viaOrnot == true)
    {
      if (currentAlgorithm == ALGORITHMS.BFS) {
        path1 = await bfs(newbeginNode, viaNode, true);
        result = await bfs(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.DFS){
        path1 = await dfs(newbeginNode, viaNode, true);
        result = await dfs(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.GREEDY){
        path1 = await greedy(newbeginNode, viaNode, true);
        result = await greedy(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.ASTAR){
        path1 = await astar(newbeginNode, viaNode, true);
        result = await astar(viaNode, newendNode,false,path1);  
      }
      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
        path1 = await dijkstra(newbeginNode, viaNode, true);
        result = await dijkstra(viaNode, newendNode,false,path1);  
      }
    }
    else
    {
      if(closedest == false && multidest >= 1) {
        ClearVia();
        draw_flag = false;
        all_nodes = start_end.concat(dest);
        var total_no_of_nodes = 2 + dest.length; 
        CreateMatrix(total_no_of_nodes);
        result = await Fill_TSPMatrix(total_no_of_nodes);
        var TSP_permutation = FindingTSPPermutation();
        draw_flag = true;
        result = await DrawingTSPpath(TSP_permutation);
        
      }
      else {
        if (currentAlgorithm == ALGORITHMS.BFS) {
          result = await bfs(newbeginNode, newendNode);
        }
        else if (currentAlgorithm == ALGORITHMS.DFS){
          result = await dfs(newbeginNode, newendNode);
        }
        else if (currentAlgorithm == ALGORITHMS.GREEDY){
          result = await greedy(newbeginNode, newendNode);
        }
        else if (currentAlgorithm == ALGORITHMS.ASTAR){
          result = await astar(newbeginNode, newendNode);
        }
        else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
          result = await dijkstra(newbeginNode, newendNode);
        }
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

async function Fill_TSPMatrix(total_no_of_nodes) {
  draw_flag = false;
 for(let col = 1; col < total_no_of_nodes; col++) {
    for(let row = 0; row < col; row++) {
     
      let beginNode = all_nodes[row];
      let endNode = all_nodes[col];

      if (currentAlgorithm == ALGORITHMS.BFS) {
        result = await bfs(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.DFS){
        result = await dfs(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.GREEDY){
        result = await greedy(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.ASTAR){
        result = await astar(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
        result = await dijkstra(beginNode, endNode);
      }
      
      TSP_Matrix[row][col].pathlength = result; 
      TSP_Matrix[col][row].pathlength = TSP_Matrix[row][col].pathlength;
    
    }
  }
  draw_flag = true;
  await sleep(20);
  return result; 
}

function FindingTSPPermutation() {
  let perm_nodes = all_nodes.slice(1,);
  perms = perm(perm_nodes);
        
  var TSP_path = [];
  var TSP_permutation = [];
  var least_dist = 0;
  for(let iter = 0; iter < perms.length; iter++){  
    let permutation = perms[iter];
    TSP_path = [startNode].concat(permutation);

    var start = startNode;
    var end = permutation[0];
    var startindex = all_nodes.indexOf(start);
    var endindex = all_nodes.indexOf(end);
    var distance = TSP_Matrix[startindex][endindex].pathlength;
    var total_dist = distance;
    for(let i = 0; i < permutation.length-1 ; i++)
    {
      start = permutation[i];
      end = permutation[i+1];
      
      startindex = all_nodes.indexOf(start);
      endindex = all_nodes.indexOf(end);
      distance = TSP_Matrix[startindex][endindex].pathlength;
      
      total_dist = total_dist + distance;

    }
    if(iter == 0){
        least_dist = total_dist;
        TSP_permutation = TSP_path;
      }
    if(total_dist < least_dist){
        least_dist = total_dist;
        TSP_permutation = TSP_path;
      }
  }
  return TSP_permutation;
}

async function DrawingTSPpath(TSP_permutation) {
  const length = TSP_permutation.length;
  if (currentAlgorithm == ALGORITHMS.BFS) {
    draw_flag = true;
    path1 = await bfs(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=1 ; i < length-1; i++)  
    {  
      path2 = await bfs(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await bfs(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
  else if (currentAlgorithm == ALGORITHMS.DFS){
    path1 = await dfs(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await dfs(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await dfs(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
  else if (currentAlgorithm == ALGORITHMS.GREEDY){
    path1 = await greedy(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await greedy(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await greedy(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);
  }
  else if (currentAlgorithm == ALGORITHMS.ASTAR){
    path1 = await astar(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await astar(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await astar(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
  else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
    path1 = await dijkstra(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await dijkstra(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await dijkstra(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
}


function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

function CreateMatrix(total_no_of_nodes) {
  for(let row = 0; row < total_no_of_nodes; row++) {
    TSP_Matrix[row] = [];
    for(let col = 0; col < total_no_of_nodes; col++) {
      TSP_Matrix[row][col] = {
      pathlength: 0
      };  
    }
  }
}

function MultiDest(e) {
  ClearStartPoints();
  ClearVia();
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];
  if (cell.state != STATE.START && cell.state != STATE.XSTART && cell.state != STATE.FINISH && cell.state != STATE.XFINISH) {
    cell.state = STATE.XFINISH;
    multidest += 1;
    dest.push({ row, col });
  }
}

function MultiStartPoint(e) {
  ClearDest();
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  let cell = nodes[row][col];
  if (cell.state != STATE.START && cell.state != STATE.XSTART && cell.state != STATE.FINISH && cell.state != STATE.XFINISH) {
    cell.state = STATE.XSTART;
    multistart += 1;
    start.push({ row, col });
    // console.log(dest);
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

function FuncVia() {
  if (Viabtn_flag) {
    document.querySelector('#Via').innerHTML = 'Clear Via Point';
    AddVia();
    Viabtn_flag = false;
  }
  else {
    document.querySelector('#Via').innerHTML = 'Add Via Point';
    ClearVia();
    Viabtn_flag = true;
  }
}

function AddVia() {
  let cell = nodes[7][6];
  if (cell.state != STATE.START && cell.state != STATE.XSTART && cell.state != STATE.FINISH && cell.state != STATE.XFINISH) {
    cell.state = STATE.VIA;
    viaNode.row = 7;
    viaNode.col = 6;
  }
  else {
    cell = nodes[6][7];
    cell.state = STATE.VIA;
    viaNode.row = 6;
    viaNode.col = 7;
  }
  viaOrnot = true;
  // addvia = true;
}

function AddDestn() {
  addDestn = true;
}

function AddStartPoint() {
  addstart = true;
}

function ClosestDestination() {
  var isChecked = document.getElementById("switch").checked;
  if (isChecked == true) {
    closedest = true;
  }
  else {
    closedest = false;
  }
  console.log(closedest);
}

function CreateTerrain() {
  if(!running){
    clearPath();
    Createterrain(nodes); 
  }  
}

function CallTutorial(){
//document.getElementById("tutorial").classList.toggle("show");
  let div = document.getElementById('tutorial');
  div.style.display = "inline";
  return false;
}

function Pause() {

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
  addstart = false;
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
  if (nodes[row][col].state == STATE.START){
    moveStart = true;
  } else if (nodes[row][col].state == STATE.FINISH) {
    moveFinish = true;
  } else if (nodes[row][col].state == STATE.VIA) {
    moveVia = true;
  }
  else if (addDestn) {
    if (e.button == 0) {
      MultiDest(e);
    }
  }
  else if (addstart) {
    if (e.button == 0) {
      MultiStartPoint(e);
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
    else if (addDestn) {
      MultiDest(e);
    }
    else if (addstart) {
      MultiStartPoint(e);
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

//  let btn = document.getElementById('ViaClose');
//  if(btn) btn.addEventListener('click', Viafunc_collapse, false);

  
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
  if(btn) 
    {
      btn.addEventListener('click', CreateRandomObs, false);
    }
  // Create Maze Button
  btn = document.getElementById('Maze');
  if(btn) btn.addEventListener('click', CreateMaze, false);
  
  // Create Via Points
  btn = document.getElementById('Via');
  if(btn) {
    btn.addEventListener('click', FuncVia, false);
    btn.addEventListener('click', Viafunc, false);

  }
  // Create Multiple Destinations
  btn = document.getElementById('multipleDestinations');
  if (btn) btn.addEventListener('click', AddDestn, false);
  // Create Multiple Start Points
  btn = document.getElementById('multipleStart');
  if (btn) btn.addEventListener('click', AddStartPoint, false);
  //Find path to Closest destination
  btn = document.getElementById('switch');
  if (btn) btn.addEventListener('click', ClosestDestination, false);
  // Clear Dest Points
  btn = document.getElementById('Cleardest');
  if (btn) btn.addEventListener('click', ClearDest, false);
  // Clear Start Points
  btn = document.getElementById('ClearStart');
  if (btn) btn.addEventListener('click', ClearStartPoints, false);
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

