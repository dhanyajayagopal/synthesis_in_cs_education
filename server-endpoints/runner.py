#!/usr/bin/env python3

import sys
import json
import contextlib
from io import StringIO

from node import *

# https://stackoverflow.com/a/3906390
@contextlib.contextmanager
def capture_stdout(stdout=None):
    old = sys.stdout
    if stdout is None:
        stdout = StringIO()
    sys.stdout = stdout
    yield stdout
    sys.stdout = old

def run(run_function, func_name, output_kind):
    outputs = []
    prints = []
    try:
        body = json.loads(sys.stdin.read())

        exec(body["code"])

        for testInput in body["testInputs"]:
            with capture_stdout() as s:
                outputs.append(run_function(testInput, vars()[func_name]))
            prints.append(json.dumps(s.getvalue()))


        print('{ "code": 0, "outputs": [' \
                + ','.join(outputs) \
                + '], "kind": "' \
                + output_kind \
                + '", "prints": [' \
                + ','.join(prints) \
                + '] }')

    except Exception as e:
        print('{ "code": 1, "error": ' \
                + json.dumps(str(e)) \
                + ', "prints": [' \
                + ','.join(prints) \
                + '] }')
