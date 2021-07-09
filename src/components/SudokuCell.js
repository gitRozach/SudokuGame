import { useState } from 'react';

function SudokuCell(props) {
    const [classValue, setClassValue] = useState(props.classValue);
    const [idValue, setIdValue] = useState(props.idValue);
    const [textValue, setTextValue] = useState(props.textValue);

    return (
        <li className={classValue} id={idValue}>
            <span></span>{textValue}
        </li>
    );
}

export default SudokuCell;