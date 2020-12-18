(function(){

// UI states

const DEFAULT_STATE = 0;
const COMPARE_STATE = 1;

// Mutable state

let state = DEFAULT_STATE;
let firstComparedData = null;

var synthesis_log = [];
var written_function = "";

function log(message) {
  console.log(message);
  synthesis_log.push(message);
}

// BINARY SEARCH TREES
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
    }

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
    }

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
    }

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
    }

// NOT BINARY SEARCH TREES

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
             { "data": 6,
               "left": null,
               "right": null
              }
        },
      "right":
        { "data": 7,
          "left": null,
          "right": null
        },
    }

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
             { "data": 9,
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
    }

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
                  { "data": 45,
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
    }

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
    }

window.addEventListener("load", function() {
  // Set up trees

  let trees = [tree0, tree1, tree2, tree3, not_tree0, not_tree1, not_tree2, not_tree3];
  let index = getRandomInt(8);
  let root = generateTreeHTML(trees[index]);

  // Load trees

  let widget = document.querySelector("#is-bst .synthesis-ui");
  widget.querySelector(".tree").appendChild(root);
  root.classList.add("current");

  // Draw lines between nodes

  const canvas = widget.querySelector(".tree-bg");

  function redraw() {
    drawBackground(widget, canvas, { x : root.offsetLeft, y : root.offsetTop });
  }

  window.addEventListener("resize", redraw);

  redraw();

  // Handle events

  let moveLeft = widget.querySelector(".move-left");
  let moveRight = widget.querySelector(".move-right");
  let moveUp = widget.querySelector(".move-up");
  let atLeaf = widget.querySelector(".at-leaf");
  let reset = widget.querySelector(".reset");
  let returnTrue = widget.querySelector(".return-true");
  let returnFalse = widget.querySelector(".return-false");
  let next = widget.querySelector(".next-tree");

  for (let data of widget.querySelectorAll(".data")) {
    (function(data) {
      data.addEventListener("click", function() {
        if (state === COMPARE_STATE) {
          if (firstComparedData === null) {
            firstComparedData = data;
            data.classList.add("value-for-comparison");
          } else {
            const secondComparedData = data;

            secondComparedData.classList.add("value-for-comparison");

            const currentData = widget.querySelector(".current > .data");
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
    widget.querySelector(".tree").removeChild(root);
    index = getRandomInt(8);
    root = generateTreeHTML(trees[index]);
    widget.querySelector(".tree").appendChild(root);
    root.classList.add("current");
    redraw();
  });

  returnTrue.addEventListener("click", function() {
    if (state === DEFAULT_STATE) {
      log("Returned True");
    }
  });

  returnFalse.addEventListener("click", function() {
    // TODO check if in correct state
    log("Returned False")
  });

  atLeaf.addEventListener("click", function() {
    // TODO check if in correct state
    log("Reached leaf node - no new min and max.")
  });

  reset.addEventListener("click", function () {
    log("Resetting the Log")
    let current = widget.querySelector(".current");
    current.classList.remove("current");
    root.classList.add("current");
  });

  moveLeft.addEventListener("click", function() {
    let current = widget.querySelector(".current");
    if (!current.children[1].classList.contains("leaf")) {
      state = COMPARE_STATE;
      window.alert("Please select a new min and a new max.")
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  moveRight.addEventListener("click", function() {
    let current = widget.querySelector(".current");
    if (!current.children[2].classList.contains("leaf")){
      state = COMPARE_STATE;
      window.alert("Please select a new min and a new max.")
      log("Moved Right");
      current.classList.remove("current");
      current.children[2].classList.add("current");
    }
  });

  moveUp.addEventListener("click", function() {
    let current = widget.querySelector(".current");
    if (!current.parentElement.classList.contains("tree")) {
      log("Moved Up");
      current.classList.remove("current");
      current.parentElement.classList.add("current");
    }
  });
});
})();
