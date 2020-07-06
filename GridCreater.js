
class CreateGrid
{
	constructor(width,height)
	{
		this.width = width;
		this.height = height;
		// var walkable;
		// walkable = 1 
		// assign 0 for walls
		
		var node = function (x, y) {
	    this.x = x;
	    this.y = y;
	    this.walkable = 1;
		this.visited = 0;
		};
		this.grid = new Array(height);
		for (var i=0; i<height; i++) 
		{
		  this.grid[i] = new Array(width);
		  for (var j=0; j<width; j++) 
		  {
		   	this.grid[i][j] = new node(j,i);
		  }
		}

	}

	checkWithinBounds(x,y) 
	{
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	IsWalkable(x,y)
	{
		return this.checkWithinBounds(x, y) && this.grid[y][x].walkable && !this.grid[y][x].visited;	
	}

	BuildWall(x,y) 
	{
		this.grid[y][x].walkable = 0;
	}

	Neighbours(x,y)
	{

		var neighbours = [];
		if(this.IsWalkable(x, y - 1)) 
		{
	        neighbours.push(this.grid[y - 1][x]);
	    }

	    // →
	    if(this.IsWalkable(x + 1, y)) 
	    {
	        neighbours.push(this.grid[y][x + 1]);
	    }
	    // ↓
	    if(this.IsWalkable(x, y + 1)) 
	    {
	        neighbours.push(this.grid[y + 1][x]);
	    }
	    // ←
	    if(this.IsWalkable(x - 1, y)) 
	    {
	        neighbours.push(this.grid[y][x - 1]);
	    }

    	return neighbours
	}

}

// var grid_ = new CreateGrid(5, 3);
// var g = grid_.grid;


// console.log(g);
module.exports.CreateGrid = CreateGrid;
