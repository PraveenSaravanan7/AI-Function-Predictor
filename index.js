let startTraining = false;

const xs = [
  [1, 2, 3],
  [1, 1, 1],
  [2, 2, 2],
  [3, 3, 3],
];

const ys = [6, 3, 6, 9]; // a = b + c + d;

const yCells = [];

xs.forEach((x, i) => {
  const row = table.insertRow(i + 1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  yCells.push(row.insertCell(2));

  cell1.innerHTML = x.join(",");
  cell2.innerHTML = ys[i];
});

const n = new MLP(3, [4, 4, 1]);

const train = () => {
  if (!startTraining) return;

  const ypred = xs.map((x) => n.call(x));

  let loss = Value.of(0);

  for (let i = 0; i < ys.length; i++)
    loss = loss.add(ypred[i].sub(ys[i]).pow(2));

  n.zeroGrad();

  loss.backward();

  n.parameters().forEach((p) => (p.data += -learningRate.value * p.grad)); // Info: learningRate is html

  lossText.innerHTML = loss.data;
  ypred.forEach((y, i) => {
    yCells[i].innerHTML = y.data;
  });

  requestAnimationFrame(train);

  return loss.data;
};

const onButtonPress = () => {
  startTraining = !startTraining;

  button.innerHTML = startTraining ? "Stop" : "Start";
  button.style.backgroundColor = startTraining ? "red" : "white";
  learningRate.disabled = startTraining;

  train();
};

// let l = train();

// var i = 4000;
// while (i-- && l > 0.5) l = train();
