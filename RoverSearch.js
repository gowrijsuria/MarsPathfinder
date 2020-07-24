async function RoverClosestDest(){
    
    draw_flag = false;

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
      return result;
}



async function MultiAgentClosestPath(){
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
      return result1;
}


