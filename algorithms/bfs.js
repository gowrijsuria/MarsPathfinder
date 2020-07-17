async function bfs(beginNode, endNode, via=false, oldpath=[]) {
  console.log("oldpath");
  console.log(oldpath);
  const queue = [];
  const parent = new Map();
  let neighbours = [];
  let node = {
    row: beginNode.row,
    col: beginNode.col
  };
  queue.push(node);
  while (queue.length > 0 && running) {
    node = queue.shift();
    if (nodes[node.row][node.col].state != STATE.START && nodes[node.row][node.col].state != STATE.FINISH && nodes[node.row][node.col].state != STATE.VIA) {
      nodes[node.row][node.col].state = STATE.VISITED;
    }
    if(node.row == endNode.row && node.col == endNode.col){
      if(via){
        path2 = await drawViaPath(parent, beginNode, endNode);
        console.log("oldpathconcat");
        oldpath = path2;
        console.log(oldpath);
        return oldpath;
      }
      else{
       console.log("ksnavdjknsvkjndvasjnvknskvdkvdnjjk");
       console.log(oldpath);
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
