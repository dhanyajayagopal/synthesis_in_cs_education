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

def run(run_function, func_name):
    body = json.loads(sys.stdin.read())

    outputs = []
    prints = []

    try:
        exec(body["code"], globals())
    except Exception as e:
        for testInput in body["testInputs"]:
            outputs.append(
                '{ "code": 1, "error": '
                    + json.dumps(type(e).__name__ + ": " + str(e))
                    + ' }'
            )
            prints.append('""')

    if outputs == []: # No errors
        for testInput in body["testInputs"]:
            with capture_stdout() as s:
                if func_name not in globals():
                    outputs.append(
                        '{ "code": 1, "error": '
                            + '"Please ensure your function is named \''
                            + func_name
                            + '\'." }'
                    )
                else:
                    try:
                        (output, kind) = \
                            run_function(testInput, globals()[func_name])
                        outputs.append(
                            '{ "code": 0, "output": '
                                + output
                                + ', "kind": "'
                                + kind
                                + '" }'
                        )
                    except Exception as e:
                        outputs.append(
                            '{ "code": 1, "error": '
                                + json.dumps(type(e).__name__ + ": " + str(e))
                                + ' }'
                        )
            prints.append(json.dumps(s.getvalue()))

    print(
        '{ "outputs": ['
            + ','.join(outputs)
            + '], "prints": ['
            + ','.join(prints)
            + '] }'
    )
