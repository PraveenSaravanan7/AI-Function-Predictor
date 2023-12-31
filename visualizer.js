const lerp = (A, B, t) => A + (B - A) * t;

const getY = (containerWidth, boxWidth, numberOfBoxes, index) => {
  const totalWidthOfBoxes = boxWidth * numberOfBoxes;
  const spaceBetweenBoxes =
    (containerWidth - totalWidthOfBoxes) / (numberOfBoxes + 1);

  const boxPosition = (index + 1) * spaceBetweenBoxes + index * boxWidth;

  return boxPosition;
};

const drawNeuron = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
};

const drawConnection = (ctx, start, end, weight, offset) => {
  const alpha = 0.2 + Math.abs(weight);

  ctx.beginPath();
  ctx.moveTo(start[0] + offset, start[1]);
  ctx.lineTo(end[0] - offset, end[1]);
  ctx.lineCap = "round";
  ctx.lineWidth = 4 * (0.5 + alpha);
  ctx.strokeStyle =
    weight < 0 ? `rgba(192, 75, 95, ${alpha})` : `rgba(75, 192, 192, ${alpha})`;
  ctx.stroke();
};

const drawNetwork = (ctx, network) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const margin = 100;
  const width = ctx.canvas.width - margin * 2;

  const left = margin;
  const top = margin;

  const layerWidth = width / (network.layers.length - 1);
  const circleRadius = 52;

  let prevPoints = [];
  let currentPoints = [];

  for (let i = 0; i < network.layers.length; i++) {
    const noOfNeurons = network.layers[i].neurons.length;

    for (let j = 0; j < noOfNeurons; j++) {
      const x = left + i * layerWidth;
      const y = top + j * circleRadius * 3;

      currentPoints.push([x, y]);

      drawNeuron(ctx, x, y, circleRadius, "black");

      if (i > 0) {
        for (let k = 0; k < prevPoints.length; k++) {
          const w = network.layers[i].neurons[j].w[k].data;

          drawConnection(ctx, prevPoints[k], [x, y], w, circleRadius);
        }
      }
    }

    prevPoints = currentPoints;
    currentPoints = [];
  }
};
