function randomObs() {
  const rows = nodes[0].length;
  const cols = nodes.length;
  for(let row = 0; row < nodes.length; row++)
  {
    for(let col = 0; col < nodes[row].length; col++)
    {
      node = nodes[row][col];
      const ObsOrNot = parseInt(random(1, rows + cols));
      if(ObsOrNot == 1)
      {
        if (node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.XSTART && node.state != STATE.XFINISH)
        {
          node.state = STATE.WALL;
        }      
      }
    }
  }
}