class Node:
    def __init__(self, data):
        self.left = None
        self.right = None
        self.val = data

def node_from_js(js):
    if js == None:
        return None
    n = Node(int(js["data"]))
    n.left = node_from_js(js["left"])
    n.right = node_from_js(js["right"])
    return n

def node_to_js(node, func_name):
    if not isinstance(node, Node) and node is not None:
        raise TypeError("Output of '" \
                            + func_name \
                            + "' must be a Node (or None).")
    if node == None:
        return "null"

    if not isinstance(node.val, int):
        raise TypeError("Node values must be integers.")

    if not isinstance(node.left, Node) and node.left is not None:
        raise TypeError("The left subtree of a Node must be a Node (or None).")

    if not isinstance(node.right, Node) and node.right is not None:
        raise TypeError("The right subtree of a Node must be a Node (or None).")

    return '{"data": ' \
              + str(node.val) \
              + ', "left": ' \
              + node_to_js(node.left, func_name) \
              + ', "right": ' \
              + node_to_js(node.right, func_name) \
              + '}'

def bool_to_js(b, func_name):
    if not isinstance(b, bool):
        raise TypeError("Output of '" + func_name + "' must be a boolean.")

    if b:
        return '"True"'
    else:
        return '"False"'
