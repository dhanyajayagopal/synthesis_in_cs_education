(function() {

// TODO
// - generate trees -- done
// - implement reset button -- done
// - save log for synthesis -- done
// - fix UI so leaf isn't messed up -- done

// UI states

const DEFAULT_STATE = 0;
const COMPARE_STATE = 1;

// Mutable state

let state = DEFAULT_STATE;
let firstComparedData = null;
var synthesis_log = [];

// at some point, create list and have log append to that list
// and when restart is clicked, clear the list
function log(message) {
  console.log(message);
  synthesis_log.push(message);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let tree0 =
    { "data": 5,
      "left":
        { "data": 3,
          "left":
             { "data": 2,
               "left": null,
               "right": null
              },
          "right":
             { "data": 4,
               "left": null,
               "right": null
              }
        },
      "right":
        { "data": 7,
          "left": null,
          "right": null
        },
    } // SEARCH 4

let tree1 =
    { "data": 8,
      "left":
        { "data": 3,
          "left":
             { "data": 1,
               "left": null,
               "right": null
              },
          "right":
             { "data": 6,
               "left":
                  { "data": 4,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 7,
                     "left": null,
                     "right": null
                  }
              }
        },
      "right":
        { "data": 10,
          "left": null,
          "right":
             { "data": 14,
               "left":
                  { "data": 13,
                    "left": null,
                    "right": null
                  },
               "right": null
             }
        },
    } // SEARCH 14

let tree2 =
    { "data": 50,
      "left":
        { "data": 17,
          "left":
             { "data": 9,
               "left": null,
               "right":
                  { "data": 14,
                    "left":
                       { "data": 12,
                         "left": null,
                         "right": null
                        },
                    "right": null
                  },
              },
          "right":
             { "data": 23,
               "left":
                  { "data": 19,
                    "left": null,
                    "right": null
                  },
               "right": null
              }
        },
      "right":
        { "data": 76,
          "left":
             { "data": 54,
               "left": null,
               "right":
                  { "data": 72,
                    "left":
                       { "data": 67,
                         "left": null,
                         "right": null
                       },
                    "right": null
                  },
             },
          "right": null
        },
    } // SEARCH 76

let tree3 =
    { "data": 7,
      "left":
        { "data": 5,
          "left":
             { "data": 3,
               "left":
                  { "data": 1,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 4,
                    "left": null,
                    "right": null
                  }
              },
          "right":
             { "data": 6,
               "left": null,
               "right": null
              }
        },
      "right":
        { "data": 12,
          "left":
             { "data": 9,
               "left":
                  { "data": 8,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 10,
                    "left": null,
                    "right": null
                  },
             },
          "right":
             { "data": 15,
               "left":
                  { "data": 13,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 17,
                    "left": null,
                    "right": null
                  },
             },
        },
    } // SEARCH 6

let not_tree0 =
    { "data": 5,
      "left":
        { "data": 3,
          "left":
             { "data": 2,
               "left": null,
               "right": null
              },
          "right":
             { "data": 4,
               "left": null,
               "right": null
              }
        },
      "right":
        { "data": 7,
          "left": null,
          "right": null
        },
    } // SEARCH 7

let not_tree1 =
    { "data": 8,
      "left":
        { "data": 3,
          "left":
             { "data": 1,
               "left": null,
               "right": null
              },
          "right":
             { "data": 6,
               "left":
                  { "data": 4,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 7,
                     "left": null,
                     "right": null
                  }
              }
        },
      "right":
        { "data": 10,
          "left": null,
          "right":
             { "data": 12,
               "left":
                  { "data": 13,
                    "left": null,
                    "right": null
                  },
               "right": null
             }
        },
    } // SEARCH 1

let not_tree2 =
    { "data": 50,
      "left":
        { "data": 17,
          "left":
             { "data": 9,
               "left": null,
               "right":
                  { "data": 14,
                    "left":
                       { "data": 8,
                         "left": null,
                         "right": null
                        },
                    "right": null
                  },
              },
          "right":
             { "data": 23,
               "left":
                  { "data": 19,
                    "left": null,
                    "right": null
                  },
               "right": null
              }
        },
      "right":
        { "data": 76,
          "left":
             { "data": 54,
               "left": null,
               "right":
                  { "data": 69,
                    "left":
                       { "data": 67,
                         "left": null,
                         "right": null
                       },
                    "right": null
                  },
             },
          "right": null
        },
    } // SEARCH 69


let not_tree3 =
    { "data": 7,
      "left":
        { "data": 5,
          "left":
             { "data": 3,
               "left":
                  { "data": 1,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 4,
                    "left": null,
                    "right": null
                  }
              },
          "right":
             { "data": 6,
               "left": null,
               "right": null
              }
        },
      "right":
        { "data": 12,
          "left":
             { "data": 9,
               "left":
                  { "data": 8,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 13,
                    "left": null,
                    "right": null
                  },
             },
          "right":
             { "data": 15,
               "left":
                  { "data": 10,
                    "left": null,
                    "right": null
                  },
               "right":
                  { "data": 17,
                    "left": null,
                    "right": null
                  },
             },
        },
    } // SEARCH 15

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


function generateTreeHTML2(tree) {
  for (let [k, v] of tree) {
    console.log(k, v);
  }
  const root = document.createElement("div");
  root.classList.add("node");

  const data = document.createElement("div");
  data.classList.add("data");
  data.innerHTML = 4;

  const left = document.createElement("div");
  left.classList.add("leaf");

  const right = document.createElement("div");
  right.classList.add("leaf");

  root.appendChild(data);
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

function drawBackground(canvas, relative) {
  canvas.width =  canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let data of document.querySelectorAll(".data")) {
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

window.onload = function() {
  // after we're done creating everything
  let trees = [tree0, tree1, tree2, tree3, not_tree0, not_tree1, not_tree2, not_tree3];
  let index = getRandomInt(8);
  let root = generateTreeHTML(trees[index]);
  let searches = [4, 14, 76, 6, 7, 1, 69, 15];
  let searchVal = searches[index];
  document.getElementById("search--tree").appendChild(root);
  document.getElementById("search--instruction").innerHTML = "Search for " + searchVal + " in the BST."
  root.classList.add("current");

  // Draw lines between nodes

  const canvas = document.getElementById("search--tree-bg");

  function redraw() {
    drawBackground(canvas, { x : root.offsetLeft, y : root.offsetTop });
  }

  window.onresize = redraw;

  redraw();

  // Handle events

  let moveLeft = document.getElementById("search--move-left");
  let moveRight = document.getElementById("search--move-right");
  let moveUp = document.getElementById("search--move-up");
  let atLeaf = document.getElementById("search--at-leaf");
  let reset = document.getElementById("search--reset");
  let found = document.getElementById("search--found");
  let next = document.getElementById("search--next-tree");

  for (let data of document.querySelectorAll(".data")) {
    (function(data) {
      data.addEventListener("click", function() {
        if (state === COMPARE_STATE) {
          if (firstComparedData === null) {
            firstComparedData = data;
            data.classList.add("value-for-comparison");
          } else {
            const secondComparedData = data;

            secondComparedData.classList.add("value-for-comparison");

            // TODO: this is where we actually have both values to compare
            const currentData = document.querySelector(".current > .data");
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

  next.addEventListener("click", function() {
    log("New Tree");
    document.getElementById("search--tree").removeChild(root);
    index = getRandomInt(8);
    root = generateTreeHTML(trees[index]);
    document.getElementById("search--tree").appendChild(root);
    searchVal = searches[index];
    document.getElementById("search--instruction").innerHTML = "Search for " + searchVal + " in the BST."
    root.classList.add("current");
    redraw();
  });


  found.addEventListener("click", function() {
    // TODO check if in correct state
    log("Found Node")
  });

  reset.addEventListener("click", function () {
    log("Resetting the Log")
    let current = document.querySelector(".current");
    current.classList.remove("current");
    root.classList.add("current");
  });

  moveLeft.addEventListener("click", function() {
    let current = document.querySelector(".current");
    if (!current.children[1].classList.contains("leaf")) {
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  moveRight.addEventListener("click", function() {
    let current = document.querySelector(".current");
    if (!current.children[2].classList.contains("leaf")){
      log("Moved Right");
      current.classList.remove("current");
      current.children[2].classList.add("current");
    }
  });

  moveUp.addEventListener("click", function() {
    let current = document.querySelector(".current");
    if (current.parentElement.id != "tree") {
      log("Moved Up");
      current.classList.remove("current");
      current.parentElement.classList.add("current");
    }
  });

}

})();
