# Mars Pathfinder

A web application developed to navigate a Mars rover as a part of Microsoft Mars Colonisation Programme. Various pathfinding algorithms are used to find the shortest path between two points while avoiding obstacles on the way.  

[Live demo !!](https://marspathfinder.herokuapp.com/)

This project was built using:
* Vanilla Javascript
* Canvas 
* HTML 
* CSS

**image of app**

## Algorithms 
This pathfinding algorithm visualizer uses the following algorithms to find a path on Mars.
  - **A\* Search** 
  - **Dijkstra Algorithm** 
  - **Greedy Best First Search**
  - **Breadth First Search**
  - **Depth First Search**

## Features 
These are additional ways to explore Mars while travelling to your destination.
  - **Random Obstacles**            - Generates random obstacles on the surface of Mars 
  - **Create Maze**                 - Uses Recursive Maze division to generate a maze 
  - **Via Points**                  - Traverse through via point before reaching your destination
  - **Create Terrain**              - Simulates craters and mountains on Mars , manoeuvre your rover through them 
  - **Add Multiple Destinations**   - Creates multiple end points for the rover 
  - **Closest Destination**         - Travel to your closest destination on Mars 
  - **Add Multiple Start points**   - Creates multiple start points for the rover simulating a multi agent system
  - **Choose start**                - Finds the most optimal start node to reach the destination optimally

### Instructions
 - Change the start and end node postions by dragging
 - To draw walls, use left click
 - To delete walls, use right click
 - Toggle the Closest Destination button to GREEN for finding the closest destination and to RED for normal pathfinding
 - Select the algorithm by using the dropdown list 
 - Click create terrain for simulating the Martian surface 
 - Add multiple destinations or start nodes with via points for complex pathfinding
 - Finally click on Find Path for visualising the path followed by the rover 

Team Martians
 - Gowri Lekshmy 
 - Shivani Chepuri
 - Samhita Kanaparthy
