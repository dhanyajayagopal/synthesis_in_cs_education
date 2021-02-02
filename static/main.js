"use strict";

const debug = false;

// URL Handling

const ngrokUrl =
  debug
    ? ""
    : window.prompt("Please enter the code the researcher has provided you.");

function makeUrl(url) {
  if (debug) {
    return "http://localhost:9090/" + url;
  }
  return "http://" + ngrokUrl + ".ngrok.io/" + url;
}

// Demonstration state

const exerciseModules =
  { "search": Search
  , "insert": Insert
  }

const codeMirrors = {};

const traces = {};

// Library functions

// Returns a random integer in [0, n).
function randInt(n) {
  return Math.floor(Math.random() * n);
}

// Returns a random integer in [0, n) \ x.
function newRandInt(n, x) {
  let candidate = x;
  while (candidate === x) {
    candidate = randInt(n);
  }
  return candidate;
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
    outer.innerHTML = inner;
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

    Tree.load(outer.children[1], inner, false);
  }
}

function fillOutputs(tableElement, inputs, outputs, kind, prints) {
  for (let i = 1; i < tableElement.children.length; i++) {
    const row = tableElement.children[i];
    const cell = row.children[row.children.length - 1];

    if (inputs[i - 1][1] === -1) {
      loadWithFormat("text", cell, 'No value for &ldquo;key&rdquo; provided.');
      continue;
    }

    if (inputs[i - 1][1] === -2) {
      loadWithFormat(
        "text",
        cell,
        'Invalid input. Please make sure your value for &ldquo;key&rdquo; is a number.'
      );
      continue;
    }

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

function currentCounter(exerciseName) {
  return Math.max(-1, ...Object.keys(traces[exerciseName])) + 1;
}

function appendCompletedDemonstrationHTML(exerciseName) {
  const counter = currentCounter(exerciseName);

  const demonstrationName = document.createElement("span");
  demonstrationName.textContent =
    ( "Demonstration "
    + (counter + 1)
    + " (completed)"
    );

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.textContent = "Delete";

  const completedDemonstration = document.createElement("li");
  completedDemonstration.appendChild(demonstrationName);
  completedDemonstration.appendChild(deleteButton);

  document
    .getElementById(exerciseName)
    .querySelector(".demonstrations ol")
    .appendChild(completedDemonstration);

  deleteButton.addEventListener("click", function() {
    completedDemonstration.parentElement.removeChild(completedDemonstration);
    delete traces[exerciseName][counter];
  });
}

function appendLatestDemonstrationHTML(exerciseName) {
  const counter = currentCounter(exerciseName);

  const demonstrationName = document.createElement("span");
  demonstrationName.textContent =
    ( "Currently performing Demonstration "
    + (counter + 1)
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

  restartButton.addEventListener("click", function() {
    exerciseModules[exerciseName].restart();
  });
}

function onDemonstrationComplete(exerciseName, trace) {
  const counter = currentCounter(exerciseName);

  const list =
    document
      .getElementById(exerciseName)
      .querySelector(".demonstrations ol")
  list.removeChild(list.lastChild);

  appendCompletedDemonstrationHTML(exerciseName);

  traces[exerciseName][counter] = trace;

  appendLatestDemonstrationHTML(exerciseName);
}

function logPageChange(page) {
  console.log(page);
  fetch(makeUrl("log"), {
    method: "POST",
    body: JSON.stringify({
      group: "page-change",
      action: page,
      state: getApplicationState()
    })
  });
}

// Main

window.addEventListener("load", function() {
  // Interaction

  for (const [exerciseName, exerciseModule] of Object.entries(exerciseModules)) {
    const section = document.getElementById(exerciseName);

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
      fetch(makeUrl("eval-" + exerciseName), {
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
              exerciseModule.testInputs,
              resultJson.outputs,
              resultJson.kind,
              resultJson.prints
            );
          } else {
            window.alert("Python Error\n\n" + resultJson.error);
            fillOutputs(
              ioTable,
              exerciseModule.testInputs,
              Array(exerciseModule.testInputs.length).fill(""),
              "text",
              Array(exerciseModule.testInputs.length).fill("")
            );
          }
        } else if (serverResponse.code === 1) {
          fillOutputs(
            ioTable,
            exerciseModule.testInputs,
            Array(exerciseModule.testInputs.length).fill("Evaluation timed out."),
            "text",
            Array(exerciseModule.testInputs.length).fill("")
          );
        }
      })
      .catch(handleError);
    });

    // Synthesis UI

    const synthesize = section.querySelector(".synthesize");

    synthesize.addEventListener("click", function() {
      fetch(makeUrl("synthesize-" + exerciseName), {
        method: "POST",
        body: JSON.stringify(Object.values(traces[exerciseName])),
      })
      .then(handleHttpResponse)
      .then(serverResponse => {
        // TODO (just alert result for now)
        if (serverResponse.code === SUCCESS) {
          codeMirrors[exerciseName].setValue(serverResponse.result);
        } else if (serverResponse.code === TIMEOUT) {
          window.alert("Evaluation timed out, please try a different set of demonstrations.");
        }
      })
      .catch(handleError);
    });

    // Demonstration handling

    traces[exerciseName] = {};
    appendLatestDemonstrationHTML(exerciseName);

    // Individualized UI and test case handling

    exerciseModule.init(
      section,
      trace => onDemonstrationComplete(exerciseName, trace)
    );

    // Logging

    for (const button of section.querySelectorAll("button:not(.page-control)")) {
      button.addEventListener("click", function() {
        if (button.classList.length < 1) {
          console.error("Button without class:");
          console.error(button);
          return;
        }

        fetch(makeUrl("log"), {
          method: "POST",
          body: JSON.stringify({
            group: exerciseName,
            action: button.classList[0],
            state: getApplicationState()
          })
        });
      });
    }
  }

  // Page handling

  const task1 = document.getElementById("search");
  const task2 = document.getElementById("insert");

  const beginTask1 = document.getElementById("begin-task-1");
  const reviewTask1 = document.getElementById("review-task-1");
  const finishTask1 = document.getElementById("finish-task-1");

  const returnTask2 = document.getElementById("return-task-2");
  const finishTask2 = document.getElementById("finish-task-2");

  task1.style.display = "none";
  task2.style.display = "none";

  beginTask1.style.display = "block";
  reviewTask1.style.display = "none";
  finishTask1.style.display = "block";

  returnTask2.style.display = "none";
  finishTask2.style.display = "block";

  beginTask1.addEventListener("click", function() {
    logPageChange(1);
    task1.style.display = "block";
    beginTask1.style.display = "none";
  });

  reviewTask1.addEventListener("click", function() {
    logPageChange(1);
    task1.style.display = "block";
    task2.style.display = "none";
    reviewTask1.style.display = "none";
    returnTask2.style.display = "block";
    task1.scrollIntoView();
  });

  finishTask1.addEventListener("click", function() {
    logPageChange(2);
    task1.style.display = "none";
    task2.style.display = "block";
    reviewTask1.style.display = "block";
    finishTask1.style.display = "none";
    task2.scrollIntoView();
  });

  returnTask2.addEventListener("click", function() {
    logPageChange(2);
    task1.style.display = "none";
    task2.style.display = "block";
    reviewTask1.style.display = "block";
    returnTask2.style.display = "none";
    task2.scrollIntoView();
  });

  finishTask2.addEventListener("click", function() {
    logPageChange(3);
    window.alert("Thank you for your participation in the study! Please inform the researcher that you are done with both tasks.");
    document.body.textContent = "";
  });
});
