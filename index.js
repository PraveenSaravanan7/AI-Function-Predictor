// a = b + c + d;

const xs = [
  [1, 2, 3],
  [1, 1, 1],
  [2, 2, 2],
  [3, 3, 3],
];

const ys = [6, 3, 6, 9];

const n = new MLP(3, [4, 4, 1]);

const train = () => {
  const ypred = xs.map((x) => n.call(x));

  let loss = Value.of(0);

  for (let i = 0; i < ys.length; i++)
    loss = loss.add(ypred[i].sub(ys[i]).pow(2));

  n.zeroGrad();

  loss.backward();

  n.parameters().forEach((p) => (p.data += -0.005 * p.grad));

  ypred.forEach((y) => console.log(y.data));
  console.log("%c" + loss.data, "color: red");
  console.log(i);

  return loss.data;
};

let l = train();

var i = 4000;
while (i-- && l > 0.5) l = train();
