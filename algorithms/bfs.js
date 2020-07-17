async function bfs(beginNode, endNode, via=false, oldpath=[]) {
  const queue = [];
  const parent = new Map();
  let neighbours = [];
  var node = {
    row: beginNode.row,
    col: beginNode.col
  };
  queue.push(node);
  while (queue.length > 0 && running) {
    node = queue.shift();
    let row = node.row;
    let col = node.col;
    if (nodes[row][col].state != STATE.START && nodes[row][col].state != STATE.FINISH && nodes[row][col].state != STATE.VIA) {
      nodes[row][col].state = STATE.VISITED;
    }
    // console.log("node");
    // console.log(node);
    // console.log(endNode);
    if(row == endNode.row && col == endNode.col){
      if(via){
        path2 = await drawViaPath(parent, beginNode, endNode);
        oldpath = path2;
        return oldpath;
      }
      else{
       await drawPath(parent, beginNode, endNode, oldpath,via); 
       return;
      }
      
    } else {
      neighbours = findNeighbours(node);
      neighbours.forEach(newNode => {
        if(!parent.has(`${newNode.row},${newNode.col}`)){
          queue.push(newNode);
          parent.set(`${newNode.row},${newNode.col}`, node);
        }
      });
    }
    await sleep(speed);
  }
  if (running)
    return -1;
  else
    return -2;
}
