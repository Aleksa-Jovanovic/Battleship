/* Cell values */
const errorCellNumber = 3;
const reservedCellNumber = 2;
const takenCellNumber = 1;
const emptyCellNumber = 0;

/* HTML calls this */
function nextPlayer() {
  if (totalShipsLeft[0] == 0) {
    document
      .querySelector(".setup-container.player1")
      .classList.add("not-showing");
    document
      .querySelector(".setup-container.player2")
      .classList.remove("not-showing");
  }
}
function startGame() {
  if (totalShipsLeft[1] == 0) {
    window.location.href = "battleship-game.html";
  }
}

class Board {
  constructor() {
    this.matrix = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.matrix[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
        this.matrix[i][j] = emptyCellNumber;
      }
    }
  }
}
const board1 = new Board();
const board2 = new Board();

let mouseDown;
let numberOfNearReserved = 0;
let gameBoards = document.querySelectorAll(".game-board");
let totalShipsLeft = [10, 10];
let currentShipCells = [];
let errorInPlacement = 0;

/* Importing cells */
function createBoard() {
  let charArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let boardNumber = 0;
  gameBoards.forEach((board) => {
    boardNumber++;
    for (let i = 0; i < 121; i++) {
      let cell = document.createElement("div");
      if (i == 0) {
        cell.classList.add("board-header");
      } else if (i > 0 && i < 11) {
        cell.classList.add("board-header");
        cell.innerHTML = `${charArray[i - 1]}`;
      } else if (i > 0 && i % 11 === 0) {
        cell.classList.add("board-header");
        cell.innerHTML = `${i / 11}`;
      } else {
        cell.classList.add("cell");
        cell.id = `${100 * boardNumber + i - 11 - Math.floor(i / 11)}`;
        cell.col = (cell.id - 100 * boardNumber) % 10;
        cell.row = (cell.id - 100 * boardNumber - cell.col) / 10;
        cell.player = boardNumber % 2 == 0 ? 2 : 1;
      }
      board.appendChild(cell);
    }
  });
}

/* Functions for checking rules */
function checkNearShipPlacement(cell) {
  let row = cell.row;
  let col = cell.col;
  let board = cell.player == 1 ? board1 : board2;
  let movement = [-1, 0, 1];

  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      //Skip self
      if (i == 1 && j == 1) {
        continue;
      }

      //Check if in board range
      if (
        row + movement[i] > -1 &&
        row + movement[i] < 10 &&
        col + movement[j] > -1 &&
        col + movement[j] < 10
      ) {
        if (
          board.matrix[row + movement[i]][col + movement[j]] == takenCellNumber
        )
          return true;
        if (
          board.matrix[row + movement[i]][col + movement[j]] ==
          reservedCellNumber
        ) {
          numberOfNearReserved++;
          if (numberOfNearReserved > 1) {
            numberOfNearReserved = 0;
            return true;
          }
        }
      }
    }
  }
  numberOfNearReserved = 0;
  return false;
}

