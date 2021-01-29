"use strict";

// Demonstration state

const exerciseModules =
  { "search": Search
  , "insert": Insert
  , "is-bst": IsBst
  }

const codeMirrors = {};

const traces = {};

const demonstrationCounters = {};

// Library functions

function randomChoice(xs) {
  return xs[Math.floor(Math.random() * xs.length)];
}

// HTTP helpers

const SUCCESS = 0;
const TIMEOUT = 1;

function handleHttpResponse(httpResponse) {
  if (httpResponse.status === 400) {
    throw new Error("Could not find resource.");
  } else if (httpResponse.status === 404) {
    throw new Error("Malformed request.");
  } else if (httpResponse.status === 500) {
    throw new Error("Internal server error.");
  } else {
    return httpResponse.json();
  }
}

function handleError(error) {
  console.error(error);
}

// Common handlers

function loadWithFormat(kind, outer, inner) {
  if (kind == "text") {
    outer.textContent = inner;
  } else if (kind == "code") {
    outer.innerHTML = "<code>" + inner + "</code>";
  } else if (kind == "tree") {
    outer.textContent = "";

    const treeBg = document.createElement("canvas");
    treeBg.classList.add("tree-bg");
    outer.appendChild(treeBg);

    const treeElement = document.createElement("div");
    treeElement.classList.add("tree");
    outer.appendChild(treeElement);

    Tree.load(outer.children[1], inner);
  }
}

function fillOutputs(tableElement, outputs, kind, prints) {
  for (let i = 1; i < tableElement.children.length; i++) {
    const row = tableElement.children[i];
    const cell = row.children[row.children.length - 1];
    loadWithFormat(kind, cell, outputs[i - 1]);

    if (prints[i - 1] != "") {
      const logEl = document.createElement("div");
      logEl.classList.add("log");

      const logHeader = document.createElement("h3");
      logHeader.textContent = "Your Print Statements";
      logEl.appendChild(logHeader);

      for (const line of prints[i - 1].split(/\n/)) {
        const lineEl = document.createElement("p");
        lineEl.textContent = line;
        logEl.appendChild(lineEl);
      }

      cell.appendChild(logEl);
    }
  }
}

function getApplicationState() {
  const state = {};
  for (const [exerciseName, exerciseModule] of Object.entries(exerciseModules)) {
    state[exerciseName] = {};
    state[exerciseName].currentTrace = exerciseModule.currentTrace;
    state[exerciseName].code = codeMirrors[exerciseName].getValue();
  }
  return state;
}

function newDemonstration(exerciseName) {
  const demonstrationName = document.createElement("span");
  demonstrationName.textContent =
    ( "Currently performing Demonstration "
    + (demonstrationCounters[exerciseName] + 1)
    + "..."
    );

  const restartButton = document.createElement("button");
  restartButton.classList.add("restart");
  restartButton.textContent = "Restart";

  const latestDemonstration = document.createElement("li");
  latestDemonstration.appendChild(demonstrationName);
  latestDemonstration.appendChild(restartButton);

  document
    .getElementById(exerciseName)
    .querySelector(".demonstrations ol")
    .appendChild(latestDemonstration);
}

function onDemonstrationComplete(exerciseName) {
  const demonstrationName = document.createElement("span");
  demonstrationName.textContent =
    ( "Demonstration "
    + (demonstrationCounters[exerciseName] + 1)
    + "(completed)"
    );

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.textContent = "Delete";

  const completedDemonstration = document.createElement("li");
  completedDemonstration.appendChild(demonstrationName);
  completedDemonstration.appendChild(deleteButton);

  const list =
    document
      .getElementById(exerciseName)
      .querySelector(".demonstrations ol");
  list.removeChild(list.lastChild);
  list.appendChild(latestDemonstration);

  demonstrationCounters[exerciseName] += 1;

  newDemonstration(exerciseName);
}

// Main

window.addEventListener("load", function() {
  // Interaction

  for (const [exerciseName, exerciseModule] of Object.entries(exerciseModules)) {
    const section = document.getElementById(exerciseName);

    // Synthesis UI

    demonstrationCounters[exerciseName] = 0;
    newDemonstration(exerciseName);

    const synthesize = section.querySelector(".synthesize");

    synthesize.addEventListener("click", function() {
      fetch("http://localhost:9090/synthesize-" + exerciseName, {
        method: "POST",
        body: JSON.stringify(traces[exerciseName]),
      })
      .then(handleHttpResponse)
      .then(serverResponse => {
        // TODO (just alert result for now)
        if (serverResponse.code === SUCCESS) {
          window.alert(serverResponse.result);
        } else if (serverResponse.code === TIMEOUT) {
          window.alert("Evaluation timed out.");
        }
      })
      .catch(handleError);
    });

    // Running code

    codeMirrors[exerciseName] = CodeMirror.fromTextArea(
      section.querySelector("textarea"),
      { lineNumbers: true
      , mode: "python"
      }
    );

    const run = section.querySelector(".run");
    const ioTable = section.querySelector(".io");

    run.addEventListener("click", function() {
      fetch("http://localhost:9090/eval-" + exerciseName, {
        method: "POST",
        body: JSON.stringify({
          code: codeMirrors[exerciseName].getValue(),
          testInputs: exerciseModule.testInputs
        })
      })
      .then(handleHttpResponse)
      .then(serverResponse => {
        if (serverResponse.code === 0) {
          const resultJson = JSON.parse(serverResponse.result);
          if (resultJson.code === 0) {
            fillOutputs(
              ioTable,
              resultJson.outputs,
              resultJson.kind,
              resultJson.prints
            );
          } else {
            window.alert("Python Error\n\n" + resultJson.error);
            fillOutputs(
              ioTable,
              Array(exerciseModule.testInputs.length).fill(""),
              "text"
            );
          }
        } else if (serverResponse.code === 1) {
          fillOutputs(
            ioTable,
            Array(exerciseModule.testInputs.length).fill("Evaluation timed out."),
            "text"
          );
        }
      })
      .catch(handleError);
    });

    // Individualized UI and test case handling

    exerciseModule.init(section, onDemonstrationComplete);
  }

  // Logging

  for (const button of document.querySelectorAll("button")) {
    button.addEventListener("click", function() {
      if (button.classList.length < 1) {
        console.error("Button without class:");
        console.error(button);
        return;
      }

      fetch("http://localhost:9090/log", {
        method: "POST",
        body: JSON.stringify({
          action: button.classList[0],
          state: getApplicationState()
        })
      });
    });
  }
});
