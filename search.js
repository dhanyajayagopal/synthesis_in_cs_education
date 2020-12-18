(function() {

var synthesis_log = [];

function log(message) {
  console.log(message);
  synthesis_log.push(message);
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

window.addEventListener("load", function() {
  // Set up trees

  let trees = [tree0, tree1, tree2, tree3, not_tree0, not_tree1, not_tree2, not_tree3];
  let index = getRandomInt(8);
  let root = generateTreeHTML(trees[index]);
  let searches = [4, 14, 76, 6, 7, 1, 69, 15];
  let searchVal = searches[index];

  // Load trees

  let widget = document.querySelector("#search .synthesis-ui");
  widget.querySelector(".tree").appendChild(root);
  widget.querySelector(".instruction").innerHTML = "Search for " + searchVal + " in the BST.";
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
  let found = widget.querySelector(".found");
  let next = widget.querySelector(".next-tree");

  next.addEventListener("click", function() {
    log("New Tree");
    widget.querySelector(".tree").removeChild(root);
    index = getRandomInt(8);
    root = generateTreeHTML(trees[index]);
    widget.querySelector(".tree").appendChild(root);
    searchVal = searches[index];
    widget.querySelector(".instruction").innerHTML = "Search for " + searchVal + " in the BST."
    root.classList.add("current");
    redraw();
  });

  found.addEventListener("click", function() {
    log("Found Node")
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
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  moveRight.addEventListener("click", function() {
    let current = widget.querySelector(".current");
    if (!current.children[2].classList.contains("leaf")){
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
