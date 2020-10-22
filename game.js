let grid = document.getElementById("grid");
let count = 0;

function setEasy() {
  rows = 10;
  cols = 10
  nmines = 15;
  generateGrid();
}
function setMedium() {
  rows = 15;
  cols = 15
  nmines = 50;
  generateGrid();
}
function setHard() {
  rows = 20;
  cols = 20
  nmines = 120;
  generateGrid();
}
function generateGrid() {
  reset();
  start = new Date().getTime()
  end = false;
  timer = setInterval(update, 1000);
  grid.innerHTML="";
  for (var i=0; i<rows; i++) {
    row = grid.insertRow(i);
    for (var j=0; j<cols; j++) {
      cell = row.insertCell(j);
      cell.addEventListener("mouseup", clickHandler);
      var mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  first = true;
}
function addMines(c) {
  for (var i=0; i<nmines; i++) {   
    do  {
      var row = Math.floor(Math.random() * rows);
      var col = Math.floor(Math.random() * cols); 
      var cell = grid.rows[row].cells[col];
    } while (cell===c)
    cell.setAttribute("data-mine","true");   
  }
}
function revealMines() {
  end = true;
  clearInterval(timer);
  for (var i=0; i<rows; i++) {
    for(var j=0; j<cols; j++) {
      var cell = grid.rows[i].cells[j];
      if (cell.getAttribute("data-mine")=="true") {
        cell.className="mine";
        cell.innerHTML="&#10033";
      }
    }
  }
}
function checkLevelCompletion() {
  var levelComplete = true;
    for (var i=0; i<rows; i++) {
      for(var j=0; j<cols; j++) {
        if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
      }
  }
  if (levelComplete) {
    document.getElementById("message").innerHTML="Congratulations!<br>You Win!";
    revealMines();
  }
}
function clickHandler(event) {
  if(!end) {
    let cell = event.target;
    if(first) {
      addMines(cell);
      first = false;
    }
    if(event.which==3 && cell.innerHTML!="" && count > 0) {
      cell.innerHTML="";
      count--;
    }
    else if(event.which==3 && cell.innerHTML=="" && count < nmines) {
      cell.innerHTML="&#128681"; 
      count++;
    }
    else if(event.which==1 && cell.innerHTML=="") clickCell(cell);
    document.getElementById("mines").innerHTML="Number of mines left: "+(nmines-count);
  }
}
function clickCell(cell) {
  if (cell.getAttribute("data-mine")=="true") {
    revealMines();
    document.getElementById("message").innerHTML="<p>You clicked on a mine!<br><br>Game Over...</p><button onclick='generateGrid()'>Restart</button>";
  } else {
    cell.className="clicked";
    var mineCount=0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,rows-1); i++) {
      for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,cols-1); j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    if (mineCount>0) cell.innerHTML=mineCount;
    else cell.innerHTML=" ";
    if (mineCount==0) { 
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,rows-1); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,cols-1); j++) {
          if (grid.rows[i].cells[j].innerHTML=="") clickCell(grid.rows[i].cells[j]);
        }
      }
    }
    checkLevelCompletion();
  }
}
function update() {
  let d = new Date().getTime();
  document.getElementById("time").innerHTML="Time elapsed: "+Math.floor((d-start)/1000);
}
function reset() {
  document.getElementById("mines").innerHTML="Number of mines left: "+(nmines-count);
  document.getElementById("time").innerHTML="Time elapsed: "
  document.getElementById("message").innerHTML=""
}