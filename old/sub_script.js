// This is a single-line JavaScript comment

/*
This is a
multi-line
JavaScript comment
*/

function flipFunction() {
  var testtextElement = document.getElementById("testtext");
  var testpicElement = document.getElementById("testpic");

  if (testtextElement.innerHTML === "Phase 1") {
    testtextElement.innerHTML = "Phase 2";
    testpicElement.src = "docs/assets/img/red.png";
  } else {
    testtextElement.innerHTML = "Phase 1";
    testpicElement.src = "docs/assets/img/green.png";
  }
}