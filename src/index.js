import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

/*                          Template Sudokus                          */

const x = null;

const BOARDS = [
[
    [x, x, x, 2, 6, x, 7, x, 1],
    [6, 8, x, x, 7, x, x, 9, x],
    [1, 9, x, x, x, 4, 5, x, x],
    [8, 2, x, 1, x, x, x, 4, x],
    [x, x, 4, 6, x, 2, 9, x, x],
    [x, 5, x, x, x, 3, x, 2, 8],
    [x, x, 9, 3, x, x, x, 7, 4],
    [x, 4, x, x, 5, x, x, 3, 6],
    [7, x, 3, x, 1, 8, x, x, x]
],
[
    [9, x, 6, x, 7, x, 4, x, 3],
    [x, x, x, 4, x, x, 2, x, x],
    [x, 7, x, x, 2, 3, x, 1, x],
    [5, x, x, x, x, x, 1, x, x],
    [x, 4, x, 2, x, 8, x, 6, x],
    [x, x, 3, x, x, x, x, x, 5],
    [x, 3, x, 7, x, x, x, 5, x],
    [x, x, 7, x, x, 5, x, x, x],
    [4, x, 5, x, 1, x, 7, x, 8]
],
[
    [8, 4, 3, 5, 6, 7, 2, 1, 9],
    [x, x, x, x, x, x, x, x, 6],
    [x, x, x, x, x, x, x, x, 5],
    [3, 8, 4, 6, 7, 2, x, x, 1],
    [x, x, x, 1, 5, 9, x, x, 3],
    [x, x, x, 8, 3, 4, x, x, 7],
    [x, x, x, x, x, x, x, x, 4],
    [x, x, x, x, x, x, x, x, 8],
    [1, 9, 8, 3, 4, 5, 7, 6, 2]
]
];

ReactDOM.render(
  <React.StrictMode>
    <App sudokuBoards={BOARDS}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
