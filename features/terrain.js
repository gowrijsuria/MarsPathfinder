
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
				node.weight = 20;

			}
		}
	}
}	 