(function(Insert) {
"use strict";

Insert.currentTrace = [];

function log(message) {
  console.log(message);
  Insert.currentTrace.push(message);
}

function load(section) {
  // Select tree element

  const treeElement = section.querySelector(".tree");

  // Choose a tree

  const randomInput = randomChoice(Insert.allInputs);
  const tree = randomInput[0];
  const insertVal = randomInput[1];

  // Load the tree

  Tree.load(treeElement, tree);
  const root = treeElement.children[0];
  root.classList.add("current");

  // Update insert value in HTML

  for (const el of section.querySelectorAll(".insert-val")) {
    el.textContent = insertVal;
  }
};

Insert.init = function(section) {
  load(section);

  // Demonstration controls

  section.querySelector(".next-tree").addEventListener("click", function() {
    log("New Tree");
    load(section);
  });

  section.querySelector(".insert-right").addEventListener("click", function() {
    log("Insert as Right Child")
  });

  section.querySelector(".insert-left").addEventListener("click", function() {
    log("Insert as Left Child")
  });

  section.querySelector(".reset").addEventListener("click", function () {
    log("Resetting the Log")
    section.querySelector(".current").classList.remove("current");
    root.classList.add("current");
  });

  section.querySelector(".move-left").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.children[1].classList.contains("leaf")) {
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  section.querySelector(".move-right").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.children[2].classList.contains("leaf")){
      log("Moved Right");
      current.classList.remove("current");
      current.children[2].classList.add("current");
    }
  });

  section.querySelector(".move-up").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.parentElement.classList.contains("tree")) {
      log("Moved Up");
      current.classList.remove("current");
      current.parentElement.classList.add("current");
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
    col2.textContent = testInput[1];
    row.appendChild(col2);

    const col3 = document.createElement("td");
    row.appendChild(col3);

    table.appendChild(row);

    Tree.load(inputTreeElement, testInput[0]);
  }
}

})(window.Insert = window.Insert || {});
