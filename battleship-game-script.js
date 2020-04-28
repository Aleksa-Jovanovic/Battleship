/* Setting interval function */
const intervalID = setInterval(finishGame, 500);

/* Cell values */
const destroyedCellNumber = 4;
const damagedCellNumber = 5;
const hitWaterCellNumber = 6;

const playerBoard1 = JSON.parse(localStorage.getItem("firstPlayerBoard"));
const playerBoard2 = JSON.parse(localStorage.getItem("secondPlayerBoard"));
const playerName1 = localStorage.getItem("firstPlayerName");
const playerName2 = localStorage.getItem("secondPlayerName");

const shieldText = '<i class="fas fa-shield-alt"></i>';
const fistText = '<i class="fas fa-fist-raised"></i>';

// He goes first
let firstPlayerAttacked = true;
let numberOfShipsFighting = [10, 10];

/* HTML calls this */
function initGamePage() {
  createBoard();
  setGameEventListeners();

  document.querySelector("#player-state1").innerHTML = fistText;
  document.querySelector("#player-name1").innerHTML = playerName1;

  document.querySelector("#player-state2").innerHTML = shieldText;
  document.querySelector("#player-name2").innerHTML = playerName2;

  makeAttackerBoard(playerBoard1);
  /*window.addEventListener("mousedown", () => {
    switchBattlePhase();
  });*/
}

/* Helper functions */

function changePlayerState() {
  let state1 = document.querySelector("#player-state1").innerHTML;
  let state2 = document.querySelector("#player-state2").innerHTML;
  document.querySelector("#player-state1").innerHTML = state2;
  document.querySelector("#player-state2").innerHTML = state1;
}

function switchBattlePhase() {
  changePlayerState();
  if (firstPlayerAttacked) {
    makeAttackerBoard(playerBoard2);
    makeDefenderBoard(playerBoard1);
  } else {
    makeAttackerBoard(playerBoard1);
    makeDefenderBoard(playerBoard2);
  }
  firstPlayerAttacked = !firstPlayerAttacked;
}

function makeAttackerBoard(board) {
  let boardNumber = board === playerBoard1 ? 1 : 2;

  for (let i = 0; i < board.matrix.length; i++) {
    for (let j = 0; j < board.matrix[i].length; j++) {
      let id = `${100 * boardNumber + i * 10 + j}`;
      let cell = document.getElementById(id);
      cell.className = "cell";

      let cellNumber = board.matrix[i][j];
      if (cellNumber == emptyCellNumber) {
        continue;
      }
      if (cellNumber == hitWaterCellNumber) {
        console.log("IN");
        cell.classList.add("hit-water-cell");
      }
      if (cellNumber == takenCellNumber) {
        cell.classList.add("taken-cell");
        continue;
      }
      if (cellNumber == damagedCellNumber) {
        cell.classList.add("damaged-cell");
        continue;
      }
      if (cellNumber == destroyedCellNumber) {
        cell.classList.add("destroyed-cell");
        continue;
      }
    }
  }
}

function makeDefenderBoard(board) {
  let boardNumber = board === playerBoard1 ? 1 : 2;

  for (let i = 0; i < board.matrix.length; i++) {
    for (let j = 0; j < board.matrix[i].length; j++) {
      let id = `${100 * boardNumber + i * 10 + j}`;
      let cell = document.getElementById(id);
      cell.className = "cell";

      let cellNumber = board.matrix[i][j];
      if (cellNumber == emptyCellNumber) {
        continue;
      }
      if (cellNumber == hitWaterCellNumber) {
        cell.classList.add("hit-water-cell");
      }
      if (cellNumber == damagedCellNumber) {
        cell.classList.add("damaged-cell");
        continue;
      }
      if (cellNumber == destroyedCellNumber) {
        cell.classList.add("destroyed-cell");
        continue;
      }
    }
  }
}

function sinkShip(cell) {
  console.log("Checking");
  let board = cell.player == 1 ? playerBoard1 : playerBoard2;
  let shipDamagedParts = checkShipDestroyed(
    { row: cell.row, col: cell.col },
    board,
    []
  );
  if (shipDamagedParts.destroyed == true) {
    let boardNumber = board === playerBoard1 ? 1 : 2;
    shipDamagedParts.shipParts.forEach((part) => {
      board.matrix[part.row][part.col] = destroyedCellNumber;
      let id = `${100 * boardNumber + part.row * 10 + part.col}`;
      let cell = document.getElementById(id);
      cell.classList.add("destroyed-cell");
    });
    numberOfShipsFighting[cell.player - 1]--;
  }
}

