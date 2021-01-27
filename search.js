(function(SearchUI) {
"use strict";

function log(message) {
  console.log(message);
  TRACES["search"].push(message);
  LOGS["search"].push(message);
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

    const search1 = 13

    const test1 = 
      { "data": 19,
        "left": 
        { "data": 7,
          "left": 
          { "data": 4,
            "left": null,
            "right": null
          },
          "right":
          { "data": 13,
            "left": null,
            "right": 
            { "data": 15,
              "left": null,
              "right": null
            }
          }
        },
        "right": 
        { "data": 34,
          "left": 
          { "data": 4,
            "left": 
            { "data": 23,
              "left": null,
              "right": null
            },
            "right": null
          },
          "right": null
         },
         "right":
         { "data": 56,
           "left": null,
           "right":
           { "data": 71,
            "left": null,
            "right": null
          }
        }
      }

const trees = [tree0, tree1, tree2, tree3, not_tree0, not_tree1, not_tree2, not_tree3];
const searches = [4, 14, 76, 6, 7, 1, 69, 15];

const sampleInputs = [[test1, search1], [tree0, 4], [tree1, 14]];

SearchUI.load = function(section) {
  function queryClass(name) {
    return section.querySelector("." + name);
  }

  function queryClassAll(name) {
    return section.querySelectorAll("." + name);
  }

  const treeElement = queryClass("tree");

  // Choose a tree

  const index = getRandomInt(8);
  const tree = trees[index];
  const searchVal = searches[index];

  // Load the tree

  Tree.load(treeElement, tree);
  const root = treeElement.children[0];
  root.classList.add("current");

  // Update search value in HTML

  for (let searchValElement of queryClassAll("search-val")) {
    searchValElement.textContent = searchVal;
  }

  // Demonstration controls

  queryClass("next-tree").addEventListener("click", function() {
    log("New Tree");
    SearchUI.load(section);
  });

  queryClass("found").addEventListener("click", function() {
    log("Found Node")
  });

  queryClass("reset").addEventListener("click", function () {
    log("Resetting the Log")
    queryClass("current").classList.remove("current");
    root.classList.add("current");
  });

  queryClass("move-left").addEventListener("click", function() {
    const current = queryClass("current");
    if (!current.children[1].classList.contains("leaf")) {
      log("Moved Left");
      current.classList.remove("current");
      current.children[1].classList.add("current");
    }
  });

  queryClass("move-right").addEventListener("click", function() {
    const current = queryClass("current");
    if (!current.children[2].classList.contains("leaf")){
      log("Moved Right");
      current.classList.remove("current");
      current.children[2].classList.add("current");
    }
  });

  queryClass("move-up").addEventListener("click", function() {
    const current = queryClass("current");
    if (!current.parentElement.classList.contains("tree")) {
      log("Moved Up");
      current.classList.remove("current");
      current.parentElement.classList.add("current");
    }
  });

  // Sample inputs

  const table = queryClass("io");

  for (const sampleInput of sampleInputs) {
    const row = document.createElement("tr");

    const col1 = document.createElement("td");
    const treeBg = document.createElement("canvas");
    treeBg.classList.add("tree-bg");
    col1.appendChild(treeBg);
    const treeElement = document.createElement("div");
    treeElement.classList.add("tree");
    col1.appendChild(treeElement);
    row.appendChild(col1);

    const col2 = document.createElement("td");
    col2.textContent = sampleInput[1];
    row.appendChild(col2);

    const col3 = document.createElement("td");
    col3.textContent = "TODO";
    row.appendChild(col3);

    table.appendChild(row);

    Tree.load(treeElement, sampleInput[0]);
  }
};

})(window.SearchUI = window.SearchUI || {});
