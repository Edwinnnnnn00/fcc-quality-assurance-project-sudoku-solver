"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const dict = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
    };

    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
      return res.send({ error: "Required field(s) missing" });
    }

    const { hasValidLength, hasValidCharacters } = solver.validate(
      req.body.puzzle
    );
    
    if (!hasValidLength) {
      return res.send({ error: 'Expected puzzle to be 81 characters long' });
    }

    if (!hasValidCharacters) {
      return res.send({ error: "Invalid characters in puzzle" });
    }

    if (!/^[a-iA-I][1-9]$/.test(req.body.coordinate)) {
      return res.send({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(req.body.value)) {
      return res.send({ error: "Invalid value" });
    }

    const string = req.body.puzzle;
    const row = dict[req.body.coordinate[0].toUpperCase()];
    const col = parseInt(req.body.coordinate[1]);
    const value = req.body.value;
    const index = (row - 1) * 9 + (col - 1);
    const conflict = [];

    if (string[index] === value) {
      return res.send({ valid: true });
    }

    const validRowPlacement = solver.checkRowPlacement(string, row, value);
    const validColPlacement = solver.checkColPlacement(string, col, value);
    const validRegionPlacement = solver.checkRegionPlacement(
      string,
      row,
      col,
      value
    );

    if (!validRowPlacement) {
      conflict.push("row");
    }

    if (!validColPlacement) {
      conflict.push("column");
    }

    if (!validRegionPlacement) {
      conflict.push("region");
    }

    if (conflict.length > 0) {
      return res.send({
        valid: false,
        conflict,
      });
    } else {
      return res.send({ valid: true });
    }
  });

  app.route("/api/solve").post((req, res) => {
    if (!req.body.puzzle) {
      return res.send({ error: "Required field missing" });
    }

    const { hasValidLength, hasValidCharacters } = solver.validate(
      req.body.puzzle
    );

    if (!hasValidLength) {
      res.send({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!hasValidCharacters) {
      res.send({ error: "Invalid characters in puzzle" });
    }

    res.send(solver.solve(req.body.puzzle));
  });
};
