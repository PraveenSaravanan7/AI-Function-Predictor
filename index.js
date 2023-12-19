let startTraining = false;

const ctx = document.getElementById("trainingChart").getContext("2d");
const ctx2 = document.getElementById("testingChart").getContext("2d");

const [xs, ys] = generateUnitCircleData(100);

drawCircleChart(ctx, xs, ys);
const testChart = drawCircleChart(ctx2);

const yCells = [];

xs.forEach((x, i) => {
  const row = table.insertRow(i + 1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  yCells.push(row.insertCell(2));

  cell1.innerHTML = x.join(",");
  cell2.innerHTML = ys[i].join(",");
});

const n = new MLP(1, [4, 2, 1]);

const test = () => {
  const [xs, ys] = generateUnitCircleData(20);

  const ypred = xs.map((x) => n.call(x));

  console.log(ypred);

  const chartData = getChartData(xs, ypred);

  console.log(chartData);

  testChart.data.datasets.forEach((dataset) => {
    dataset.data = chartData;
  });

  testChart.update();
};

const train = () => {
  if (!startTraining) return;
  test();

  const ypred = xs.map((x) => n.call(x));

  let loss = Value.of(0);

  for (let i = 0; i < ys.length; i++) {
    const actual = ys[i];
    const prediction = ypred[i];

    for (let j = 0; j < prediction.length; j++) {
      loss = loss.add(prediction[j].sub(actual[j]).pow(2));
    }

    // loss = loss.div(ypred.length);
  }

  n.zeroGrad();

  loss.backward();

  n.parameters().forEach((p) => (p.data += -learningRate.value * p.grad)); // Info: learningRate is html

  lossText.innerHTML = loss.data;
  yCells.forEach((cell, i) => {
    cell.innerHTML = ypred[i].map((y) => y.data).join(",");
  });

  requestAnimationFrame(train);

  return loss.data;
};

const onButtonPress = () => {
  startTraining = !startTraining;

  button.innerHTML = startTraining ? "Pause Training" : "Start Training";
  button.style.backgroundColor = startTraining ? "red" : "white";
  learningRate.disabled = startTraining;

  train();
};

// let l = train();

// var i = 4000;
// while (i-- && l > 0.5) l = train();
