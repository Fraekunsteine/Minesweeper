let grid = document.getElementById("grid");
let timer = null;
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
  end = false;
  grid.innerHTML="";
  for (let i=0; i<rows; i++) {
    row = grid.insertRow(i);
    for (let j=0; j<cols; j++) {
      cell = row.insertCell(j);
      cell.addEventListener("mouseup", clickHandler);
      let mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  first = true;
}
function addMines(c) {
  for (let i=0; i<nmines; i++) {   
    do  {
      let row = Math.floor(Math.random() * rows);
      let col = Math.floor(Math.random() * cols); 
      var cell = grid.rows[row].cells[col];
    } while (cell===c)
    cell.setAttribute("data-mine","true");   
  }
}
function revealMines() {
  end = true;
  clearInterval(timer);
  for (let i=0; i<rows; i++) {
    for(let j=0; j<cols; j++) {
      let cell = grid.rows[i].cells[j];
      if (cell.getAttribute("data-mine")=="true") {
        cell.className="mine";
        cell.innerHTML="&#10033";
      }
    }
  }
}
function checkLevelCompletion() {
  let levelComplete = true;
    for (let i=0; i<rows; i++) {
      for(let j=0; j<cols; j++) {
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
      start = new Date().getTime()
      timer = setInterval(update, 1000);
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
    let mineCount=0;
    let cellRow = cell.parentNode.rowIndex;
    let cellCol = cell.cellIndex;
    for (let i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,rows-1); i++) {
      for(let j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,cols-1); j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    if (mineCount>0) cell.innerHTML=mineCount;
    else cell.innerHTML=" ";
    if (mineCount==0) { 
      for (let i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,rows-1); i++) {
        for(let j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,cols-1); j++) {
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
  clearInterval(timer);
  document.getElementById("mines").innerHTML="Number of mines left: "+(nmines-count);
  document.getElementById("time").innerHTML="Time elapsed: 0";
  document.getElementById("message").innerHTML="";
}