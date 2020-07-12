async function dfs() {
  const stack = [];
  const parent = new Map();
  let neighbours = [];
  let node = {
    row: startNode.row,
    col: startNode.col
  };
  stack.push(node);
  while (stack.length > 0 && running) {
    node = stack.pop();
    if (nodes[node.row][node.col].state != STATE.START && nodes[node.row][node.col].state != STATE.FINISH) {
      nodes[node.row][node.col].state = STATE.VISITED;
    }
    if(node.row == finishNode.row && node.col == finishNode.col){
      await drawPath(parent);
      return;
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