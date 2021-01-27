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
