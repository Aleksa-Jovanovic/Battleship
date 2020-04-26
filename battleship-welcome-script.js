/* HTML calls this */
function checkNames() {
  let pattern = /[a-z0-9_]{3,15}/i;

  let name1 = document.getElementById("playerName1").value;
  let name2 = document.getElementById("playerName2").value;

  if (pattern.test(name1) && pattern.test(name2)) {
    //Correct names
    localStorage.setItem("firstPlayerName", name1);
    localStorage.setItem("secondPlayerName", name2);
    window.location.href = "battleship-setup.html";
  } else {
    //Incorect name
    document.querySelector("#playerName1").value = "";
    document.querySelector("#playerName2").value = "";
    //Window popup
  }
}
