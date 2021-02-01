import json
import sys

# Helpers

def find(xs, x):
    for (key, val) in xs:
        if key == x:
            return val
    return None

def indent_lines(indent, lines):
    s = ""
    indent_string = "    " * indent
    for line in lines:
        s += indent_string + line + "\n"
    return s

def flatten(xss):
    return [x for xs in xss for x in xs]

# Grammar

[
    RootVal, # int
    Key, # int
    BoolTrue, # bool
    BoolFalse, # bool
    IsLeaf, # bool
    IntLessThan, # (int, int) -> bool
    IntEqual, # (int, int) -> bool
] = range(7)

def show(exp):
    head = exp[0]
    if head == RootVal:
        return "root.val"
    if head == Key:
        return "key"
    if head == BoolTrue:
        return "True"
    if head == BoolFalse:
        return "False"
    if head == IsLeaf:
        return "root is None"
    if head == IntLessThan:
        return show(exp[1]) + " < " + show(exp[2])
    if head == IntEqual:
        return show(exp[1]) + " == " + show(exp[2])

def enumerate_int():
    return [(RootVal,), (Key,)]

def enumerate_bool():
    return [(BoolTrue,), (BoolFalse,), (IsLeaf,)] \
        + [(IntLessThan, x, y) for x in enumerate_int() for y in enumerate_int()] \
        + [(IntEqual, x, y) for x in enumerate_int() for y in enumerate_int()]

# Evaluation

class InvalidExpression(Exception):
    pass

def eval_int(env, exp):
    if exp[0] == RootVal:
        if env["root"] == -1:
            raise InvalidExpression
        return env["root"]
    if exp[0] == Key:
        return env["key"]

def eval_bool(env, exp):
    if exp[0] == BoolTrue:
        return True
    if exp[0] == BoolFalse:
        return False
    if exp[0] == IsLeaf:
        return env["root"] == -1
    if exp[0] == IntLessThan:
        return eval_int(env, exp[1]) < eval_int(env, exp[2])
    if exp[0] == IntEqual:
        return eval_int(env, exp[1]) == eval_int(env, exp[2])

# Synthesis

def check(actions, traces, action, exp):
    try:
        positiveEnvs = [trace for trace in traces if trace["action"] == action]
        pos = all([eval_bool(env, exp) for env in positiveEnvs])

        negativeActions = actions[actions.index(action) + 1:]
        negativeEnvs = [trace for trace in traces if trace["action"] in negativeActions]
        neg = all([not eval_bool(env, exp) for env in negativeEnvs])

        return pos and neg

    except InvalidExpression:
        return False

def fill(actions, traces, action):
    for candidate in enumerate_bool():
        if check(actions, traces, action, candidate):
            return candidate
    return None

# Output

def fill_sketch(header, sketch, traces):
    actions = [branch[0] for branch in sketch]

    filling = { action: fill(actions, traces, action) for action in actions }

    if None in filling.values():
        return header + "    # Could not find code that satisfies your demonstrations.\n    # Try deleting some demonstrations and trying again.\n    return root"

    s = header
    for action in actions:
        if filling[action][0] == BoolTrue:
            return s + indent_lines(1, find(sketch, action))
        if filling[action][0] == BoolFalse:
            continue
        s += "    if " + show(filling[action]) + ":\n"
        s += indent_lines(2, find(sketch, action))
    return s

def fill_sketch_with_io(header, sketch):
    traces = flatten(json.loads(sys.stdin.read()))
    print(fill_sketch(header, sketch, traces), end="")
