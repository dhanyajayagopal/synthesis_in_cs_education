"use strict";

const EXERCISES =
  { "search":
      { "module": SearchUI
      , "log": []
      , "trace": []
      }
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
  }

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
  window.alert(
    "An error has occurred. Please inform the investigator.\n\n"
      + error
  );
}

// Common handlers

window.addEventListener("load", function() {
  for (const [exerciseName, exerciseData] of Object.entries(EXERCISES)) {
    const section = document.getElementById(exerciseName);

    // Synthesis UI

    const synthesize = section.querySelector(".synthesize");

    synthesize.addEventListener("click", function() {
      fetch("http://localhost:9090/synthesize-" + exerciseName, {
        method: "POST",
        body: JSON.stringify(exerciseData.traces),
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
    const output = section.querySelector(".output");

    run.addEventListener("click", function() {
      const code = cm.getValue();
      fetch("http://localhost:9090/eval-" + exerciseName, {
        method: "POST",
        body: code,
      })
      .then(handleHttpResponse)
      .then(serverResponse => {
        if (serverResponse.code === SUCCESS) {
          output.innerHTML = serverResponse.result;
        } else if (serverResponse.code === TIMEOUT) {
          output.innerHTML = "Evaluation timed out."
        }
      })
      .catch(handleError);
    });

    // Individualized UI handling

    exerciseData.module.load(section);
  }
});
