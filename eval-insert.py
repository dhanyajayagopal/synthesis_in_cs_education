#!/usr/bin/env python3

import sys

class Node:
    def __init__(self, d):
        self.left = None
        self.right = None
        self.data = None

def sortedArrayToBST(arr): 
    if not arr: 
        return None
  
    # find middle 
    mid = (len(arr)) / 2
      
    # make the middle element the root 
    root = Node(arr[mid]) 
      
    # left subtree of root has all 
    # values <arr[mid] 
    root.left = sortedArrayToBST(arr[:mid]) 
      
    # right subtree of root has all  
    # values >arr[mid] 
    root.right = sortedArrayToBST(arr[mid+1:]) 
    return root 

try:
    code = exec(sys.stdin.read())
    # Test Case 1
    list1 = [3, 13, 23, 45, 54, 71, 89, 93, 101]
    root1 = sortedArrayToBST(list)
    insert1 = 30

    # Test Case 2
    list2 = [1, 3, 4, 6, 7, 8, 12, 32, 39]
    root2 = sortedArrayToBST(list2)
    insert2 = 2

    output1 = code(root1, insert1)
    output2 = code(root2, insert2)

except SyntaxError as e:
    print("Syntax error:", e, end="")
