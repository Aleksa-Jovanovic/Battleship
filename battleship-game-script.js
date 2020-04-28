/* Cell values */
const destroyedCellNumber = 4;
const damagedCellNumber = 5;

const playerBoard1 = JSON.parse(localStorage.getItem("firstPlayerBoard"));
const playerBoard2 = JSON.parse(localStorage.getItem("secondPlayerBoard"));
const playerName1 = localStorage.getItem("firstPlayerName");
const playerName2 = localStorage.getItem("secondPlayerName");

const shieldText = '<i class="fas fa-shield-alt"></i>';
const fistText = '<i class="fas fa-fist-raised"></i>';

/* HTML calls this */
function initGamePage() {
  createBoard();

  document.querySelector("#player-state1").innerHTML = fistText;
  document.querySelector("#player-name1").innerHTML = playerName1;

  document.querySelector("#player-state2").innerHTML = shieldText;
  document.querySelector("#player-name2").innerHTML = playerName2;

  window.addEventListener("mousedown", () => {
    changePlayerState();
  });
}

/* Helper functions */
function changePlayerState() {
  let state1 = document.querySelector("#player-state1").innerHTML;
  let state2 = document.querySelector("#player-state2").innerHTML;
  document.querySelector("#player-state1").innerHTML = state2;
  document.querySelector("#player-state2").innerHTML = state1;
}
