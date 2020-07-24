async function Fill_TSPMatrix(total_no_of_nodes) {
  draw_flag = false;
 for(let col = 1; col < total_no_of_nodes; col++) {
    for(let row = 0; row < col; row++) {
     
      let beginNode = all_nodes[row];
      let endNode = all_nodes[col];

      if (currentAlgorithm == ALGORITHMS.BFS) {
        result = await bfs(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.DFS){
        result = await dfs(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.GREEDY){
        result = await greedy(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.ASTAR){
        result = await astar(beginNode, endNode);
      }
      else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
        result = await dijkstra(beginNode, endNode);
      }
      
      TSP_Matrix[row][col].pathlength = result; 
      TSP_Matrix[col][row].pathlength = TSP_Matrix[row][col].pathlength;
    
    }
  }
  draw_flag = true;
  await sleep(20);
  return result; 
}

function FindingTSPPermutation() {
  let perm_nodes = all_nodes.slice(1,);
  perms = perm(perm_nodes);
        
  var TSP_path = [];
  var TSP_permutation = [];
  var least_dist = 0;
  for(let iter = 0; iter < perms.length; iter++){  
    let permutation = perms[iter];
    TSP_path = [startNode].concat(permutation);

    var start = startNode;
    var end = permutation[0];
    var startindex = all_nodes.indexOf(start);
    var endindex = all_nodes.indexOf(end);
    var distance = TSP_Matrix[startindex][endindex].pathlength;
    var total_dist = distance;
    for(let i = 0; i < permutation.length-1 ; i++)
    {
      start = permutation[i];
      end = permutation[i+1];
      
      startindex = all_nodes.indexOf(start);
      endindex = all_nodes.indexOf(end);
      distance = TSP_Matrix[startindex][endindex].pathlength;
      
      total_dist = total_dist + distance;

    }
    if(iter == 0){
        least_dist = total_dist;
        TSP_permutation = TSP_path;
      }
    if(total_dist < least_dist){
        least_dist = total_dist;
        TSP_permutation = TSP_path;
      }
  }
  return TSP_permutation;
}

async function DrawingTSPpath(TSP_permutation) {
  const length = TSP_permutation.length;
  if (currentAlgorithm == ALGORITHMS.BFS) {
    draw_flag = true;
    path1 = await bfs(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=1 ; i < length-1; i++)  
    {  
      path2 = await bfs(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await bfs(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
  else if (currentAlgorithm == ALGORITHMS.DFS){
    path1 = await dfs(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await dfs(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await dfs(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
  else if (currentAlgorithm == ALGORITHMS.GREEDY){
    path1 = await greedy(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await greedy(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await greedy(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);
  }
  else if (currentAlgorithm == ALGORITHMS.ASTAR){
    path1 = await astar(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await astar(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await astar(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
  else if (currentAlgorithm == ALGORITHMS.DIJKSTRA){
    path1 = await dijkstra(TSP_permutation[0], TSP_permutation[1], true);
    for(let i=0 ; i < length-1;i++)  
    {  
      path2 = await dijkstra(TSP_permutation[i], TSP_permutation[i+1],true,path1);    
      path1 = path2;
    }
    result = await dijkstra(TSP_permutation[length-2], TSP_permutation[length-1],false,path1);  
  }
}


function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

function CreateMatrix(total_no_of_nodes) {
  for(let row = 0; row < total_no_of_nodes; row++) {
    TSP_Matrix[row] = [];
    for(let col = 0; col < total_no_of_nodes; col++) {
      TSP_Matrix[row][col] = {
      pathlength: 0
      };  
    }
  }
}
