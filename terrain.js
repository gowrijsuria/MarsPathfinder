/*
function Createterrain(nodes, isWeighted=true) {
    //var data = [];
    for(let row = 0; row < nodes.length; row++) {
      for(let col = 0; col < nodes[row].length; col++) {
 		node = nodes[row][col];   
 		//data.push({x: row, y: col, heat: node.weight})
	    const max = 100;
		const min = 10;
		
		if(isWeighted == true){
	    	if(node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.WALL){
				node.state = STATE.TERRAIN; 
				node.weight = Math.floor(Math.random() * (max - min) + min);
				console.log(node.weight)
			}
		
			if(node.state == STATE.WALL){
				node.weight = 10000;	
			}
		}

		else if(isWeighted == false){
			if(node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.WALL){
				node.state = STATE.EMPTY; 
				node.weight = 1;
			}


		}
	}
}

}
*/
function Createterrain(nodes) {

	for (let row = 0; row < nodes.length; row++) {
		for (let col = 0; col < nodes[row].length; col++) {
			node = nodes[row][col];
			//console.log("feoff");
			var random = Math.random();
			//var random = 0.1
			var randomTwo = 0.35;
			//if (node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.WALL) {
			// console.log("feofnewnf");
			if (random < randomTwo && node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.WALL) {
				node.state = STATE.TERRAIN;
				console.log(node.state);
				node.weight = 15;

			}
		}
	}
}	 