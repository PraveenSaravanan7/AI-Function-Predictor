class Module {
  zeroGrad() {
    for (const p of this.parameters()) {
      p.grad = 0;
    }
  }

  parameters() {
    return [];
  }
}

class Neuron extends Module {
  constructor(nin, nonlin = true) {
    super();
    this.w = Array.from(
      { length: nin },
      () => new Value(Math.random() * 2 - 1)
    ); // Btw -1 & 1
    this.b = new Value(0);
    this.nonlin = nonlin;
  }

  call(x) {
    const activation = this.w
      .reduce((sum, wi, i) => sum.add(wi.mul(x[i])), new Value(0))
      .add(this.b);

    return this.nonlin ? activation.relu() : activation;
  }

  parameters() {
    return [...this.w, this.b];
  }

  toString() {
    return `[${this.nonlin ? "ReLU" : "Linear"}Neuron(${this.w.length})]`;
  }
}

class Layer extends Module {
  constructor(nin, nout, nonlin = true) {
    super();
    this.neurons = Array.from({ length: nout }, () => new Neuron(nin, nonlin));
  }

  call(x) {
    return this.neurons.map((neuron) => neuron.call(x));
  }

  parameters() {
    return this.neurons.reduce(
      (arr, neuron) => [...arr, ...neuron.parameters()],
      []
    );
  }

  toString() {
    return `Layer of [${this.neurons.map((n) => n.toString()).join(", ")}]`;
  }
}

class MLP extends Module {
  constructor(nin, nouts) {
    super();
    this.layersNumbers = [nin, ...nouts];
    this.layers = [];

    for (let i = 0; i < this.layersNumbers.length; i++) {
      this.layers.push(
        new Layer(
          nin,
          this.layersNumbers[i],
          i !== this.layersNumbers.length - 1
        )
      );

      nin = this.layersNumbers[i];
    }
  }

  call(x) {
    x = x.map((i) => new Value(i));

    for (const layer of this.layers) x = layer.call(x);

    return x;
  }

  parameters() {
    return this.layers.reduce(
      (arr, layer) => [...arr, ...layer.parameters()],
      []
    );
  }

  toString() {
    return `MLP of [${this.layers
      .map((layer) => layer.toString())
      .join(", ")}]`;
  }
}
