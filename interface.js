(function() {
  window.addEventListener("load", function() {
    for (let button of document.querySelectorAll(".run")) {
      let textarea = document.querySelector("TODO");
      button.addEventListener("click", function() {
        fetch("localhost:9090/eval", {
          method: "POST",
          body: textarea.value()
        }).then(function(response) {
          outputDiv.innerHTML = response
        });
      });
    }
  });
})();
