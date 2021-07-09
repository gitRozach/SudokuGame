import SudokuCell from './SudokuCell';
import '../css/App.css';

/*                          Template Sudokus                          */

const b = null;
const BOARD_LENGTH = 9;
const BOARD_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const BOARD_1 = [
    [b, b, b, 2, 6, b, 7, b, 1],
    [6, 8, b, b, 7, b, b, 9, b],
    [1, 9, b, b, b, 4, 5, b, b],
    [8, 2, b, 1, b, b, b, 4, b],
    [b, b, 4, 6, b, 2, 9, b, b],
    [b, 5, b, b, b, 3, b, 2, 8],
    [b, b, 9, 3, b, b, b, 7, 4],
    [b, 4, b, b, 5, b, b, 3, 6],
    [7, b, 3, b, 1, 8, b, b, b]
];

const BOARD_2 = [
    [9, b, 6, b, 7, b, 4, b, 3],
    [b, b, b, 4, b, b, 2, b, b],
    [b, 7, b, b, 2, 3, b, 1, b],
    [5, b, b, b, b, b, 1, b, b],
    [b, 4, b, 2, b, 8, b, 6, b],
    [b, b, 3, b, b, b, b, b, 5],
    [b, 3, b, 7, b, b, b, 5, b],
    [b, b, 7, b, b, 5, b, b, b],
    [4, b, 5, b, 1, b, 7, b, 8]
];

const BOARD_3 = [
    [8, 4, 3, 5, 6, 7, 2, 1, 9],
    [b, b, b, b, b, b, b, b, 6],
    [b, b, b, b, b, b, b, b, 5],
    [3, 8, 4, 6, 7, 2, b, b, 1],
    [b, b, b, 1, 5, 9, b, b, 3],
    [b, b, b, 8, 3, 4, b, b, 7],
    [b, b, b, b, b, b, b, b, 4],
    [b, b, b, b, b, b, b, b, 8],
    [1, 9, 8, 3, 4, 5, 7, 6, 2]
];

/*                          Sudoku Backend                          */

