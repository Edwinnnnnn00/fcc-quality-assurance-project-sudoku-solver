const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

suite("Unit Tests", () => {
  solver = new Solver();

  suite("Validate string length", () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
      assert.isTrue(
        solver.validate(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        ).hasValidLength
      );
      done();
    });

    test("Logic handles a puzzle string with invalid characters", (done) => {
      assert.isFalse(
        solver.validate(
          "000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        ).hasValidCharacters
      );
      done();
    });

    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
      assert.isFalse(
        solver.validate(
          "..9..5.1.85.4....2432......1...69.83.9."
        ).hasValidLength
      );
      done();
    });
  });

  suite("Check placement", () => {
    test("Logic handles a valid row placement", (done) => {
      assert.isTrue(
        solver.checkRowPlacement(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          3,
          7
        )
      );
      done();
    });

    test("Logic handles a invalid row placement", (done) => {
      assert.isFalse(
        solver.checkRowPlacement(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          8,
          "4"
        )
      );
      done();
    });

    test("Logic handles a valid column placement", (done) => {
      assert.isTrue(
        solver.checkColPlacement(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          7,
          "7"
        )
      );
      done();
    });

    test("Logic handles a invalid column placement", (done) => {
      assert.isFalse(
        solver.checkColPlacement(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          4,
          "4"
        )
      );
      done();
    });

    test("Logic handles a valid region (3x3 grid) placement", (done) => {
      assert.isTrue(
        solver.checkRegionPlacement(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          3,
          7,
          "7"
        )
      );
      done();
    });

    test("Logic handles a invalid region (3x3 grid) placement", (done) => {
      assert.isFalse(
        solver.checkRegionPlacement(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          8,
          4,
          "4"
        )
      );
      done();
    });
  });

  suite("Solve a puzzle", () => {
    test("Valid puzzle strings pass the solver", (done) => {
      assert.equal(
        solver.solve(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        ).solution,
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
      );
      done();
    });

    test("Invalid puzzle strings fail the solver", (done) => {
      assert.deepEqual(
        solver.solve(
          "000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        ), { error: "Invalid characters in puzzle" }
      );
      done();
    });

    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
      assert.equal(
        solver.solve(
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        ).solution,
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
      );
      done();
    });
  });
});
