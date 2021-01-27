(function(Tree) {
"use strict";

function center(node, relative) {
  return {
    x: node.offsetLeft - relative.x + node.clientWidth / 2,
    y: node.offsetTop - relative.y + node.clientHeight / 2
  }
}

Tree.toHtml = function recur(tree) {
  if (tree === null) {
    const empty = document.createElement("div");
    empty.classList.add("leaf");
    return empty;
  }

  const root = document.createElement("div");
  root.classList.add("node");

  const data = document.createElement("div");
  data.classList.add("data");
  data.textContent = tree.data;
  root.appendChild(data);

  const left = recur(tree.left);
  const right = recur(tree.right);

  root.appendChild(left);
  root.appendChild(right);

  return root;
};

Tree.drawBackground = function(treeElement) {
  const rootElement = treeElement.children[0];
  const relative = { x : rootElement.offsetLeft, y : rootElement.offsetTop }

  const canvas = treeElement.parentElement.querySelector(".tree-bg");

  canvas.width = treeElement.offsetWidth;
  canvas.height = treeElement.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let data of treeElement.querySelectorAll(".data")) {
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
};

Tree.load = function(treeElement, treeData) {
  const rootElement = Tree.toHtml(treeData);
  treeElement.textContent = "";
  treeElement.appendChild(rootElement);
  Tree.drawBackground(treeElement);
}

})(window.Tree = window.Tree || {});
