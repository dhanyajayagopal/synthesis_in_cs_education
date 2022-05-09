(function(Insert) {
"use strict";

let section = undefined;
let currentIndex = undefined;
let currentTrace = undefined;

function log(section, action) {
  const data = section.querySelector(".current > .data");
  const root = data.textContent === "" ? -1 : parseInt(data.textContent);
  const entry = {
    "action": action,
    "root": root,
    "key": Insert.allInputs[currentIndex][1],
  }
  currentTrace.push(entry);
}

function load(newTree) {
  // Reset trace

  currentTrace = [];

  // Select tree element

  const treeElement = section.querySelector(".tree");

  // Choose a tree

  if (newTree) {
    currentIndex = newRandInt(Insert.allInputs.length, currentIndex);
  }
  const tree = Insert.allInputs[currentIndex][0];
  const insertVal = Insert.allInputs[currentIndex][1];

  // Load the tree

  Tree.load(treeElement, tree, true);
  const root = treeElement.children[0];
  root.classList.add("current");

  // Update insert value in HTML

  for (const el of section.querySelectorAll(".insert-val")) {
    el.textContent = insertVal;
  }
};

Insert.restart = function() {
  load(false);
}

Insert.init = function(sec, onDemonstrationComplete) {
  section = sec;

  load(true);

  // Demonstration controls

  section.querySelector(".insert").addEventListener("click", function() {
    log(section, "insert")
    onDemonstrationComplete(currentTrace);
    load(true);
  });

  section.querySelector(".move-left").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.children[1].classList.contains("leaf")) {
      log(section, "move-left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  section.querySelector(".move-right").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.children[2].classList.contains("leaf")){
      log(section, "move-right");
      current.classList.remove("current");
      current.children[2].classList.add("current");
    }
  });

  // Sample inputs

  const table = section.querySelector(".io");

  for (const testInput of Insert.testInputs) {
    const row = document.createElement("tr");

    const col1 = document.createElement("td");
    const inputTreeBg = document.createElement("canvas");
    inputTreeBg.classList.add("tree-bg");
    col1.appendChild(inputTreeBg);
    const inputTreeElement = document.createElement("div");
    inputTreeElement.classList.add("tree");
    col1.appendChild(inputTreeElement);
    row.appendChild(col1);

    const col2 = document.createElement("td");
    const keyBox = document.createElement("input")
    keyBox.type = "text";
    keyBox.addEventListener("input", function() {
      if (keyBox.value.trim() === "") {
        testInput[1] = -1;
      } else {
        const value = parseInt(keyBox.value);
        testInput[1] = isNaN(value) ? -2 : value;
      }
    });
    col2.appendChild(keyBox);
    row.appendChild(col2);

    const col3 = document.createElement("td");
    row.appendChild(col3);

    table.appendChild(row);

    Tree.load(inputTreeElement, testInput[0], false);
  }
}

})(window.Insert = window.Insert || {});
