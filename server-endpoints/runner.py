#!/usr/bin/env python3

import sys
import json
import contextlib
import traceback
from io import StringIO

from common import Node

# https://stackoverflow.com/a/3906390
@contextlib.contextmanager
def capture_stdout(stdout=None):
    old = sys.stdout
    if stdout is None:
        stdout = StringIO()
    sys.stdout = stdout
    try:
        yield stdout
    finally:
        sys.stdout = old

def run(run_function, func_name, output_kind):
    outputs = []
    prints = []
    try:
        body = json.loads(sys.stdin.read())

        exec(body["code"], globals())

        for testInput in body["testInputs"]:
            with capture_stdout() as s:
                outputs.append(run_function(testInput, globals()[func_name]))
            prints.append(json.dumps(s.getvalue()))

        print('{ "code": 0, "outputs": [' \
                + ','.join(outputs) \
                + '], "kind": "' \
                + output_kind \
                + '", "prints": [' \
                + ','.join(prints) \
                + '] }')

    except Exception as e:
        traceback.print_exc()
        print('{ "code": 1, "error": ' \
                + json.dumps(type(e).__name__ + ": " + str(e)) \
                + ', "prints": [' \
                + ','.join(prints) \
                + '] }')
