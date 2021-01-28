(function(IsBst) {
  "use strict";

IsBst.allInputs = [
  {
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
  },

  {
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
  },

  {
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
  },

  {
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
  },

  // NOT BINARY SEARCH TREES

  {
    "data": 5,
    "left": {
      "data": 3,
      "left": {
        "data": 2,
        "left": null,
        "right": null
      },
      "right": {
        "data": 6,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 7,
      "left": null,
      "right": null
    },
  },

  {
    "data": 8,
    "left": {
      "data": 3,
      "left": {
        "data": 1,
        "left": null,
        "right": null
      },
      "right": {
        "data": 9,
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
  },

  {
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
          "data": 45,
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
  },

  {
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
  }
];

IsBst.testInputs = [
  {
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
  },
  {
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
  },
  {
    "data": 5,
    "left": {
      "data": 3,
      "left": {
        "data": 2,
        "left": null,
        "right": null
      },
      "right": {
        "data": 6,
        "left": null,
        "right": null
      }
    },
    "right": {
      "data": 7,
      "left": null,
      "right": null
    },
  },
  {
    "data": 8,
    "left": {
      "data": 3,
      "left": {
        "data": 1,
        "left": null,
        "right": null
      },
      "right": {
        "data": 9,
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
  }
];

})(window.IsBst = window.IsBst || {});
