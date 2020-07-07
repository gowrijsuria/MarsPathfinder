
class CreateGrid
{
	constructor(width,height)
	{
		this.width = width;
		this.height = height;
		// walkable = 1 
		// assign walkable = 0 for walls
		
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

}

module.exports.CreateGrid = CreateGrid;
