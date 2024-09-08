import React, { useState } from 'react';
import './SpreadSheet.css';

const Spreadsheet = ({ initialRows = 10, initialCols = 10 }) => {
  const [grid, setGrid] = useState(
    Array.from({ length: initialRows }, () => Array(initialCols).fill(''))
  );
  const [formats, setFormats] = useState({});
  const [selectedCells, setSelectedCells] = useState([]);
  const [clipboard, setClipboard] = useState([]);

  const handleCellChange = (event, rowIndex, colIndex) => {
    const value = event.target.value;
    if (/^-?\d*\.?\d*$/.test(value)) {
      const newGrid = grid.map((row, rIdx) =>
        row.map((col, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? value : col
        )
      );
      setGrid(newGrid);
      updateFormulas(newGrid);
    }
  };

  const updateFormulas = (grid) => {
    const newGrid = grid.map((row, rIdx) =>
      row.map((col, cIdx) => {
        if (typeof col === 'string' && col.startsWith('=')) {
          try {
            return evaluateFormula(col, grid);
          } catch (e) {
            return 'Error';
          }
        }
        return col;
      })
    );
    setGrid(newGrid);
  };

  const evaluateFormula = (formula, grid) => {
    formula = formula.substring(1).toUpperCase();
    if (formula.startsWith('SUM(') && formula.endsWith(')')) {
      return sumFormula(formula.slice(4, -1), grid);
    }
    if (formula.startsWith('AVERAGE(') && formula.endsWith(')')) {
      return averageFormula(formula.slice(8, -1), grid);
    }
    return 'Error';
  };

  const sumFormula = (range, grid) => {
    const cells = parseRange(range);
    return cells.reduce(
      (sum, [row, col]) => sum + parseFloat(grid[row][col] || 0),
      0
    );
  };

  const averageFormula = (range, grid) => {
    const cells = parseRange(range);
    const sum = cells.reduce(
      (sum, [row, col]) => sum + parseFloat(grid[row][col] || 0),
      0
    );
    return sum / cells.length;
  };

  const parseRange = (range) => {
    const [start, end] = range.split(':').map(cellToIndex);
    const cells = [];
    for (let r = start[0]; r <= end[0]; r++) {
      for (let c = start[1]; c <= end[1]; c++) {
        cells.push([r, c]);
      }
    }
    return cells;
  };

  const cellToIndex = (cell) => {
    const col = cell.charCodeAt(0) - 65;
    const row = parseInt(cell.slice(1)) - 1;
    return [row, col];
  };

  const addRow = () => {
    const newGrid = [...grid, Array(grid[0].length).fill('')];
    setGrid(newGrid);
  };

  const addColumn = () => {
    const newGrid = grid.map((row) => [...row, '']);
    setGrid(newGrid);
  };

  const saveSpreadsheet = () => {
    const json = JSON.stringify({ grid, formats });
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spreadsheet.json';
    link.click();
  };

  const loadSpreadsheet = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const { grid, formats } = JSON.parse(event.target.result);
      setGrid(grid);
      setFormats(formats);
    };
    reader.readAsText(file);
  };

  const insertFormula = (formulaType) => {
    if (selectedCells.length > 0) {
      const [row, col] = selectedCells[0];
      let range = prompt('Please enter the cell range (e.g., A1:A3):');
      if (range) {
        const formula = `=${formulaType}(${range})`;
        const newGrid = grid.map((rowArray, rIdx) =>
          rowArray.map((cell, cIdx) =>
            rIdx === row && cIdx === col ? formula : cell
          )
        );
        setGrid(newGrid);
        updateFormulas(newGrid);
      }
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (
      selectedCells.length === 0 ||
      !selectedCells.some(([r, c]) => r === rowIndex && c === colIndex)
    ) {
      setSelectedCells([[rowIndex, colIndex]]);
    } else {
      setSelectedCells(
        selectedCells.filter(([r, c]) => r !== rowIndex || c !== colIndex)
      );
    }
  };

  const copyCells = () => {
    const copiedCells = selectedCells.map(([row, col]) => ({
      row,
      col,
      value: grid[row][col],
    }));
    setClipboard(copiedCells);
  };

  const pasteCells = () => {
    if (clipboard.length > 0 && selectedCells.length > 0) {
      const [startRow, startCol] = selectedCells[0];
      const newGrid = grid.map((rowArray, rIdx) =>
        rowArray.map((cell, cIdx) => {
          const clipboardCell = clipboard.find(
            ({ row, col }) =>
              rIdx === startRow + (row - clipboard[0].row) &&
              cIdx === startCol + (col - clipboard[0].col)
          );
          return clipboardCell ? clipboardCell.value : cell;
        })
      );
      setGrid(newGrid);
    }
  };

  return (
    <div className="center-container">
      <h5>SpreadSheet Application</h5>
      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    className="grid-input"
                    value={cell}
                    onChange={(event) =>
                      handleCellChange(event, rowIndex, colIndex)
                    }
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button className="button" onClick={addRow}>
          Add Row
        </button>
        <button className="button" onClick={addColumn}>
          Add Column
        </button>
        <button className="button" onClick={() => insertFormula('SUM')}>
          Insert Sum Formula
        </button>
        <button className="button" onClick={() => insertFormula('AVERAGE')}>
          Insert Average Formula
        </button>
        <button className="button" onClick={copyCells}>
          Copy
        </button>
        <button className="button" onClick={pasteCells}>
          Paste
        </button>
        <button className="button" onClick={saveSpreadsheet}>
          Save
        </button>
        <input
          type="file"
          id="fileInput"
          className="input-file-hidden"
          onChange={loadSpreadsheet}
        />
        <label htmlFor="fileInput" className="button">
          Choose File
        </label>
      </div>
    </div>
  );
};

export default Spreadsheet;
