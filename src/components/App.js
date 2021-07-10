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
                <header>
                    <nav>
                        <button key="solve-button" id="solve-button">Solve</button>
                        <button key="check-button" id="check-button">Check</button>
                        <button key="hint-button" id="hint-button">Hint</button>
                        <button key="pause-button" id="pause-button">00:00</button>
                    </nav>
                </header>
                <ul id="grid-list"> <SudokuGrid sudoku={new SudokuBoard(sudokuBoards[boardIndex])}/> </ul>
            </div>

        </div>
    );
}

export default App;
