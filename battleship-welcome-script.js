function checkNames() {
  let pattern = /[a-z0-9_]{3,15}/i;
  let nameGood = false;

  let name1 = document.getElementById("playerName1").value;
  let name2 = document.getElementById("playerName2").value;

  console.log(pattern.test(name1));
  console.log(pattern.test(name2));

  if (pattern.test(name1) && pattern.test(name2)) {
    //Ispravna imena
    window.location.href = "battleship-setup.html";
  } else {
    //Neispravna imena
  }
}
