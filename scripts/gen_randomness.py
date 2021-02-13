from random import randint, choice

def get_in(xs):
    if xs == []:
        return None
    else:
        return choice(xs)

def get_out(xs):
    if xs == []:
        return randint(0, 100)
    else:
        candidate = xs[0]
        while candidate in xs:
            candidate = randint(0, 100)
        return candidate

print("randomness = [")
for _ in range(1000):
    xs = [ randint(0, 100) for _ in range(randint(0, 20)) ]
    x_in = get_in(xs)
    x_out = get_out(xs)
    print("  (", xs, ",", x_in, ",", x_out, "),")
print("]")
