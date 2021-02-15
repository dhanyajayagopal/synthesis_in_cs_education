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
  return "https://" + ngrokUrl + ".ngrok.io/" + url;
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
  outer.textContent = "";
  if (kind == "text") {
    outer.innerHTML = inner;
  } else if (kind == "code") {
    outer.innerHTML = "<code>" + inner + "</code>";
  } else if (kind == "tree") {
    const treeBg = document.createElement("canvas");
    treeBg.classList.add("tree-bg");
    outer.appendChild(treeBg);

    const treeElement = document.createElement("div");
    treeElement.classList.add("tree");
    outer.appendChild(treeElement);

    Tree.load(outer.children[1], inner, false);
  } else if (kind == "error") {
    const container = document.createElement("div");
    container.classList.add("error");
    container.innerHTML = inner;
    outer.appendChild(container);
  } else if (kind == "python-error") {
    const header = document.createElement("h3");
    header.textContent = "Python Error";

    const message = document.createElement("code");
    message.innerHTML = inner;

    const container = document.createElement("div");
    container.classList.add("error");
    container.appendChild(header);
    container.appendChild(message);
    outer.appendChild(container);
  }
}

function fillOutputs(tableElement, outputs, prints) {
  for (let i = 1; i < tableElement.children.length; i++) {
    const row = tableElement.children[i];
    const cell = row.children[row.children.length - 1];
    const outputEntry = outputs[i - 1]
    const printEntry = prints[i - 1];

    if (outputEntry.code == 0) {
      loadWithFormat(outputEntry.kind, cell, outputEntry.output);
    } else if (outputEntry.code == 1) {
      loadWithFormat("python-error", cell, outputEntry.error);
    }

    if (printEntry != "") {
      const logEl = document.createElement("div");
      logEl.classList.add("log");

      const logHeader = document.createElement("h3");
      logHeader.textContent = "Your Print Statements";
      logEl.appendChild(logHeader);

      for (const line of printEntry.split(/\n/)) {
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
  for (const exerciseName of Object.keys(exerciseModules)) {
    state[exerciseName] = {};
    state[exerciseName].code = codeMirrors[exerciseName].getValue();
    state[exerciseName].traces = traces[exerciseName]
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
    logButton(exerciseName, deleteButton);
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
    logButton(exerciseName, restartButton);
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
  fetch(makeUrl("log"), {
    method: "POST",
    body: JSON.stringify({
      group: "page-change",
      action: page,
      state: getApplicationState()
    })
  });
}

function logButton(groupName, button) {
  fetch(makeUrl("log"), {
    method: "POST",
    body: JSON.stringify({
      group: groupName,
      action: button.classList[0],
      state: getApplicationState()
    })
  });
}

function trackButton(groupName, button) {
  button.addEventListener("click", function() {
    if (button.classList.length < 1) {
      console.error("Button without class:");
      console.error(button);
      return;
    }

    logButton(groupName, button);
  });
}

function addCorrectnessHandler(checkButton, exerciseName, callback) {
  checkButton.addEventListener("click", function() {
    fetch(makeUrl("check-" + exerciseName), {
      method: "POST",
      body: codeMirrors[exerciseName].getValue(),
    })
    .then(handleHttpResponse)
    .then(serverResponse => {
      if (serverResponse.code === 0) {
        callback(JSON.parse(serverResponse.result));
      } else if (serverResponse.code === 1) {
        window.alert("Evaluation timed out.");
      }
    })
    .catch(handleError);
  });
}

function correctnessCallback(checkButton, finishButton, output) {
  return (isCorrect => {
    if (isCorrect) {
      checkButton.disabled = true;
      finishButton.disabled = false;
      output.classList.add("correct");
      output.textContent =
        "Your solution is correct! When you're ready, please move on to the next task."
    } else {
      output.textContent =
        "Your solution is not correct yet.";
    }
  });
}

// Main

window.addEventListener("load", function() {
  // Example trees

  const exampleTree1 = {
    "data": 1,
    "left": {
      "data": 2,
      "left": {
        "data": 4,
        "left": {
          "data": 8,
          "left": null,
          "right": null
        },
        "right": null
      },
      "right": {
        "data": 5,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 3,
      "left": {
        "data": 6,
        "left": null,
        "right": null
      },
      "right": {
        "data": 7,
        "left": null,
        "right": null
      }
    }
  };

  const exampleTree2 = {
    "data": 8,
    "left": {
      "data": 3,
      "left": {
        "data": 1,
        "left": null,
        "right": {
          "data": 2,
          "left": null,
          "right": null
        }
      },
      "right": {
        "data": 6,
        "left": {
          "data": 4,
          "left": null,
          "right": null
        },
        "right": {
          "data": 7,
          "left": null,
          "right": null
        }
      }
    },
    "right": {
      "data": 10,
      "left": null,
      "right": {
        "data": 14,
        "left": {
          "data": 13,
          "left": null,
          "right": null
        },
        "right": null
      }
    }
  };

  Tree.load(
    document.getElementById("example-1a"),
    exampleTree1,
    true
  );

  Tree.load(
    document.getElementById("example-1b"),
    exampleTree1,
    false
  );

  Tree.load(
    document.getElementById("example-2"),
    exampleTree2,
    false
  );

  // Interaction

  for (const [exerciseName, exerciseModule] of Object.entries(exerciseModules)) {
    const section = document.getElementById(exerciseName);

    // Ensure module inputs are BSTs

    for (
      const [tree, _] of
        ( exerciseModule.allInputs
            .concat(exerciseModule.testInputs)
            .concat([[exampleTree2, -1]])
        )
    ) {
      if (!Tree.isBst(tree)) {
        console.error(
          "WARNING! '"
            + exerciseName
            + "' has an input that is not a BST:"
        );
        console.error(tree);
      }
    }

    // Running code

    codeMirrors[exerciseName] = CodeMirror.fromTextArea(
      section.querySelector("textarea"),
      { lineNumbers: true
      , mode: "python"
      , indentUnit: 4
      , extraKeys: {
          "Tab": function(cm) {
            cm.replaceSelection("    ", "end");
          }
        }
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
          fillOutputs(
            ioTable,
            resultJson.outputs,
            resultJson.prints,
          );
        } else if (serverResponse.code === 1) {
          window.alert("Evaluation timed out.");
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
      trackButton(exerciseName, button);
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
  finishTask1.disabled = true;

  returnTask2.style.display = "none";
  finishTask2.style.display = "block";
  finishTask2.disabled = true;

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

  // Checking for correctness

  const checkTask1 = task1.querySelector(".check-correct");
  const checkTask1Output = task1.querySelector(".check-correct-output");

  const checkTask2 = task2.querySelector(".check-correct");
  const checkTask2Output = task2.querySelector(".check-correct-output");

  addCorrectnessHandler(
    checkTask1,
    "search",
    correctnessCallback(checkTask1, finishTask1, checkTask1Output)
  );

  addCorrectnessHandler(
    checkTask2,
    "insert",
    correctnessCallback(checkTask2, finishTask2, checkTask2Output)
  );
});

// function addCorrectnessHandler(checkButton, exerciseName, callback) {
