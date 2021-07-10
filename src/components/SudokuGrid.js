import SudokuCell from './SudokuCell';

function SudokuGrid(props) {
    let sudoku = props.sudoku;
    var cells = [];

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

    return cells;
}

export default SudokuGrid;