(function(Insert) {
"use strict";

Insert.allInputs = [
  [{
    "data": 5,
    "left": {
      "data": 3,
      "left": {
        "data": 2,
        "left": null,
        "right": null
      },
      "right": {
        "data": 4,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 7,
      "left": null,
      "right": null
    },
  }, 6],

  [{
    "data": 8,
    "left": {
      "data": 3,
      "left": {
        "data": 1,
        "left": null,
        "right": null
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
    },
  }, 2],

  [{
    "data": 50,
    "left": {
      "data": 17,
      "left": {
        "data": 9,
        "left": null,
        "right": {
          "data": 14,
          "left": {
            "data": 12,
            "left": null,
            "right": null
          },
          "right": null
        },
      },
      "right": {
        "data": 23,
        "left": {
          "data": 19,
          "left": null,
          "right": null
        },
        "right": null
      }
    },
    "right": {
      "data": 76,
      "left": {
        "data": 54,
        "left": null,
        "right": {
          "data": 72,
          "left": {
            "data": 67,
            "left": null,
            "right": null
          },
          "right": null
        },
      },
      "right": null
    },
  }, 43],

  [{
    "data": 7,
    "left": {
      "data": 5,
      "left": {
        "data": 3,
        "left": {
          "data": 1,
          "left": null,
          "right": null
        },
        "right": {
          "data": 4,
          "left": null,
          "right": null
        }
      },
      "right": {
        "data": 6,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 12,
      "left": {
        "data": 9,
        "left": {
          "data": 8,
          "left": null,
          "right": null
        },
        "right": {
          "data": 10,
          "left": null,
          "right": null
        },
      },
      "right": {
        "data": 15,
        "left": {
          "data": 13,
          "left": null,
          "right": null
        },
        "right": {
          "data": 17,
          "left": null,
          "right": null
        },
      },
    },
  }, 14],

  [{
    "data": 5,
    "left": {
      "data": 3,
      "left": {
        "data": 2,
        "left": null,
        "right": null
      },
      "right": {
        "data": 4,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 7,
      "left": null,
      "right": null
    },
  }, 9],

  [{
    "data": 8,
    "left": {
      "data": 3,
      "left": {
        "data": 1,
        "left": null,
        "right": null
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
        "data": 12,
        "left": {
          "data": 13,
          "left": null,
          "right": null
        },
        "right": null
      }
    },
  }, 0],

  [{
    "data": 50,
    "left": {
      "data": 17,
      "left": {
        "data": 9,
        "left": null,
        "right": {
          "data": 14,
          "left": {
            "data": 8,
            "left": null,
            "right": null
          },
          "right": null
        },
      },
      "right": {
        "data": 23,
        "left": {
          "data": 19,
          "left": null,
          "right": null
        },
        "right": null
      }
    },
    "right": {
      "data": 76,
      "left": {
        "data": 54,
        "left": null,
        "right": {
          "data": 69,
          "left": {
            "data": 67,
            "left": null,
            "right": null
          },
          "right": null
        },
      },
      "right": null
    },
  }, 73],


  [{
    "data": 7,
    "left": {
      "data": 5,
      "left": {
        "data": 3,
        "left": {
          "data": 1,
          "left": null,
          "right": null
        },
        "right": {
          "data": 4,
          "left": null,
          "right": null
        }
      },
      "right": {
        "data": 6,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 12,
      "left": {
        "data": 9,
        "left": {
          "data": 8,
          "left": null,
          "right": null
        },
        "right": {
          "data": 13,
          "left": null,
          "right": null
        },
      },
      "right": {
        "data": 15,
        "left": {
          "data": 10,
          "left": null,
          "right": null
        },
        "right": {
          "data": 17,
          "left": null,
          "right": null
        },
      },
    },
  }, 16]
];

Insert.testInputs = [
  [{
    "data": 19,
    "left": {
      "data": 7,
      "left": {
        "data": 4,
        "left": null,
        "right": null
      },
      "right": {
        "data": 13,
        "left": null,
        "right": {
          "data": 15,
          "left": null,
          "right": null
        }
      }
    },
    "right": {
      "data": 34,
      "left": {
        "data": 4,
        "left": {
          "data": 23,
          "left": null,
          "right": null
        },
        "right": null
      },
      "right": null
    },
    "right": {
      "data": 56,
      "left": null,
      "right": {
        "data": 71,
        "left": null,
        "right": null
      }
    }
  }, 5]
]

})(window.Insert = window.Insert || {});