function checkDiagonalPlacement(cell) {
  let row = cell.row;
  let col = cell.col;
  let board = cell.player == 1 ? board1 : board2;
  let movement = [-1, 1];
  for (i = 0; i < movement.length; i++) {
    for (j = 0; j < movement.length; j++) {
      //Check if in board range
      if (
        row + movement[i] > -1 &&
        row + movement[i] < 10 &&
        col + movement[j] > -1 &&
        col + movement[j] < 10
      ) {
        if (
          board.matrix[row + movement[i]][col + movement[j]] ==
          reservedCellNumber
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/* Cell control functions */
function reserveCell(cell) {
  //Paint and input
  let board = cell.player == 1 ? board1 : board2;
  board.matrix[cell.row][cell.col] = reservedCellNumber;
  console.log(board.matrix);
  cell.className = "reserved-cell";
  //Remember cells
  currentShipCells.push({ row: cell.row, col: cell.col, player: cell.player });
  console.log(currentShipCells);
}

function markErrorCell(cell) {
  let board = cell.player == 1 ? board1 : board2;
  board.matrix[cell.row][cell.col] = errorCellNumber;
  cell.className = "error-cell";
  currentShipCells.push({ row: cell.row, col: cell.col, player: cell.player });
  errorInPlacement++;
}

function takeCells() {
  decreaseShipNumber(currentShipCells);
  while (currentShipCells.length != 0) {
    let shipCell = currentShipCells.shift();
    let board = shipCell.player == 1 ? board1 : board2;
    board.matrix[shipCell.row][shipCell.col] = takenCellNumber;
    let id = shipCell.player * 100 + shipCell.row * 10 + shipCell.col;
    let cell = document.getElementById(id);
    cell.className = "taken-cell";
  }
}

function clearCell(shipCell) {
  //shipCell = currentShipCells.pop();
  let board = shipCell.player == 1 ? board1 : board2;
  if (board.matrix[shipCell.row][shipCell.col] == errorCellNumber) {
    errorInPlacement--;
  }
  board.matrix[shipCell.row][shipCell.col] = emptyCellNumber;
  let id = shipCell.player * 100 + shipCell.row * 10 + shipCell.col;
  let cell = document.getElementById(id);
  cell.className = "cell";
}

function clearCells() {
  currentShipCells.forEach((shipCell) => {
    clearCell(shipCell);
  });
  currentShipCells.length = 0;
}

/* Helper functions */
function removeShip(cell) {}

function decreaseShipNumber(shipParts) {
  let shipsBoard1 = ["#boat1", "#small-ship1", "#medium-ship1", "#big-ship1"];
  let shipsBoard2 = ["#boat2", "#small-ship2", "#medium-ship2", "#big-ship2"];
  let shipsBoard = shipParts[0].player == 1 ? shipsBoard1 : shipsBoard2;
  let ship = document.querySelector(`${shipsBoard[shipParts.length - 1]}`);
  let currShipNumber = parseInt(ship.innerHTML);
  currShipNumber--;
  ship.innerHTML = currShipNumber;

  totalShipsLeft[shipParts[0].player - 1]--;
}

function increaseShipNumber(shipParts) {
  let shipsBoard1 = ["#boat1", "#small-ship1", "#medium-ship1", "#big-ship1"];
  let shipsBoard2 = ["#boat2", "#small-ship2", "#medium-ship2", "#big-ship2"];
  let shipsBoard = shipParts[0].player == 1 ? shipsBoard1 : shipsBoard2;
  let ship = document.querySelector(`${shipsBoard[shipParts.length - 1]}`);
  let currShipNumber = parseInt(ship.innerHTML);
  currShipNumber++;
  ship.innerHTML = currShipNumber;
}

function shipSizeValid(shipParts) {
  if (shipParts.length > 4 || shipParts.length == 0) {
    return false;
  }
  let shipsBoard1 = ["#boat1", "#small-ship1", "#medium-ship1", "#big-ship1"];
  let shipsBoard2 = ["#boat2", "#small-ship2", "#medium-ship2", "#big-ship2"];
  let shipsBoard = shipParts[0].player == 1 ? shipsBoard1 : shipsBoard2;
  let ship = document.querySelector(`${shipsBoard[shipParts.length - 1]}`);
  let currShipNumber = parseInt(ship.innerHTML);
  if (currShipNumber > 0) {
    return true;
  } else {
    return false;
  }
}

/* Event listener */
function setEventListeners() {
  /* Window listener */
  window.addEventListener("mouseup", () => {
    mouseDown = false;
    if (errorInPlacement > 0 || !shipSizeValid(currentShipCells)) {
      clearCells();
    } else {
      takeCells();
    }
  });

  /* Cell listeners */
  let gameBoardCells = document.querySelectorAll(".cell");
  gameBoardCells.forEach((cell) => {
    //MouseEnter
    cell.addEventListener("mouseenter", () => {
      //If we go one step back
      if (
        currentShipCells.length > 2 &&
        cell.row == currentShipCells[currentShipCells.length - 2].row &&
        cell.col == currentShipCells[currentShipCells.length - 2].col
      ) {
        console.log("Error");
        clearCell(currentShipCells.pop());
        return;
      }
      if (mouseDown) {
        if (!checkNearShipPlacement(cell) && !checkDiagonalPlacement(cell)) {
          reserveCell(cell);
        } else {
          markErrorCell(cell);
        }
      } else {
        if (!checkNearShipPlacement(cell)) {
          cell.classList.add("hover-cell");
        } else {
          console.log("WrongCell");
          cell.classList.add("hover-error-cell");
        }
      }
    });

    //MoueseLeave
    cell.addEventListener("mouseout", () => {
      cell.classList.remove("hover-cell");
      cell.classList.remove("hover-error-cell");
    });

    //MouseDown
    cell.addEventListener("mousedown", (event) => {
      if (event.button == 2) {
        clearCell({ row: cell.row, col: cell.col, player: cell.player });
        //removeShip();
      } else {
        mouseDown = true;
        if (!checkNearShipPlacement(cell)) {
          reserveCell(cell);
        } else {
          markErrorCell(cell);
        }
      }
    });
  });
}

/* First create boards then add eventListeners */
createBoard();
setEventListeners();
