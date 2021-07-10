import { useEffect, useState } from 'react';
import SudokuCell from './SudokuCell';

/*                          State Variables                          */

const $ = window.$;
const BOARD_LENGTH = 9;
const BOARD_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function SudokuGrid(props) {
  //
  let sudoku = props.sudoku;
  var cells = [];
  var sudokuSolution = sudoku.solve();
  var solutionCoords = null;
  var selectedCell = null;
  var markCells = true;
  const [paused, setPaused] = useState(false);
  const [secondsPassed, setSecondsPassed] = useState(0);

  function sleep_async(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  function resetStyleClass(item) {
      var classValue = item.className;
      if (!classValue.includes(' ')) return;
      var newClassValue = classValue.split(' ')[0];
      item.className = newClassValue;
  }

  function addStyleClass(item, className) {
      var classValue = item.className;
      var trimmedClassName = className.trim();
      if (classValue.includes(trimmedClassName)) return;
      item.className = classValue.concat(` ${trimmedClassName}`);
  }

  function removeStyleClass(item, className) {
      var classValue = item.className;
      var trimmedClassName = className.trim();
      if (!classValue.includes(trimmedClassName)) return;
      item.className = classValue.replace(` ${trimmedClassName}`, "");
  }

  function isBaseCell(cell) {
      return cell != null && cell.className.includes('base-cell');
  }

  function updateCell(cell, value = null, className = null) {
      if (value != null) cell.innerText = value;
      if (className != null) addStyleClass(cell, className);
  }

  function getCellCoords(cell) {
      var i = parseInt(cell.id.split('-')[1]);
      var x = i % BOARD_LENGTH;
      var y = Math.floor(i / BOARD_LENGTH);
      return [x, y];
  }

  function getCellByIndex(index) {
      return document.getElementById(`cell-${index}`);
  }

  function getCellByCoords(x, y) {
      var cellIndex = y * BOARD_LENGTH + x;
      return getCellByIndex(cellIndex);
  }

  function getCellValue(cell) {
      return cell.innerText;
  }

  function setCellValue(cell, value) {
    var cellCoords = getCellCoords(cell);
    var cellValue = value.trim();
    cell.innerText = cellValue;
    removeStyleClass(cell, 'wrong-cell');

    if (cellValue === sudokuSolution[cellCoords[1]][cellCoords[0]]) {
        //removeStyleClass(cell, 'wrong-cell');
        // addStyleClass(cell, 'correct-cell');
    } else if (cellValue !== "") {
        removeStyleClass(cell, 'correct-cell');
        //addStyleClass(cell, 'wrong-cell');
    }
  }

  function getCellRight(cell) {
    if (cell === null) return
    let currentCellIndex = Number(cell.id.split('-')[1]) + 1;
    return getCellByIndex(currentCellIndex >= BOARD_LENGTH * BOARD_LENGTH ? 0 : currentCellIndex);
  }

  function getCellLeft(cell) {
    if (cell === null) return
    let currentCellIndex = Number(cell.id.split('-')[1]) - 1;
    return getCellByIndex(currentCellIndex < 0 ? BOARD_LENGTH * BOARD_LENGTH - 1 : currentCellIndex);
  }

  function getCellUp(cell) {
    if (cell === null) return
    let currentCellIndex = (Number(cell.id.split('-')[1]) - BOARD_LENGTH) % (BOARD_LENGTH * BOARD_LENGTH);
    return getCellByIndex(currentCellIndex < 0 ? BOARD_LENGTH * BOARD_LENGTH + currentCellIndex : currentCellIndex);
  }

  function getCellDown(cell) {
    if (cell === null) return
    let currentCellIndex = Number(cell.id.split('-')[1]) + BOARD_LENGTH;
    return getCellByIndex(currentCellIndex >= BOARD_LENGTH * BOARD_LENGTH ? currentCellIndex % (BOARD_LENGTH * BOARD_LENGTH) : currentCellIndex);
  }

  function cellsHaveSameValues(cell1, cell2) {
    if (cell1 === null || cell2 === null) return false;
    const valueCell1 = getCellValue(cell1).trim();
    const valueCell2 = getCellValue(cell2).trim();
    if (valueCell1 === '' || valueCell2 === '') return false; // Do not compare empty cells
    return  valueCell1 === valueCell2;
  }

  function solveCell(cell) {
    if (cell == null) return;

    solutionCoords = getCellCoords(cell);
    updateCell(cell, sudokuSolution[solutionCoords[1]][solutionCoords[0]], 'correct-cell');
    unselectCell(cell);
  }

  function unselectCell(cell) {
    if (cell == null) return;
    
    if (markCells) {
        unmarkRow(cell);
        unmarkColumn(cell);
        unmarkBox(cell);
    }
    
    removeStyleClass(cell, 'selected-cell');
    selectedCell = null;
  }

  function selectCell(cell) {
    if (cell === null /*|| cell === selectedCell*/) {
        return;
    } 

    unselectCell(selectedCell);

    if (markCells) {
        markRow(cell);
        markColumn(cell);
        markBox(cell);
    }

    addStyleClass(cell, "selected-cell");
    selectedCell = cell;
  }

  function markCell(cell, marked = true) {
    if (cell === null) {
        return;
    }
    if (marked) {
        addStyleClass(cell, "marked-cell");
    } else {
        removeStyleClass(cell, "marked-cell");
    }
  }

  function markRow(cell) {
    var cellCoords = getCellCoords(cell);
    for (var currentX = 0; currentX < BOARD_LENGTH; ++currentX) {
        if (currentX === cellCoords[0]) {
            // cell.className = 'selected-cell';
            continue;
        };
        var currentCell = getCellByCoords(currentX, cellCoords[1]);

        if (cellsHaveSameValues(currentCell, cell)) {
            addStyleClass(cell, "wrong-cell");
            addStyleClass(currentCell, "collision-cell");
        }

        markCell(currentCell, true);
    }
  }

  function unmarkRow(cell) {
    var cellCoords = getCellCoords(cell);
    for (var currentX = 0; currentX < BOARD_LENGTH; ++currentX) {
        var currentCell = getCellByCoords(currentX, cellCoords[1]);
        removeStyleClass(currentCell, "collision-cell");
        
        if (isBaseCell(currentCell)) {
            removeStyleClass(currentCell, "wrong-cell")
        }

        markCell(currentCell, false);
    }
  }

  function markColumn(cell) {
    var cellCoords = getCellCoords(cell);
    for (var currentY = 0; currentY < BOARD_LENGTH; ++currentY) {
        if (currentY === cellCoords[1]) {
            // cell.className = 'selected-cell';
            // addStyleClass(cell, "selected-cell");
            continue;
        };
        var currentCell = getCellByCoords(cellCoords[0], currentY);

        if (cellsHaveSameValues(currentCell, cell)) {
            addStyleClass(cell, "wrong-cell");
            addStyleClass(currentCell, "collision-cell");
        }

        markCell(currentCell, true);
    }
  }

  function unmarkColumn(cell) {
    var cellCoords = getCellCoords(cell);
    for (var currentY = 0; currentY < BOARD_LENGTH; ++currentY) {
        var currentCell = getCellByCoords(cellCoords[0], currentY);
        removeStyleClass(currentCell, "collision-cell");
        
        if (isBaseCell(currentCell)) {
            removeStyleClass(currentCell, "wrong-cell")
        }
        
        markCell(currentCell, false);
    }
  }

  function markBox(cell) {
    var cellCoords = getCellCoords(cell);
    var boxSize = 3;
    var startX = Math.floor(cellCoords[0] / 3) * boxSize;
    var startY = Math.floor(cellCoords[1] / 3) * boxSize;

    for (var currentY = startY; currentY < (startY + boxSize); ++currentY) {
        for (var currentX = startX; currentX < (startX + boxSize); ++currentX) {
            if (currentX === cellCoords[0] && currentY === cellCoords[1]) {
                // cell.className = 'selected-cell';
                // addStyleClass(cell, "selected-cell");
                continue;
            };
            var currentCell = getCellByCoords(currentX, currentY);

            if (cellsHaveSameValues(currentCell, cell)) {
                addStyleClass(cell, "wrong-cell");
                addStyleClass(currentCell, "collision-cell");
            }

            markCell(getCellByCoords(currentX, currentY), true);
        }
    }
  }

  function unmarkBox(cell) {
    var cellCoords = getCellCoords(cell);
    var boxSize = 3;
    var startX = Math.floor(cellCoords[0] / 3) * boxSize;
    var startY = Math.floor(cellCoords[1] / 3) * boxSize;

    for (var currentY = startY; currentY < (startY + boxSize); ++currentY) {
        for (var currentX = startX; currentX < (startX + boxSize); ++currentX) {
            var currentCell = getCellByCoords(currentX, currentY);
            removeStyleClass(currentCell, "collision-cell");

            if (isBaseCell(currentCell)) {
                removeStyleClass(currentCell, "wrong-cell")
            }

            markCell(getCellByCoords(currentX, currentY), false);
        }
    }
  }

  async function solveGrid() {
    unselectCell(selectedCell);
    for (var i = 0; i < BOARD_LENGTH * BOARD_LENGTH; ++i) {
        var cell = getCellByIndex(i);
        solveCell(cell);
        await sleep_async(10);
    }
  }

  async function checkGrid() {
    unselectCell(selectedCell);
    for (var i = 0; i < BOARD_LENGTH * BOARD_LENGTH; ++i) {
        var cell = getCellByIndex(i);
        var cellCoords = getCellCoords(cell);

        splatCell(cell);
        if (cell.className.includes("base-cell") || cell.innerText.trim() === '') continue;
        if (cell.innerText.trim() === sudokuSolution[cellCoords[1]][cellCoords[0]]) {
            solveCell(cell);
        } else {
            addStyleClass(cell, "wrong-cell");
        }
        await sleep_async(10);
    }
  }

  function clearCell(cell) {
    if (cell == null) return;
    if (cell.className.includes('editable-cell')) {
        updateCell(cell, '', 'editable-cell');
        unselectCell(cell);
        splatCell(cell);
    }
  }

  function keyPressed(event) {
    console.log(event.key);
    if (event.key === 'Escape' || event.key === 'Enter') {
        unselectCell(selectedCell);
    } else if (selectedCell !== null && BOARD_VALUES.includes(event.key)) {
        if (selectedCell.className.includes("editable-cell")) {
            setCellValue(selectedCell, event.key);
            selectCell(selectedCell); // Reselect
        }
    } else if (selectedCell !== null && event.key === 'ArrowRight') {
      selectCell(getCellRight(selectedCell));
    } else if (selectedCell !== null && event.key === 'ArrowLeft') {
      selectCell(getCellLeft(selectedCell));
    } else if (selectedCell !== null && event.key === 'ArrowUp') {
      selectCell(getCellUp(selectedCell));
    } else if (selectedCell !== null && event.key === 'ArrowDown') {
      selectCell(getCellDown(selectedCell));
    }
  }
  
  function splatCell(cell) {
    /*const color = generateColor();
    const cellWidth = cell.getBoundingClientRect().width;
    const cellHeight = cell.getBoundingClientRect().height;
    const relX = (cell.getBoundingClientRect().left + cellWidth * 0.5) / window.innerWidth;
    const relY = 1 - ((cell.getBoundingClientRect().top + cellHeight * 0.5) / (window.innerHeight));
    splat(relX, relY, 0.0, 0.0, color); */
}

  function mouseClicked(event) {
    var targetIdStr = event.target.id
    console.log(targetIdStr);

    if (targetIdStr.startsWith('cell-')) {
        // splatCell(event.target);
        selectCell(event.target);
    } else if (targetIdStr === 'pause-button') {
        paused = !paused;
        if (paused) {
            document.getElementById('pause-button').innerHTML = 'Continue';
        } else {
            document.getElementById('pause-button').innerHTML = toHHMMSS(secondsPassed);
        }
    } else if (targetIdStr === 'delete-button') {
        clearCell(selectedCell);
    } else if (targetIdStr === 'solve-button') {
        solveGrid();
    } else if (targetIdStr === 'check-button') {
        checkGrid();
    } else if (targetIdStr === 'hint-button') {
        solveCell(selectedCell);
    }
  }

  function toHHMMSS(secondsInt) {
    var hours   = Math.floor(secondsInt / 3600);
    var minutes = Math.floor((secondsInt - (hours * 3600)) / 60);
    var seconds = secondsInt - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (hours < 1) return minutes+':'+seconds;
    return hours+':'+minutes+':'+seconds;
}

function startTimer() {
  var secondsPassed = 0;
  function incrementSeconds() {
      if (paused) return;
      setSecondsPassed(++secondsPassed);
      //document.getElementById('pause-button').innerHTML = toHHMMSS(secondsPassed);
  }
  setInterval(incrementSeconds, 1000);
}

  useEffect(() => {
    $(document).keyup((event) => keyPressed(event));
    $(document).mouseup((event) => mouseClicked(event));
    // document.addEventListener('keypress', keyPressed);
    // document.addEventListener('click', mouseClicked);
    // startTimer();
  });
  
  for (var i = 0; i < (9 * 9); ++i) {
      var x = i % 9;
      var y = Math.floor(i / 9);
      var value = sudoku.board[y][x];
      if (value == null) {
        cells.push(<SudokuCell key={`cell-${i}`} idValue={`cell-${i}`} classValue='editable-cell' textValue='' />);
      } else {
        cells.push(<SudokuCell key={`cell-${i}`} idValue={`cell-${i}`} classValue='base-cell' textValue={value} />);
      }   
  }
  return [
    cells
  ];
}

export default SudokuGrid;