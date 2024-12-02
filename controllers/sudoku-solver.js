class SudokuSolver {
  validate(puzzleString) {
    const hasValidLength = puzzleString.length === 81;
    const hasValidCharacters = /^[1-9.]+$/.test(puzzleString);

    return { hasValidLength, hasValidCharacters };
  }

  checkRowPlacement(puzzleString, row, value) {
    const rowString = puzzleString.slice((row - 1) * 9, row * 9);
    const regex = new RegExp(value, "g");
    return !regex.test(rowString);
  }

  checkColPlacement(puzzleString, column, value) {
    const colValues = [];

    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleString[i * 9 + column - 1]);
    }

    return !colValues.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionStartRow = Math.floor((row - 1) / 3) * 3;
    const regionStartColumn = Math.floor((column - 1) / 3) * 3;
    const indexToStart = regionStartRow * 9 + regionStartColumn;
    const arr = [];

    for (let i = 0; i < 3; i++) {
      arr.push(
        puzzleString.slice(indexToStart + i * 9, indexToStart + i * 9 + 3)
      );
    }

    const arrString = arr.join("");
    const regex = new RegExp(value, "g");
    return !regex.test(arrString);
  }

  solve(puzzleString) {
    const { hasValidLength, hasValidCharacters } = this.validate(puzzleString);

    if (!hasValidLength) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if (!hasValidCharacters) {
      return { error: "Invalid characters in puzzle" };
    }

    const arr = puzzleString.split("");

    // Backtracking function to solve the puzzle
    const backtrack = () => {
      // Find the next empty cell (represented by '.')
      const emptyCell = arr.findIndex((cell) => cell === ".");

      // If no empty cells are found, puzzle is solved
      if (emptyCell === -1) {
        return true;
      }

      const row = Math.floor(emptyCell / 9) + 1;
      const col = (emptyCell % 9) + 1;

      // Try placing numbers 1-9 in the empty cell
      for (let num = 1; num <= 9; num++) {
        const value = String(num);

        // Check if placing 'num' in the empty cell is valid
        if (
          this.checkRowPlacement(arr, row, value) &&
          this.checkColPlacement(arr, col, value) &&
          this.checkRegionPlacement(arr, row, col, value)
        ) {
          // Place the number in the empty cell
          arr[emptyCell] = value;

          // Recursively attempt to solve the next empty cell
          if (backtrack()) {
            return true; // If solution is found, exit early
          }

          // If the current placement didn't work, reset the cell (backtrack)
          arr[emptyCell] = ".";
        }
      }

      // If no valid number can be placed in the empty cell, return false (backtrack)
      return false;
    }

    // Start solving from the first empty cell
    if (backtrack()) {
      return {solution: arr.join("")};
    } else {
      return { error: "Puzzle cannot be solved"};
    }
  }
}

module.exports = SudokuSolver;
