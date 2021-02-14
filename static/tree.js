(function(Tree) {
"use strict";

function center(node, relative) {
  return {
    x: node.offsetLeft - relative.x + node.clientWidth / 2,
    y: node.offsetTop - relative.y + node.clientHeight / 2
  }
}

function _isBst(node, min, max) {
  if (node == null) {
    return true;
  }

  if (node.data < min || node.data > max) {
    return false;
  }

  return (
    _isBst(node.left, min, node.data - 1)
      && _isBst(node.right, node.data + 1, max)
  );
}

Tree.isBst = function(tree) {
  return _isBst(tree, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}

Tree.toHtml = function recur(tree, selectableLeaves) {
  if (tree === null) {
    if (selectableLeaves) {
      const data = document.createElement("div");
      data.classList.add("data");

      const leftLeaf = document.createElement("div");
      leftLeaf.classList.add("leaf");

      const rightLeaf = document.createElement("div");
      rightLeaf.classList.add("leaf");

      const slot = document.createElement("div");
      slot.classList.add("node")
      slot.classList.add("slot");
      slot.appendChild(data);
      slot.appendChild(leftLeaf);
      slot.appendChild(rightLeaf);

      return slot;
    } else {
      const empty = document.createElement("leaf");
      empty.classList.add("leaf");
      return empty;
    }
  }

  const data = document.createElement("div");
  data.classList.add("data");
  data.textContent = tree.data;

  const root = document.createElement("div");
  root.classList.add("node");
  root.appendChild(data);
  root.appendChild(recur(tree.left, selectableLeaves));
  root.appendChild(recur(tree.right, selectableLeaves));

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

Tree.load = function(treeElement, treeData, selectableLeaves) {
  const rootElement = Tree.toHtml(treeData, selectableLeaves);
  treeElement.textContent = "";
  treeElement.appendChild(rootElement);
  Tree.drawBackground(treeElement);
}

})(window.Tree = window.Tree || {});
