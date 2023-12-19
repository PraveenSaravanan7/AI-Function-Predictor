function getRandomNumber(min, max, isInteger = false) {
  const randomNumber = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(randomNumber) : randomNumber;
}

function generateUnitCircleData(numPoints, noiseFactor = 0.1) {
  const xs = [];
  const ys = [];

  for (let i = 0; i < numPoints; i++) {
    // const angle = (i / numPoints) * 2 * Math.PI;
    const angle = Math.random() * 2 * Math.PI;
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    const noisyX = x + (Math.random() - 0.5) * noiseFactor;
    const noisyY = y + (Math.random() - 0.5) * noiseFactor;

    xs.push([noisyX]);
    ys.push([noisyY]);
  }

  return [xs, ys];
}

const getChartData = (xs = [], ys = []) => {
  return xs.reduce((acc, x, i) => {
    acc.push({
      x: x[0],
      y: typeof ys[i][0] === "object" ? ys[i][0].data : ys[i][0],
    });
    return acc;
  }, []);
};

const drawCircleChart = (canvas, xs = [], ys = []) => {
  const unitCircleData = getChartData(xs, ys);

  return new Chart(canvas, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Circle",
          data: unitCircleData,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: -1.2,
          max: 1.2,
        },
        y: {
          type: "linear",
          position: "left",
          min: -1.2,
          max: 1.2,
        },
      },
    },
  });
};
