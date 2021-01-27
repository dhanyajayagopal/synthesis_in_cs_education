from z3 import *

"""
def search(root, key):
    if ??:
        return root.val
    if ??:
        return search(root.right, key)
    if ??:
        return search(root.left, key)
"""

# Grammar

operands = [
    "key",
    "root.val",
    "root",
    "None"
]

comparisons = [
    ("==", lambda x, y: x == y),
    (">", lambda x, y: x > y),
    (">=", lambda x, y: x >= y)
]

clauses = [
    ("and", And),
    ("or", Or)
]

# Z3 helpers

def choice(x, space, default):
    phi = default
    for i, value in enumerate(space):
        phi = If(x == i, value, phi)
    return phi

def every(conds):
    result = True
    for cond in conds:
        result = And(result, cond)
    return result

def none(conds):
    return every(map(Not, conds))

# Space creation

def base(env, space):
    return map(lambda x: env[x], space)

def app2(space, phi, psi):
    return map(lambda x: x[1](phi, psi), space)

# Formula creation

def operand(step, x):
    return choice(x, base(step, operands), 0)

def comparison(step, xs):
    return \
        choice(xs[0],
            app2(comparisons, operand(step, xs[1]), operand(step, xs[2])),
            True
        )

def clause(step, xs):
    return \
        choice(xs[0],
            app2(clauses, comparison(step, xs[1:4]), comparison(step, xs[4:7])),
            True
        )

# String output

def show_operand(model, x):
    i = model.eval(x).as_long()
    if i < 0 or i >= len(operands) or i < 0:
        return "0"
    return operands[model.eval(x).as_long()]

def show_comparison(model, xs):
    i = model.eval(xs[0]).as_long()
    if i < 0 or i >= len(comparisons):
        return "True"
    comparison = comparisons[i][0]
    op1 = show_operand(model, xs[1])
    op2 = show_operand(model, xs[2])
    return op1 + " " + comparison + " " + op2

def show_clause(model, xs):
    i = model.eval(xs[0]).as_long()
    if i < 0 or i >= len(clauses):
        return "True"
    clause = clauses[i][0]
    op1 = show_comparison(model, xs[1:4])
    op2 = show_comparison(model, xs[4:7])
    return op1 + " " + clause + " " + op2

# Solving

def predicates(func, pos_examples, neg_examples, xs):
    yes = every(map(lambda step: func(step, xs), pos_examples))
    no  = none (map(lambda step: func(step, xs), neg_examples))
    return And(yes, no)

def ints(n):
    return [Int("x_" + str(i)) for i in range(n)]

def try_one(pos_examples, neg_examples):
    s = Solver()
    xs = ints(3)
    s.add(predicates(comparison, pos_examples, neg_examples, xs))
    if s.check() == sat:
        print(predicates(comparison, pos_examples, neg_examples, xs))
        return show_comparison(s.model(), xs)

def try_two(pos_examples, neg_examples):
    s = Solver()
    xs = ints(7)
    s.add(predicates(clause, pos_examples, neg_examples, xs))
    if s.check() == sat:
        return show_clause(s.model(), xs)

# Main

def concat(xss):
    return [x for xs in xss for x in xs]

if_bodies = {
    "found": "return root",
    "right": "return search(root.right, key)",
    "left": "return search(root.left, key)"
}

must_negate = {
    "found": ["right", "left"],
    "right": ["left"],
    "left": []
}

def main(traces):
    trace = concat(traces)

    print("def search(root, key):")

    for action in if_bodies:
        pos_examples = \
            list(filter(lambda x: x["action"] == action, trace))
        neg_examples = \
            list(filter(lambda x: x["action"] in must_negate[action], trace))

        cond = try_one(pos_examples, neg_examples)

        if not cond:
            cond = try_two(pos_examples, neg_examples)

        if not cond:
            print("drat, didn't find a program")
            exit()

        print("    if " + cond + ":")
        print("        " + if_bodies[action])

# Traces

trace1 = [
    {"key": 7, "root.val": 8, "root": 1, "None": 0, "action": "left"},
    {"key": 7, "root.val": 3, "root": 1, "None": 0, "action": "right"},
    {"key": 7, "root.val": 6, "root": 1, "None": 0, "action": "right"},
    {"key": 7, "root.val": 7, "root": 1, "None": 0, "action": "found"},
]

trace2 = [
    {"key": 9, "root.val": 8, "root": 1, "None": 0, "action": "right"},
    {"key": 9, "root.val": 0, "root": 0, "None": 0, "action": "found"}
]

main([trace1, trace2])