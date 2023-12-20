function getRandomNumber(min, max, isInteger = false) {
  const randomNumber = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(randomNumber) : randomNumber;
}

function isPointInsideCircle(cx, cy, radius, px, py) {
  const distance = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)); // dis between 2 points

  return distance <= radius;
}

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

function generateGaussianData(numPoints, noiseFactor = 0.1) {
  const xs = [];
  const ys = [];

  for (let i = 0; i < numPoints; i++) {
    const x1 = getRandomNumber(-5, 5);
    const x2 = getRandomNumber(-5, 5);

    let y = isPointInsideCircle(-2.5, -2.5, 1.5, x1, x2)
      ? -1
      : isPointInsideCircle(2.5, 2.5, 1.5, x1, x2)
      ? 1
      : 0;

    xs.push([x1, x2]);
    ys.push([y]);
  }

  return [xs, ys];
}

function generateLineData(numPoints, noiseFactor = 0.1) {
  const xs = [];
  const ys = [];

  for (let i = 0; i < numPoints; i++) {
    const x1 = getRandomNumber(-5, 5);
    const x2 = getRandomNumber(-5, 5);

    let y = Math.abs(x1 - x2 * -1) < 0.5 ? 1 : 0;

    if (x1 < 0) y *= -1;

    xs.push([x1, x2]);
    ys.push([y]);
  }

  return [xs, ys];
}
