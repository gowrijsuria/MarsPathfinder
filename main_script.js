const STATE = {EMPTY: 'e',WALL: 'w',START: 's', XSTART: 'xs', FINISH: 'f', XFINISH: 'xf', PATH: 'p',VISITED: 'v',TERRAIN: 't', VIA: 'via',VISITED_TERRAIN: 'vt',TERRAIN_PATH: 'tp'};
const ALGORITHMS = {BFS: 'bfs', DFS: 'dfs', GREEDY: 'greedy', ASTAR: 'astar', DIJKSTRA: 'dijkstra'};

Object.freeze(STATE);
Object.freeze(ALGORITHMS);

const WIDTH = 1920;
const HEIGHT = 940;

//Size of each pixel in the grid
const rectWidth = 27;
const rectHeight = 27;

const num_rows = Math.floor((screen.height - 350)/rectWidth);
const num_cols = Math.floor(screen.width /rectHeight) - 15;

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




//Calls the appropriate search algorithm to solve the maze
async function RoverSearch() {
  if (!running) {
    clearPath();
    let result = 0;
    running = true;
    startBtn.textContent = 'Cancel';
    startBtn.classList.toggle('btn', 'btn-danger');

    var newendNode1 = {
      row: null,
      col: null
    };

    var newbeginNode = {
      row: null,
      col: null
    };
    newendNode1.row = finishNode.row;
    newendNode1.col = finishNode.col;

    newbeginNode.row = startNode.row;
    newbeginNode.col = startNode.col;
    
    newdest_flag = false;
    newstart_flag = false;
    //check for closest dest path
    if (multidest > 0 && closedest == true) {
//       result = await RoverClosestDest();
      draw_flag = false;

      if (currentAlgorithm == ALGORITHMS.BFS) {
        result1 = await bfs(startNode, finishNode);
        for (let end = 0; end < dest.length; end++){
          distance = await bfs(startNode, dest[end]);
          if (result1 > distance && distance != -1) {
            end_point = end;
            result1 = distance;
            newdest_flag = true;
          }
        }
        if (newdest_flag) {
          newendNode1.row = dest[end_point].row;
          newendNode1.col = dest[end_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.DFS) {
        result1 = await dfs(startNode, finishNode);
        for (let end = 0; end < dest.length; end++) {
          distance = await dfs(startNode, dest[end]);
          if (result1 > distance && distance != -1) {
            end_point = end;
            newdest_flag = true;
            result1 = distance;
          }
        }
        if (newdest_flag) {
          newendNode1.row = dest[end_point].row;
          newendNode1.col = dest[end_point].col;
        }
      }
        
      else if (currentAlgorithm == ALGORITHMS.GREEDY) {
        result1 = await greedy(startNode, finishNode);
        for (let end = 0; end < dest.length; end++) {
          distance = await greedy(startNode, dest[end]);
          if (result1 > distance && distance != -1) {
            end_point = end;
            newdest_flag = true;
            result1 = distance;
          }
        }
        if (newdest_flag) {
          newendNode1.row = dest[end_point].row;
          newendNode1.col = dest[end_point].col;
        }
      }
      
      else if (currentAlgorithm == ALGORITHMS.ASTAR) {
        result1 = await astar(startNode, finishNode);
        for (let end = 0; end < dest.length; end++) {
          distance = await astar(startNode, dest[end]);
          if (result1 > distance && distance != -1) {
            end_point = end;
            newdest_flag = true;
            result1 = distance;
          }
        }
        if (newdest_flag) {
          newendNode1.row = dest[end_point].row;
          newendNode1.col = dest[end_point].col;
        }
      }

      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA) {
        result1 = await dijkstra(startNode, finishNode);
        for (let end = 0; end < dest.length; end++){
          distance = await dijkstra(startNode, dest[end]);
          if (result1 > distance && distance != -1) {
            end_point = end;
            result1 = distance;
            newdest_flag = true;
          }
        }
        if (newdest_flag) {
          newendNode1.row = dest[end_point].row;
          newendNode1.col = dest[end_point].col;
        }
      }

      draw_flag = true;
    
      return result1;

      
    }

    // check for closest path: start
    if (multistart > 0 && closedest == true) {
     result = await MultiAgentClosestPath(); 
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
        if(result == -1)
        {
          alert('Path could not be found!');
          running = false;
          startBtn.textContent = 'Find Path';
        }
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
    startBtn.addEventListener('click', RoverSearch, false);

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
      btn.addEventListener('click', Randfunc, false);
      
  }
  // Create Maze Button
  btn = document.getElementById('Maze');
  if(btn) 
  {
      btn.addEventListener('click', CreateMaze, false);
      btn.addEventListener('click', Mazefunc, false);
  }
  // Create Via Points
  btn = document.getElementById('Via');
  if(btn) 
  {
    btn.addEventListener('click', FuncVia, false);
    btn.addEventListener('click', Viafunc, false);

  }
  // Create Multiple Destinations
  btn = document.getElementById('multipleDestinations');
  if (btn) 
  { btn.addEventListener('click', AddDestn, false);
    //btn.addEventListener('click', Destfunc, false);
    
  }
  // Create Multiple Start Points
  btn = document.getElementById('multipleStart');
  if (btn) 
   {
    btn.addEventListener('click', AddStartPoint, false);
    btn.addEventListener('click', Startfunc, false);
  
  }
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
  if(btn) 
  {btn.addEventListener('click', CreateTerrain, false);  
    btn.addEventListener('click', Terrainfunc, false);  

  }
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

