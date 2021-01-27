(function(Search) {
"use strict";

Search.log = [];
Search.traces = [];

function log(message) {
  console.log(message);
  Search.log.push(message);
  Search.traces.push(message);
}

Search.load = function(section) {
  function queryClass(name) {
    return section.querySelector("." + name);
  }

  function queryClassAll(name) {
    return section.querySelectorAll("." + name);
  }

  // Select tree element

  const treeElement = queryClass("tree");

  // Choose a tree

  const randomInput = randomChoice(Search.allInputs);
  const tree = randomInput[0];
  const searchVal = randomInput[1];

  // Load the tree

  Tree.load(treeElement, tree);
  const root = treeElement.children[0];
  root.classList.add("current");

  // Update search value in HTML

  for (const el of queryClassAll("search-val")) {
    el.textContent = searchVal;
  }

  // Demonstration controls

  queryClass("next-tree").addEventListener("click", function() {
    log("New Tree");
    Search.load(section);
  });

  queryClass("found").addEventListener("click", function() {
    log("Found Node")
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

  for (const testInput of Search.testInputs) {
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

})(window.Search = window.Search || {});
