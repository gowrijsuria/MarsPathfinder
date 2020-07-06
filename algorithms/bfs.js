var Grid = require('../GridCreater');
var grid_ = new Grid.CreateGrid(5, 3);
// var g = grid_.Neighbours(0,0);
var grid = grid_.grid;

// console.log(grid[0][1]);

class BFSFinder
{
	constructor(Source_x,Source_y,Destination_x,Destination_y,grid_)
	{
		this.Source_x = Source_x;
		this.Source_y = Source_y;
		this.Destination_x = Destination_x;
		this.Destination_y = Destination_y;
		this.path = [];
		this.Grid = grid_;
		this.grid = this.Grid.grid;	
		// console.log(this.grid);
		this.destination = this.grid[Destination_x][Destination_y];
		this.source = this.grid[Source_x][Source_y];
		

		
	}

	FindPath(node)
	{
		var path = [];
		path.push(node);
		while(node.previous)
		{
			node = node.previous;
			path.push(node);
		}
		return path.reverse();
	}

	BFS()
	{
		// console.log(frontier.length)
		var frontier = [this.source];
		this.source.visited = 1;
		while(frontier.length > 0)
		{
			var currentLocation = frontier.shift();
			
			if(currentLocation == this.destination)
			{	
				// console.log("llp")
				return this.FindPath(currentLocation);	
			}	
			var neighbours = this.Grid.Neighbours(currentLocation.x,currentLocation.y);
			// console.log(neighbours);	
			for(var k=0; k<neighbours.length; k++)
			{
				var neighbour = neighbours[k];
				if(neighbour.visited == 1)
				{
					continue;
				} 
				frontier.push(neighbour);
				neighbour.visited = 1;
				neighbour.previous = currentLocation;
				
			}	
		}
		return []; 
	}

		// //for faster use linked list  


}


var BreadthFirstSearch = new BFSFinder(0, 0, 0, 3, grid_);
console.log(BreadthFirstSearch.BFS());

