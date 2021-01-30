(function(IsBst) {
"use strict";

let section = undefined;
let currentIndex = undefined;
let currentTrace = undefined;

function log(message) {
  console.log(message);
  currentTrace.push(message);
}

function load(newTree) {
  // Reset trace

  currentTrace = [];

  // Select tree element

  const treeElement = section.querySelector(".tree");

  // Choose a tree

  if (newTree) {
    currentIndex = newRandInt(IsBst.allInputs.length, currentIndex);
  }
  const tree = IsBst.allInputs[currentIndex];

  // Load the tree

  Tree.load(treeElement, tree);
  const root = treeElement.children[0];
  root.classList.add("current");
}

IsBst.restart = function() {
  load(false);
}

IsBst.init = function(sec, onDemonstrationComplete) {
  section = sec;

  load(true);

  // Demonstration controls

  // UI states
  const DEFAULT_STATE = 0;
  const COMPARE_STATE = 1;

  // Mutable state
  let state = DEFAULT_STATE;
  let firstComparedData = null;

  for (const data of section.querySelectorAll(".data")) {
    (function(data) {
      data.addEventListener("click", function() {
        if (state === COMPARE_STATE) {
          if (firstComparedData === null) {
            firstComparedData = data;
            data.classList.add("value-for-comparison");
          } else {
            const secondComparedData = data;

            secondComparedData.classList.add("value-for-comparison");

            const currentData = section.querySelector(".current > .data");
            const currentValue = parseInt(currentData.innerHTML);
            const firstComparedValue = parseInt(firstComparedData.innerHTML);
            const secondComparedValue = parseInt(secondComparedData.innerHTML);

            const tempFirstData = firstComparedData;

            window.setTimeout(function() {
              if (currentValue >= firstComparedValue && currentValue <= secondComparedValue) {
               window.alert("The comparison was successful.");
              } else {
               window.alert("The comparison was not successful.")
              }
              tempFirstData.classList.remove("value-for-comparison");
              secondComparedData.classList.remove("value-for-comparison");
            }, 10);

            log("The new min and max for node " + currentData.innerHTML + " are " + firstComparedValue + " and " + secondComparedValue);

            state = DEFAULT_STATE;
            firstComparedData = null;
          }
        }
      });
    })(data);
  }

  section.querySelector(".return-true").addEventListener("click", function() {
    if (state === DEFAULT_STATE) {
      log("Returned True");
      onDemonstrationComplete(currentTrace);
      load(true);
    }
  });

  section.querySelector(".return-false").addEventListener("click", function() {
    // TODO check if in correct state
    log("Returned False");
    onDemonstrationComplete(currentTrace);
    load(true);
  });

  section.querySelector(".at-leaf").addEventListener("click", function() {
    // TODO check if in correct state
    log("Reached leaf node - no new min and max.");
  });

  section.querySelector(".move-left").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.children[1].classList.contains("leaf")) {
      state = COMPARE_STATE;
      window.alert("Please select a new min and a new max.")
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  section.querySelector(".move-right").addEventListener("click", function() {
    const current = section.querySelector(".current");
    if (!current.children[2].classList.contains("leaf")){
      state = COMPARE_STATE;
      window.alert("Please select a new min and a new max.")
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

  for (const testInput of IsBst.testInputs) {
    const row = document.createElement("tr");

    const col1 = document.createElement("td");
    const inputTreeBg = document.createElement("canvas");
    inputTreeBg.classList.add("tree-bg");
    col1.appendChild(inputTreeBg);
    const inputTreeElement = document.createElement("div");
    inputTreeElement.classList.add("tree");
    col1.appendChild(inputTreeElement);
    row.appendChild(col1);

    const col3 = document.createElement("td");
    row.appendChild(col3);

    table.appendChild(row);

    Tree.load(inputTreeElement, testInput);
  }
};

})(window.IsBst = window.IsBst || {});
