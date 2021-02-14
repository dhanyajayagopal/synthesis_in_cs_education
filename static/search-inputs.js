(function(Search) {
"use strict";

Search.allInputs = [
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
  }, 2],

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
  }, 7],

  [{
    "data": 50,
    "left": {
      "data": 17,
      "left": {
        "data": 9,
        "left": null,
        "right": {
          "data": 14,
          "left": null,
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
          "left": null,
          "right": null
        },
      },
      "right": null
    },
  }, 30],

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
  }, 11],

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
  }, 7],

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
        "left": null,
        "right": {
          "data": 13,
          "left": null,
          "right": null
        }
      }
    },
  }, 5],

  [{
    "data": 50,
    "left": {
      "data": 17,
      "left": {
        "data": 9,
        "left": null,
        "right": {
          "data": 14,
          "left": null,
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
          "data": 68,
          "left": null,
          "right": null
        },
      },
      "right": null
    },
  }, 54],

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
  }, 10]
];

Search.testInputs = [
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
  }, -1],

  [{
    "data": 35,
    "left": {
      "data": 20,
      "left": {
        "data": 10,
        "left": null,
        "right": {
          "data": 15,
          "left": null,
          "right": null
        },
      },
      "right": {
        "data": 23,
        "left": {
          "data": 21,
          "left": null,
          "right": null
        },
        "right": null
      }
    },
    "right": {
      "data": 44,
      "left": {
        "data": 39,
        "left": null,
        "right": {
          "data": 40,
          "left": null,
          "right": null
        },
      },
      "right": null
    },
  }, -1],

  [{
    "data": 17,
    "left": {
      "data": 6,
      "left": {
        "data": 2,
        "left": null,
        "right": null
      },
      "right": null
    },
    "right": {
      "data": 30,
      "left": {
        "data": 21,
        "left": {
          "data": 19,
          "left": null,
          "right": null
        },
        "right": {
          "data": 28,
          "left": null,
          "right": null
        },
      },
      "right": {
        "data": 45,
        "left": {
          "data": 41,
          "left": null,
          "right": null
        },
        "right": null
      }
    },
  }, -1],
];

})(window.Search = window.Search || {});
