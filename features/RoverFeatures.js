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
// document.getElementById("tutorial").classList.toggle("show");
let div = document.getElementById('tutorial');
  div.style.display = "inline";
  return false;
}

function Pause() {

}
