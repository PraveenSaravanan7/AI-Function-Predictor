let startTraining = false;

const ctx = document.getElementById("trainingChart").getContext("2d");
const ctx2 = document.getElementById("testingChart").getContext("2d");

const [xs, ys] = generateLineData(200);

drawExorChart(ctx, xs, ys);
const testChart = drawExorChart(ctx2);

const yCells = [];

xs.forEach((x, i) => {
  const row = table.insertRow(i + 1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  yCells.push(row.insertCell(2));

  cell1.innerHTML = x.join(",");
  cell2.innerHTML = ys[i].join(",");
});

const n = new MLP(2, [4, 2, 1]);

const test = () => {
  const [xs, ys] = generateLineData(100);

  const ypred = xs.map((x) => n.call(x));

  const chartData = getChartDataForExor(xs, ypred);

  testChart.data.datasets.forEach((dataset) => {
    dataset.data = chartData;
    dataset.backgroundColor = ypred.map(([y]) => {
      const alpha = Math.abs(y.data);

      return y.data < 0
        ? `rgba(192, 75, 95, ${alpha})`
        : `rgba(75, 192, 192, ${alpha})`;
    });
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
