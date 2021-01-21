// Library functions

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateTreeHTML(tree) {
  if (tree === null) {
    const empty = document.createElement("div");
    empty.classList.add("leaf");
    return empty;
  }
  const root = document.createElement("div");
  root.classList.add("node");

  const data = document.createElement("div");
  data.classList.add("data");
  data.innerHTML = parseInt(tree["data"]);
  root.appendChild(data);

  const left = generateTreeHTML(tree["left"]);
  const right = generateTreeHTML(tree["right"]);

  root.appendChild(left);
  root.appendChild(right);

  return root;
}

function center(node, relative) {
  return {
    x: node.offsetLeft - relative.x + node.clientWidth / 2,
    y: node.offsetTop - relative.y + node.clientHeight / 2
  }
}

function drawBackground(widget, canvas, relative) {
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let data of widget.querySelectorAll(".data")) {
    const myCenter = center(data, relative);

    const leftNode = data.parentElement.children[1];
    if (leftNode.classList.contains("node")) {
      const leftData = leftNode.children[0];
      const leftCenter = center(leftData, relative);

      ctx.beginPath();
      ctx.moveTo(myCenter.x, myCenter.y);
      ctx.lineTo(leftCenter.x, leftCenter.y);
      ctx.stroke();
    }

    const rightNode = data.parentElement.children[2];
    if (rightNode.classList.contains("node")) {
      const rightData = rightNode.children[0];
      const rightCenter = center(rightData, relative);

      ctx.beginPath();
      ctx.moveTo(myCenter.x, myCenter.y);
      ctx.lineTo(rightCenter.x, rightCenter.y);
      ctx.stroke();
    }
  }
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
  // calling eval for insert code
    let insert_runButton = document.getElementById("run_insert");
    const codeUi = insert_runButton.parentElement;

    const header = codeUi.querySelector(".header")
    const headerText = header.innerHTML;

    const input = codeUi.querySelector(".input");
    const output = codeUi.querySelector(".output");

    insert_runButton.addEventListener("click", function() {
      const code = headerText + input.value;
      fetch("http://localhost:9090/eval_insert", {
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


    // calling eval for search code
    let search_runButton = document.getElementById("run_search");
    const codeUi1 = search_runButton.parentElement;

    const header1 = codeUi1.querySelector(".header")
    const headerText1 = header1.innerHTML;

    const input1 = codeUi1.querySelector(".input");
    const output1 = codeUi1.querySelector(".output");

    search_runButton.addEventListener("click", function() {
      const code = headerText + input.value;
      fetch("http://localhost:9090/eval_search", {
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



  // insert
  let insert_synthbutton = document.getElementById("synth_insert");
  insert_synthbutton.addEventListener("click", function() {
    var log = synthesis_log_search;
    var traces = [];
    for (act of log) {
      trace = {"key": searchVal, "root.val": currentSearchRootVal, "root": 1, "None": 0, "action": act}
      traces.push(trace);
    }
    fetch("http://localhost:9090/insert_synth.py", {
      method: "POST",
      body: JSON.stringify(traces),
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

  // search
  let search_synthbutton = document.getElementById("synth_search");
  search_synthbutton.addEventListener("click", function() {
    var log = synthesis_log_search;
    var traces = [];
    for (act of log) {
      trace = {"key": searchVal, "root.val": currentSearchRootVal, "root": 1, "None": 0, "action": act}
      traces.push(trace);
    }
    fetch("http://localhost:9090/search_synth.py", {
      method: "POST",
      body: JSON.stringify(traces),
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
});
