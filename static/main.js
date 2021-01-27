"use strict";

const exerciseModules =
  { search: Search
  // , "insert":
  //     { "module": InsertUI
  //     , "log": []
  //     , "trace": []
  //     }
  // , "is-bst":
  //     { "module": IsBstUI
  //     , "log": []
  //     , "trace": []
  //     }
  };

// Library functions

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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

function format(kind, s) {
  if (kind == "text") {
    return s;
  } else if (kind == "code") {
    return "<code>" + s + "</code>";
  } else if (kind == "tree") {
    return Tree.toHtml(s);
  }
}

function fillOutputs(tableElement, outputs, kind) {
  for (let i = 1; i < tableElement.children.length; i++) {
    tableElement.children[i].children[2].innerHTML =
      format(kind, outputs[i - 1]);
  }
}

window.addEventListener("load", function() {
  for (const [exerciseName, exerciseModule] of Object.entries(exerciseModules)) {
    const section = document.getElementById(exerciseName);

    // Synthesis UI

    const synthesize = section.querySelector(".synthesize");

    synthesize.addEventListener("click", function() {
      fetch("http://localhost:9090/synthesize-" + exerciseName, {
        method: "POST",
        body: JSON.stringify(exerciseModule.traces),
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

    const cm = CodeMirror.fromTextArea(
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
          code: cm.getValue(),
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
              resultJson.kind
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

    exerciseModule.load(section);
  }
});
