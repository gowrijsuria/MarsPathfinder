  let div1 = document.getElementById('ViaInfo');
  let div2 = document.getElementById('RandObInfo');
  let div3 = document.getElementById('TerrainInfo');
  let div4 = document.getElementById('MazeInfo');
  let div5 = document.getElementById('DestInfo');
  let div6 = document.getElementById('StartInfo');
  let div7 = document.getElementById('ClosestInfo');

function Viafunc(){
  div1.style.display = "inline";
  div2.style.display = "none";
  div3.style.display = "none";
  div4.style.display = "none";
  div5.style.display = "none";
  div6.style.display = "none";
  div7.style.display = "none";
  
  return false;
}

function Randfunc(){
 div2.style.display = "inline";
  div1.style.display = "none";
  div3.style.display = "none";
  div4.style.display = "none";
  div5.style.display = "none";
  div6.style.display = "none";
  div7.style.display = "none";
  
  return false;
}

function Terrainfunc(){
  div3.style.display = "inline";
  div2.style.display = "none";
  div1.style.display = "none";
  div4.style.display = "none";
  div5.style.display = "none";
  div6.style.display = "none";
  div7.style.display = "none";
  
  return false;
}

function Mazefunc(){
  div4.style.display = "inline";
  div2.style.display = "none";
  div3.style.display = "none";
  div1.style.display = "none";
  div5.style.display = "none";
  div6.style.display = "none";
  div7.style.display = "none";
  
  return false;
}

function Destfunc(){
  div5.style.display = "inline";
  div2.style.display = "none";
  div3.style.display = "none";
  div4.style.display = "none";
  div1.style.display = "none";
  div6.style.display = "none";
  div7.style.display = "none";
  
  return false;
}

function Startfunc(){
  div6.style.display = "inline";
  div2.style.display = "none";
  div3.style.display = "none";
  div4.style.display = "none";
  div5.style.display = "none";
  div1.style.display = "none";
  div7.style.display = "none";
  
  return false;
}

function Closestfunc(){
  div7.style.display = "inline";
  div2.style.display = "none";
  div3.style.display = "none";
  div4.style.display = "none";
  div5.style.display = "none";
  div6.style.display = "none";
  div1.style.display = "none";
  
  return false;
}


function Viafunc_collapse() {
  let div = document.getElementById('ViaInfo');
  div.style.display = "none";
  return false;
}

