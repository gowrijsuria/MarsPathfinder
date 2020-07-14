function Createterrain() {
	
    // let currentHTMLNode = document.getElementById(node);
    // let relevantClassNames = ["start", "target", "object"]
    // let randomTwo = type === "wall" ? 0.25 : 0.35;
    
    for(let row = 0; row < nodes.length; row++) {
      for(let col = 0; col < nodes[row].length; col++) {
 		node = nodes[row][col];   
 		// console.log("feoff");
 		let random = Math.random();
 		let randomTwo = 0.35;
	    if (random < randomTwo && node.state != STATE.START && node.state != STATE.FINISH && node.state != STATE.WALL) {
	    	// console.log("feofnewnf");
			// node.weight = 15;
			node.STATE = STATE.TERRAIN;
		}
	}
}
}	 