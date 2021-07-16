import { useState } from 'react';
import SudokuGrid from './SudokuGrid';
import '../css/App.css';
import SudokuBoard from '../js/SudokuBoard';

/*                          React Component Functions                          */

function App(props) {
    const [boardIndex, setBoardIndex] = useState(0);
    const [sudokuBoards, setSudokuBoards] = useState(props.sudokuBoards);

    return ( 
        <div id="root">
            <div className="preloader" id="preloader"></div>

            <div id="sudoku-grid">
                <SudokuGrid sudoku={new SudokuBoard(sudokuBoards[boardIndex])}/>
            </div>

        </div>
    );
}

export default App;
