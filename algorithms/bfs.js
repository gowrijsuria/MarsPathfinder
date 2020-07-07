var Grid = require('../GridCreater');
var grid_ = new Grid.CreateGrid(5, 3);
var grid = grid_.grid;

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
		var frontier = [this.source];
		this.source.visited = 1;
		while(frontier.length > 0)
		{
			var currentLocation = frontier.shift();
			
			if(currentLocation == this.destination)
			{	
				return this.FindPath(currentLocation);	
			}	
			var neighbours = this.Neighbours(currentLocation.x,currentLocation.y);
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

	Neighbours(x,y)
	{

		var neighbours = [];
		
		//North
		if(this.Grid.IsWalkable(x, y - 1)) 
		{
	        neighbours.push(this.grid[y - 1][x]);
	    }

	    //East
	    if(this.Grid.IsWalkable(x + 1, y)) 
	    {
	        neighbours.push(this.grid[y][x + 1]);
	    }

	    //South
	    if(this.Grid.IsWalkable(x, y + 1)) 
	    {
	        neighbours.push(this.grid[y + 1][x]);
	    }

	    //West
	    if(this.Grid.IsWalkable(x - 1, y)) 
	    {
	        neighbours.push(this.grid[y][x - 1]);
	    }

    	return neighbours
	}

}

var BreadthFirstSearch = new BFSFinder(0, 0, 0, 3, grid_);
console.log(BreadthFirstSearch.BFS());

