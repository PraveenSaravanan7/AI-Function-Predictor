const DATASET_TYPES = Object.freeze({
  EXOR: "EXOR",
  CIRCLE: "CIRCLE",
  GAUSSIAN: "GAUSSIAN",
  LINE: "LINE",
});

let neuralNetwork = new MLP(2, [4, 2, 1]);
let trainingChart;
let generateData;
let xs = [];
let ys = []; // Info: Training data
let startTraining = false;
let epoch = 0;
const testingChart = drawChart(
  testingChartCtx,
  xs,
  ys,
  "Prediction by the model"
);
const lossChart = drawLossChart(lossChartCtx);
let datasetType = DATASET_TYPES.EXOR;
const neuralNetworkCanvasCtx = neuralNetworkCtx.getContext("2d");

function formatNumberWithCommas(number, numberOfDigits = 6) {
  const formattedNumber = number.toLocaleString("en-US", {
    minimumIntegerDigits: numberOfDigits,
  });

  return formattedNumber.padStart(numberOfDigits, "0");
}

const drawTrainingChart = () => {
  trainingChart?.destroy();

  generateData = (() => {
    if (datasetType === DATASET_TYPES.EXOR) return generateExorData;
    if (datasetType === DATASET_TYPES.CIRCLE) return generateCircleData;
    if (datasetType === DATASET_TYPES.GAUSSIAN) return generateGaussianData;
    if (datasetType === DATASET_TYPES.LINE) return generateLineData;
  })();

  [xs, ys] = generateData(200);

  trainingChart = drawChart(trainingChartCtx, xs, ys, "Training dataset");
};

const onDatasetSelect = (element, type) => {
  for (let item of document.getElementsByClassName("chartType"))
    item.classList.remove("active");

  datasetType = type;
  element.classList.add("active");
  drawTrainingChart();
  reset();
};

const onPlayButtonPress = () => {
  startTraining = !startTraining;

  learningRate.disabled = startTraining;
  activationType.disabled = startTraining;

  playButton.classList.add(startTraining ? "pause" : "play");
  playButton.classList.remove(startTraining ? "play" : "pause");

  if (startTraining) train();
};

const test = () => {
  const [xs, ys] = generateData(200);

  const yPred = xs.map((x) => neuralNetwork.call(x));

  const chartData = getChartData(xs, yPred);

  testingChart.data.datasets.forEach((dataset) => {
    dataset.data = chartData;
    dataset.backgroundColor = yPred.map(([y]) => {
      const alpha = Math.abs(y.data);

      return y.data < 0
        ? `rgba(192, 75, 95, ${alpha})`
        : `rgba(75, 192, 192, ${alpha})`;
    });
  });

  testingChart.update();

  let loss = 0;

  for (let j = 0; j < yPred.length; j++)
    loss += (yPred[j][0].data - ys[j][0]) ** 2;

  testingLossText.innerHTML = loss;

  lossChart.data.datasets[1].data.push(loss);
  lossChart.update();
};

const train = (forceOnce = false) => {
  if (!startTraining && !forceOnce) return;

  test();
  drawNetwork(neuralNetworkCanvasCtx, neuralNetwork);

  const yPred = xs.map((x) => neuralNetwork.call(x));

  let loss = Value.of(0);

  for (let i = 0; i < ys.length; i++) {
    const actual = ys[i];
    const prediction = yPred[i];

    for (let j = 0; j < prediction.length; j++)
      loss = loss.add(prediction[j].sub(actual[j]).pow(2));

    // loss = loss.div(yPred.length); // Info: Since the loss is low
  }

  neuralNetwork.zeroGrad();

  loss.backward();

  neuralNetwork
    .parameters()
    .forEach((p) => (p.data += -learningRate.value * p.grad));

  epoch++;
  epochText.innerHTML = formatNumberWithCommas(epoch);
  trainingLossText.innerHTML = loss.data;

  lossChart.data.labels.push(epoch);
  lossChart.data.datasets[0].data.push(loss.data);
  lossChart.update();

  requestAnimationFrame(() => train());

  return loss.data;
};

const reset = () => {
  if (startTraining) onPlayButtonPress();

  testingChart.data.datasets.forEach((dataset) => (dataset.data = []));

  testingChart.update();

  neuralNetwork = new MLP(2, [4, 2, 1]);

  epoch = 0;
  epochText.innerHTML = formatNumberWithCommas(epoch);
  trainingLossText.innerHTML = 0;
  testingLossText.innerHTML = 0;

  lossChart.data.labels = [];
  lossChart.data.datasets.forEach((dataset) => (dataset.data = []));
  lossChart.update();

  drawNetwork(neuralNetworkCanvasCtx, neuralNetwork);
};

const refresh = () => {
  reset();
  drawTrainingChart();
};

drawNetwork(neuralNetworkCanvasCtx, neuralNetwork);
drawTrainingChart();
