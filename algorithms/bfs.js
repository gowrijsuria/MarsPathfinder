async function bfs() {
  const queue = [];
  const parent = new Map();
  let neighbours = [];
  let node = {
    row: startNode.row,
    col: startNode.col
  };
  queue.push(node);
  while (queue.length > 0 && running) {
    node = queue.shift();
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