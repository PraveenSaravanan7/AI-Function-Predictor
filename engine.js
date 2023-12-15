class Value {
  constructor(data, children = [], operation = "") {
    this.data = data;
    this.grad = 0;

    this._backward = () => {};
    this._children = new Set(children);
    this._operation = operation;
  }

  add(other) {
    other = other instanceof Value ? other : new Value(other);

    const output = new Value(this.data + other.data, [this, other], "+");

    output._backward = () => {
      this.grad += 1 * output.grad;
      other.grad += 1 * output.grad;
      // Info: output.grad is multiplied bcs of chain rule
      // Info: += is used because the value can be used more that once in the same equation
    };

    return output;
  }

  mul(other) {
    other = other instanceof Value ? other : new Value(other);

    const output = new Value(this.data * other.data, [this, other], "*");

    output._backward = () => {
      this.grad += other.data * output.grad;
      other.grad += this.data * output.grad;
    };

    return output;
  }

  pow(other) {
    const output = new Value(this.data ** other, [this], `**{${other}}`);

    output._backward = () => {
      this.grad += other * this.data ** (other - 1) * output.grad;
    };

    return output;
  }

  relu() {
    const output = new Value(this.data < 0 ? 0 : this.data, [this], "ReLU");

    return output;
  }

  backward() {
    const topo = [];
    const visited = new Set();

    const buildTopo = (v) => {
      if (!visited.has(v)) {
        visited.add(v);

        for (const child of v._children) {
          buildTopo(child);
        }

        topo.push(v);
      }
    };

    buildTopo(this);

    // Apply the chain rule to each child in reverse topological order
    this.grad = 1;

    for (const v of topo.reverse()) v._backward();
  }

  neg() {
    return this.mul(-1);
  }

  sub(other) {
    other = other instanceof Value ? other : new Value(other);

    return this.add(other.neg());
  }

  static of(...args) {
    return new Value(...args);
  }
}
