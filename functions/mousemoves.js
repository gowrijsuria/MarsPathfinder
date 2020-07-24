/* Canvas Eventlisteners */
canvas.onmouseup = function(e) {
  LMBDown = false;
  RMBDown = false;
  moveStart = false;
  moveFinish = false;
  moveVia = false;
  addvia = false;
  addDestn = false;
  addstart = false;
}

canvas.onmousedown = function(e) {
  if(running)
    return;
  if(e.button == 0) { // left click
    LMBDown = true;
  } else if (e.button == 2) { //right click
    RMBDown = true;
  }
  let col = getCol(getX(e));
  let row = getRow(getY(e));
  if (nodes[row][col].state == STATE.START){
    moveStart = true;
  } else if (nodes[row][col].state == STATE.FINISH) {
    moveFinish = true;
  } else if (nodes[row][col].state == STATE.VIA) {
    moveVia = true;
  }
  else if (addDestn) {
    if (e.button == 0) {
      MultiDest(e);
    }
  }
  else if (addstart) {
    if (e.button == 0) {
      MultiStartPoint(e);
    }
  }  
  else {
    if (e.button == 0) {
      createWall(e);
    }
    else if (e.button == 2){
      deleteWall(e);
    }
  }
}


/**
 * Recalls the appropriate functions depending on the
 * status of the mouse and which buttons were pressed
 * @param {} e 
 */
canvas.onmousemove = function(e) {
  if (LMBDown) {
    if (moveStart) {
      moveStartNode(e);
    } else if (moveFinish) {
      moveFinishNode(e);
    } else if (moveVia) {
      moveViaNode(e);
    }
    else if (addDestn) {
      MultiDest(e);
    }
    else if (addstart) {
      MultiStartPoint(e);
    }
    else {
      createWall(e);
    }
  } else if (RMBDown) {
    deleteWall(e)
  }
}

