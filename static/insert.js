(function(Insert) {
"use strict";

Insert.log = [];
Insert.traces = [];

function log(message) {
  console.log(message);
  Insert.log.push(message);
  Insert.traces.push(message);
}

Insert.load = function(section) {
  function queryClass(name) {
    return section.querySelector("." + name);
  }

  function queryClassAll(name) {
    return section.querySelectorAll("." + name);
  }

  // Select tree element

  const treeElement = queryClass("tree");

  // Choose a tree

  const randomInput = randomChoice(Insert.allInputs);
  const tree = randomInput[0];
  const insertVal = randomInput[1];

  // Load the tree

  Tree.load(treeElement, tree);
  const root = treeElement.children[0];
  root.classList.add("current");

  // Update insert value in HTML

  for (const el of queryClassAll("insert-val")) {
    el.textContent = insertVal;
  }

  // Demonstration controls

  queryClass("next").addEventListener("click", function() {
    log("New Tree");
    Insert.load(section);
  });

  queryClass("insert-right").addEventListener("click", function() {
    log("Insert as Right Child")
  });

  queryClass("insert-left").addEventListener("click", function() {
    log("Insert as Left Child")
  });

  queryClass("reset").addEventListener("click", function () {
    log("Resetting the Log")
    queryClass("current").classList.remove("current");
    root.classList.add("current");
  });

  queryClass("move-left").addEventListener("click", function() {
    const current = queryClass("current");
    if (!current.children[1].classList.contains("leaf")) {
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  queryClass("move-right").addEventListener("click", function() {
    const current = queryClass("current");
    if (!current.children[2].classList.contains("leaf")){
      log("Moved Right");
      current.classList.remove("current");
      current.children[2].classList.add("current");
    }
  });

  queryClass("move-up").addEventListener("click", function() {
    const current = queryClass("current");
    if (!current.parentElement.classList.contains("tree")) {
      log("Moved Up");
      current.classList.remove("current");
      current.parentElement.classList.add("current");
    }
  });

  // Sample inputs

  const table = queryClass("io");

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
};

})(window.Insert = window.Insert || {});
