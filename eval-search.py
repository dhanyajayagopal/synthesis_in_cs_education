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
    list1 = [4, 7, 13, 15, 19, 23, 34, 56, 71]
    root1 = sortedArrayToBST(list)
    search1 = 13

    # Test Case 2
    list2 = [1, 2, 3, 6, 9, 15, 21, 49, 50, 87]
    root2 = sortedArrayToBST(list2)
    search2 = 2

    output1 = code(root1, search1)
    output2 = code(root2, search2)

    # post request for output

except SyntaxError as e:
    print("Syntax error:", e, end="")
