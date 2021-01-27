#!/usr/bin/env python3

from node import *

import sys
import json

try:
    body = json.loads(sys.stdin.read())

    exec(body["code"]) # defines 'insert'

    for testInput in body["testInputs"]:
        print(search(testInput[0], testInput[1]))

except SyntaxError as e:
    print("Syntax error:", e, end="")