function checkCoordinatesValid(row, col) {
  if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
    return true;
  } else {
    return false;
  }
}

function checkShipDestroyed(part, board, shipParts) {
  //Push new cell

  shipParts.push(part);

  //Check up
  row = part.row - 1;
  col = part.col;
  if (checkCoordinatesValid(row, col)) {
    if (board.matrix[row][col] == takenCellNumber) {
      shipParts = [];
      return { destroyed: false, shipParts: shipParts };
    }
    if (board.matrix[row][col] == damagedCellNumber) {
      if (notInArray({ row: row, col: col }, shipParts)) {
        shipParts = checkShipDestroyed({ row: row, col: col }, board, shipParts)
          .shipParts;
      }
    }
  }

  //Check right
  row = part.row;
  col = part.col + 1;
  if (checkCoordinatesValid(row, col)) {
    if (board.matrix[row][col] == takenCellNumber) {
      shipParts = [];
      return { destroyed: false, shipParts: shipParts };
    }
    if (board.matrix[row][col] == damagedCellNumber) {
      if (notInArray({ row: row, col: col }, shipParts)) {
        shipParts = checkShipDestroyed({ row: row, col: col }, board, shipParts)
          .shipParts;
      }
    }
  }

  //Check down
  row = part.row + 1;
  col = part.col;
  if (checkCoordinatesValid(row, col)) {
    if (board.matrix[row][col] == takenCellNumber) {
      shipParts = [];
      return { destroyed: false, shipParts: shipParts };
    }
    if (board.matrix[row][col] == damagedCellNumber) {
      if (notInArray({ row: row, col: col }, shipParts)) {
        shipParts = checkShipDestroyed({ row: row, col: col }, board, shipParts)
          .shipParts;
      }
    }
  }

  //Check left
  row = part.row;
  col = part.col - 1;
  if (checkCoordinatesValid(row, col)) {
    if (board.matrix[row][col] == takenCellNumber) {
      shipParts = [];
      return { destroyed: false, shipParts: shipParts };
    }
    if (board.matrix[row][col] == damagedCellNumber) {
      if (notInArray({ row: row, col: col }, shipParts)) {
        shipParts = checkShipDestroyed({ row: row, col: col }, board, shipParts)
          .shipParts;
      }
    }
  }

  return { destroyed: true, shipParts: shipParts };
}

function finishGame() {
  for (let i = 0; i < 2; i++) {
    console.log(numberOfShipsFighting);
    if (numberOfShipsFighting[i] == 0) {
      clearInterval(intervalID);
      console.log(numberOfShipsFighting[i]);
      winner = i == 0 ? playerName1 : playerName2;
      localStorage.clear();
      alert(winner + " won the game!");
      window.location.href = "battleship-welcome.html";
    }
  }
}

function setGameEventListeners() {
  let gameBoardCells = document.querySelectorAll(".cell");
  gameBoardCells.forEach((cell) => {
    //MouseEnter
    cell.addEventListener("mouseenter", () => {
      if (
        (firstPlayerAttacked && cell.player == 2) ||
        (!firstPlayerAttacked && cell.player == 1)
      ) {
        cell.classList.add("hover-cell");
      }
    });
    //MouseLeave
    cell.addEventListener("mouseout", () => {
      cell.classList.remove("hover-cell");
    });
    //MouseDown
    cell.addEventListener("mousedown", (event) => {
      if (
        (firstPlayerAttacked && cell.player == 2) ||
        (!firstPlayerAttacked && cell.player == 1)
      ) {
        let board = cell.player == 1 ? playerBoard1 : playerBoard2;
        let row = cell.row;
        let col = cell.col;
        let cellNumber = board.matrix[row][col];

        if (cellNumber == emptyCellNumber) {
          board.matrix[row][col] = hitWaterCellNumber;
          cell.classList.add("hit-water-cell");
          switchBattlePhase();
        }
        if (cellNumber == takenCellNumber) {
          board.matrix[row][col] = damagedCellNumber;
          cell.classList.add("damaged-cell");
          sinkShip(cell);
        }
      }
    });
  });
}