class SudokuBoard {
    constructor(board = null) {
        this.board = board;
        this.boardLength = 9;
        this.boxLength = 3;
        this.inputValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    solve() {
        if (this.solved(this.board)) {
            return this.board;
        }
        var validBoards = this.keepOnlyValid(this.collectNextPosibilities(this.board));
        return this.searchForSolution(validBoards);
    }
    
    searchForSolution(boards) {
        if (boards.length < 1) {
            return false;
        }
    
        var first = new SudokuBoard(boards.shift());
        const tryPath = first.solve();
    
        if (tryPath != false) {
            return tryPath
        }
        return this.searchForSolution(boards);
    }
    
    solved(board) {
        for (var y = 0; y < this.boardLength; ++y) {
            for (var x = 0; x < this.boardLength; ++x) {
                if (board[y][x] === null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    collectNextPosibilities(board) {
        var results = [];
        const firstEmpty = this.findEmptyCell(board);
    
        if (firstEmpty != undefined) {
            const x = firstEmpty[0];
            const y = firstEmpty[1];
    
            for (var i = 1; i <= 9; ++i) {
                var newBoard = [...board];
                var row = [...newBoard[y]];
                row[x] = i;
                newBoard[y] = row;
                results.push(newBoard);
            }
        }
        return results;
    }
    
    findEmptyCell(board) {
        for (var y = 0; y < this.boardLength; ++y) {
            for (var x = 0; x < this.boardLength; ++x) {
                if (board[y][x] == null) {
                    return [x, y];
                }
            }
        }
    }
    
    keepOnlyValid(boards) {
        return boards.filter((b) => this.isBoardValid(b));
    }
    
    isBoardValid(board) {
        return this.checkRows(board) && this.checkColumns(board) && this.checkBoxes(board);
    }
    
    checkRows(board) {
        for (var y = 0; y < this.boardLength; ++y) {
            var collectedInputs = [];
            for (var x = 0; x < this.boardLength; ++x) {
                var currentItem = board[y][x];
                if (collectedInputs.includes(currentItem)) {
                    return false;
                }
                if (currentItem != null) {
                    collectedInputs.push(currentItem);
                }
            }
        }
        return true;
    }
    
    checkColumns(board) {
        for (var x = 0; x < this.boardLength; ++x) {
            var collectedInputs = [];
            for (var y = 0; y < this.boardLength; ++y) {
                var currentItem = board[y][x];
                if (collectedInputs.includes(currentItem)) {
                    return false;
                }
                if (currentItem != null) {
                    collectedInputs.push(currentItem);
                }
            }
        }
        return true;
    }
    
    checkBoxes(board) {
        const boxCoordinates = [
            [0, 0], [0, 1], [0, 2],
            [1, 0], [1, 1], [1, 2],
            [2, 0], [2, 1], [2, 2]
        ];
    
        for (var y = 0; y < this.boardLength; y += this.boxLength) {
            for (var x = 0; x < this.boardLength; x += this.boxLength) {
                var collectedInputs = [];
                for (var i = 0; i < this.boardLength; ++i) {
                    var currentCoords = [boxCoordinates[i][0] + y, boxCoordinates[i][1] + x];
                    if (collectedInputs.includes(board[currentCoords])) {
                        return false;
                    }
                    if (board[currentCoords] != null) {
                        collectedInputs.push(board[currentCoords]);
                    }
                }
            }
        }
        return true;
    }
}

/*                          State Variables                          */

var sudoku = new SudokuBoard(BOARD_1);
var sudokuSolution = sudoku.solve();
var solutionCoords = null;
var selectedCell = null;
var markCells = true;
var paused = false;
var secondsPassed = 0;

/*                          Helper Functions                          */

function sleep_async(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
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

// Delete function?
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

    if (cellValue == sudokuSolution[cellCoords[1]][cellCoords[0]]) {
        //removeStyleClass(cell, 'wrong-cell');
        // addStyleClass(cell, 'correct-cell');
    } else if (cellValue != "") {
        removeStyleClass(cell, 'correct-cell');
        //addStyleClass(cell, 'wrong-cell');
    }
}

function cellsHaveSameValues(cell1, cell2) {
    if (cell1 == null || cell2 == null) return false;
    const valueCell1 = getCellValue(cell1).trim();
    const valueCell2 = getCellValue(cell2).trim();
    if (valueCell1 == '' || valueCell2 == '') return false; // Do not compare empty cells
    return  valueCell1 == valueCell2;
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
    if (cell == null /*|| cell === selectedCell*/) {
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
    if (cell == null) {
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
        if (currentX == cellCoords[0]) {
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
        if (currentY == cellCoords[1]) {
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
            if (currentX == cellCoords[0] && currentY == cellCoords[1]) {
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

function startTimer() {
    document.getElementById('pause-button').innerHTML = toHHMMSS(secondsPassed);

    function incrementSeconds() {
        if (paused) return;
        secondsPassed += 1;
        document.getElementById('pause-button').innerHTML = toHHMMSS(secondsPassed);
    }
    setInterval(incrementSeconds, 1000);
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
        if (cell.className.includes("base-cell") || cell.innerText.trim() == "") continue;
        if (cell.innerText.trim() == sudokuSolution[cellCoords[1]][cellCoords[0]]) {
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
    if (selectedCell != null && BOARD_VALUES.includes(event.key.toString())) {
        if (selectedCell.className.includes("editable-cell")) {
            setCellValue(selectedCell, event.key.toString());
            selectCell(selectedCell); // Reselect
        }
    }
}

function splatCell(cell) {
    /*Console.log(window.pageYOffset);
    console.log(window.scrollY);
    const color = generateColor();
    const cellWidth = cell.getBoundingClientRect().width;
    const cellHeight = cell.getBoundingClientRect().height;
    const relX = (cell.getBoundingClientRect().left + cellWidth * 0.5) / window.innerWidth;
    const relY = 1 - ((cell.getBoundingClientRect().top + cellHeight * 0.5) / (window.innerHeight));
    splat(relX, relY, 0.0, 0.0, color);*/
}
 
function mouseClicked(event) {
    var targetIdStr = event.target.id.toString();
    console.log(targetIdStr);

    if (targetIdStr.startsWith('cell-')) {
        splatCell(event.target);
        selectCell(event.target);
    } else if (targetIdStr == 'pause-button') {
        paused = !paused;
        if (paused) {
            document.getElementById('pause-button').innerHTML = 'Continue';
        } else {
            document.getElementById('pause-button').innerHTML = toHHMMSS(secondsPassed);
        }
    } else if (targetIdStr == 'delete-button') {
        clearCell(selectedCell);
    } else if (targetIdStr == 'solve-button') {
        solveGrid();
    } else if (targetIdStr == 'check-button') {
        checkGrid();
    } else if (targetIdStr == 'hint-button') {
        solveCell(selectedCell);
    }
}

/*                          React Component Functions                          */

function SudokuGrid() {
    var cells = [];

    for (var i = 0; i < (9 * 9); ++i) {
        var x = i % 9;
        var y = Math.floor(i / 9);
        var value = sudoku.board[y][x];
        if (value == null) {
          cells.push(<SudokuCell idValue={`cell-${i}`} classValue='editable-cell' textValue='' />);
        } else {
          cells.push(<SudokuCell idValue={`cell-${i}`} classValue='base-cell' textValue={value} />);
        }   
    }

    return cells;
}

function App() {
    document.addEventListener("keypress", keyPressed);
    document.addEventListener('click', mouseClicked);
    document.getElementById('solve-button').addEventListener('click', solveGrid);
    document.getElementById('check-button').addEventListener('click', checkGrid);
    document.getElementById('hint-button').addEventListener('click', () => console.log('lal'));
    startTimer();

    return ( 
        <div id="root">
            <canvas id="fluid-canvas"></canvas>
            
            <nav>
              <h3></h3>
              <h3></h3>
              <h3></h3>
              <h3></h3>
              <h3 id="solve-button">Solve</h3>
              <h3 id="check-button">Check</h3>
              <h3 id="hint-button">Hint</h3>
              <h3 id="pause-button">00:00</h3>
            </nav>

            <div id="sudoku-grid">
              <ul id="grid-list">{SudokuGrid()}</ul>
            </div>

        </div>
    );
}

export default App;
