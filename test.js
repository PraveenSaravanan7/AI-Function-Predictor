const n = new Neuron(2, false);

console.log(n);

const l = new Layer(2, 3, false);

console.log(l);

const mlp = new MLP(2, [3, 1]);

console.log(mlp);

a = Value.of(1);
b = Value.of(2);
c = a.mul(b);
d = Value.of(5);
e = c.add(d);

console.log(e);

// e = c * d;
// e = (a + b) * d;
// e = (1 + 2) * 5;

// del of d = 3
// del of c = 5
// del of b = 1 x 5 = 5
// del of a =
