const ValueOf = (...args) => new Value(...args);

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

    const output = ValueOf(this.data + other.data, [this, other], "+");

    output._backward = () => {
      this.grad += output.grad;
      other.grad += output.grad;
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
}
