/*                          Sudoku Backend                          */

class SudokuBoard {
    constructor(board = null) {
        this.board = board;
        this.boardLength = 9;
        this.boxLength = 3;
        this.inputValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    solve() {
        if (this.isSolved(this.board)) {
            return this.board;
        }
        var validBoards = this.filterValidBoards(this.collectNextPosibilities(this.board));
        return this.searchForSolution(validBoards);
    }
    
    searchForSolution(boards) {
        if (boards.length < 1) {
            return false;
        }
    
        var firstBoard = new SudokuBoard(boards.shift());
        const trySolve = firstBoard.solve();
    
        if (trySolve) {
            return trySolve
        }
        return this.searchForSolution(boards);
    }
    
    isSolved(board) {
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
        const firstEmptyCellCoords = this.findFirstEmptyCellCoords(board);
    
        if (firstEmptyCellCoords !== undefined) {
            const x = firstEmptyCellCoords[0];
            const y = firstEmptyCellCoords[1];
    
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
    
    findFirstEmptyCellCoords(board) {
        for (var y = 0; y < this.boardLength; ++y) {
            for (var x = 0; x < this.boardLength; ++x) {
                if (board[y][x] == null) {
                    return [x, y];
                }
            }
        }
    }
    
    filterValidBoards(boards) {
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

export default SudokuBoard;