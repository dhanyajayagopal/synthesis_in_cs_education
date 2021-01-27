from z3 import *
import sys

debug = False

# the actions the user took, and the state when they took them
trace = [
{"key": 7, "root_val": 8, "root": 1, "null": 0, "action": "left"},
{"key": 7, "root_val": 3, "root": 1, "null": 0, "action": "right"},
{"key": 7, "root_val": 6, "root": 1, "null": 0, "action": "right"},
{"key": 7, "root_val": 7, "root": 1, "null": 0, "action": "found"},
]

# ------------------------
# Z3 constraint building
# ------------------------

ints_to_operands = ["key", "root.val", "root", "None"] # for printing later
# build up Z3 constraints for figuring out which values from the trace Z3 uses for operands
def get_val_helper(operand, key, root_val, root, null):
	return  If(operand == 0,
				key,
			If(operand == 1,
				root_val,
			If(operand == 2,
				root,
			If(operand == 3,
				null,

				True))))

def get_val(operand, ts):
	# I know, I know, this is ugly.  But Z3 constrains our choices here
	return get_val_helper(operand, ts["key"], ts["root_val"], ts["root"], ts["null"])

ints_to_ops = ["==", ">", ">="] # for printing later
# build up Z3 constraints for figuring out which operators Z3 uses for comparisons
def add_comp(o1, op, o2, trace_step):
	o1_t = get_val(o1, trace_step)
	o2_t = get_val(o2, trace_step)
	return If(op == 0,
			(o1_t == o2_t),
		If(op == 1,
			# >,
			(o1_t > o2_t),
		If(op == 2,
			# >=
			(o1_t >= o2_t),

			True)))

ints_to_binops = ["and", "or"] # for printing later
# build up Z3 constraints for figuring out which binops Z3 uses if multiple comparisons
def add_binop(z3_ints, trace_step):
	o1 = add_comp(z3_ints[0], z3_ints[1], z3_ints[2], trace_step)
	o2 = add_comp(z3_ints[3], z3_ints[4], z3_ints[5], trace_step)
	op = z3_ints[6]
	return If(op == 0,
			And(o1, o2),
		If(op == 1,
			Or(o1, o2),
		True)) # if we don't use one of the chosen ops, just true

# ------------------------------------------------------------------------
# For turning Z3's output into a Python program we can print
# ------------------------------------------------------------------------

def get_operand_str(operand_index):
	if (operand_index >= len(ints_to_operands)):
		return "True"
	return ints_to_operands[operand_index]

def cond_str(o1, op, o2):
	if (op.as_long() >= len(ints_to_ops)):
		return "(True)" # remember that we said it's simply true if we don't use one of the chosen ops
	return "(" + get_operand_str(o1.as_long()) + ints_to_ops[op.as_long()] + get_operand_str(o2.as_long()) + ")"

def model_str(model, z3_ints):
	cond_str_1 = cond_str(model.eval(z3_ints[0]), model.eval(z3_ints[1]), model.eval(z3_ints[2]))
	cond_str_2 = cond_str(model.eval(z3_ints[3]), model.eval(z3_ints[4]), model.eval(z3_ints[5]))
	op_ind = model.eval(z3_ints[6]).as_long()
	return "("+(" ").join([cond_str_1, ints_to_binops[op_ind], cond_str_2])+")"

# ----------------------------------------------------------------------------
# try using just 1 condition, up it to 2 conditions if we can't make it work
# ----------------------------------------------------------------------------

def try_one_cond(pos_examples, neg_examples):
	"""
	let's generate bitvectors for:
	1 comparison operators, with two operands and one operator
	3 in total
	"""
	z3_ints = [Int('x_'+str(i)) for i in range(3)]
	matches_trace = True
	for i in range(len(pos_examples)):
		matches_trace = And(matches_trace, add_comp(z3_ints[0], z3_ints[1], z3_ints[2], pos_examples[i]))
	for i in range(len(neg_examples)):
		matches_trace = And(matches_trace, Not(add_comp(z3_ints[0], z3_ints[1], z3_ints[2], neg_examples[i])))
	if debug: print matches_trace

	s = Solver()
	s.add(matches_trace)
	satisfiable = s.check()
	if debug: print "satisfiable?", satisfiable
	if (satisfiable == sat):
		model = s.model()
		if debug: print model # print the model, just to visualize what's happening underneath
		# make a string for the program if we found one
		ms = cond_str(model.eval(z3_ints[0]), model.eval(z3_ints[1]), model.eval(z3_ints[2])) 
		return ms
	return None

def try_two_conds(pos_examples, neg_examples):
	"""
	let's generate bitvectors for:
	2 comparison operators, each with two operands and one operator
	one boolean operator to combine them
	7 in total
	"""
	z3_ints = [Int('x_'+str(i)) for i in range(7)]
	matches_trace = True
	for i in range(len(pos_examples)):
		matches_trace = And(matches_trace, add_binop(z3_ints, pos_examples[i]))
	for i in range(len(neg_examples)):
		matches_trace = And(matches_trace, Not(add_binop(z3_ints, neg_examples[i])))
	if debug: print matches_trace

	s = Solver()
	s.add(matches_trace)
	satisfiable = s.check()
	if debug: print "satisfiable?", satisfiable
	if (satisfiable == sat):
		model = s.model()
		if debug: print model # print the model, just to visualize what's happening underneath
		# make a string for the program if we found one
		return ms
	return None


# ----------------------------------------------------------------------------
# main func, and printing the synthesized program
# ----------------------------------------------------------------------------

action_to_if_body = {"found": "return root", "right": "return search(root.right, key)", "left": "return search(root.left, key)"}
action_to_actions_that_must_be_neg = {"found": ["right", "left"], "right": ["left"], "left": []}
"""
we'll use the line above to figure out negative examples for each condition
remember that by the time we get down to the last condition (left), we actually 
always want to take that action--we've already filtered out the finds and rights
"""
def main():
	print "def search(root, key):"
	for curr_action in action_to_if_body:
		"""
		Let's divide the user's trace according to the states that *should* lead us to
		take action curr_action and the states that shouldn't
		This gives us a set of positive examples (cases where the condition should
		evaluate to true) and a set of negative examples (cases where the condition
		should evaluate to false)
		"""
		pos_examples = filter(lambda x: x["action"] == curr_action, trace)
		neg_examples = filter(lambda x: x["action"] in action_to_actions_that_must_be_neg[curr_action], trace)
		cond = try_one_cond(pos_examples, neg_examples)
		if (not cond):
			cond = try_two_conds(pos_examples, neg_examples)
		if (not cond):
			print "drat, didn't find a program"
			exit()
		print "\tif" + cond + ":"
		print "\t\t" + action_to_if_body[curr_action]

main()