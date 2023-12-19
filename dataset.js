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

function generateExorData(numPoints, noiseFactor = 0.1) {
  const xs = [];
  const ys = [];

  for (let i = 0; i < numPoints; i++) {
    const x1 = getRandomNumber(-5, 5);
    const x2 = getRandomNumber(-5, 5);

    let y = 1;

    if (x1 < 0) y *= -1;
    if (x2 < 0) y *= -1;

    xs.push([x1, x2]);
    ys.push([y]);
  }

  return [xs, ys];
}

const getChartDataForExor = (xs, ys) => {
  return xs.reduce((acc, x) => {
    acc.push({ x: x[0], y: x[1] });

    return acc;
  }, []);
};

const drawExorChart = (canvas, xs = [], ys = []) => {
  const chartData = getChartDataForExor(xs, ys);

  return new Chart(canvas, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Exor",
          data: chartData,
          backgroundColor: function (context) {
            const index = context.dataIndex;
            const value = ys[index]?.at(0);

            return value < 0 ? "rgba(192, 75, 95, 1)" : "rgba(75, 192, 192, 1)";
          },
          pointRadius: 4,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: -6,
          max: 6,
        },
        y: {
          type: "linear",
          position: "left",
          min: -6,
          max: 6,
        },
      },
    },
  });
};

function isPointInsideCircle(cx, cy, radius, px, py) {
  const distance = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)); // dis between 2 points

  return distance <= radius;
}

function generateCircleData(numPoints, noiseFactor = 0.1) {
  const xs = [];
  const ys = [];

  for (let i = 0; i < numPoints; i++) {
    const x1 = getRandomNumber(-5, 5);
    const x2 = getRandomNumber(-5, 5);

    let y = isPointInsideCircle(0, 0, 2.5, x1, x2) ? -1 : 1;

    xs.push([x1, x2]);
    ys.push([y]);
  }

  return [xs, ys];
}
