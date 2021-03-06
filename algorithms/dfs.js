async function dfs(beginNode, endNode, via = false, oldpath=[]) {
  const stack = [];
  const parent = new Map();
  let neighbours = [];
  let node = {
    row: beginNode.row,
    col: beginNode.col
  };
  stack.push(node);
  while (stack.length > 0 && running) {
    node = stack.pop();
    let row = node.row;
    let col = node.col;
    if (nodes[row][col].state != STATE.START && nodes[row][col].state != STATE.FINISH && nodes[row][col].state != STATE.XSTART && nodes[row][col].state != STATE.XFINISH && nodes[row][col].state != STATE.VIA) {
      if(nodes[row][col].state == STATE.TERRAIN){
        nodes[row][col].state = STATE.VISITED_TERRAIN;
      }
      else{
        nodes[row][col].state = STATE.VISITED;
      }
    }
    if(row == endNode.row && col == endNode.col){
      if(via){
        path2 = await drawViaPath(parent, beginNode, endNode, oldpath);
        oldpath = path2;
        return oldpath;
      }
      else{
        final_lenght = await drawPath(parent, beginNode, endNode, oldpath,via); 
        return final_lenght;
      }
    } else {
      neighbours = findNeighbours(node);
      neighbours.forEach(newNode => {
        if(!parent.has(`${newNode.row},${newNode.col}`)){
          stack.push(newNode);
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