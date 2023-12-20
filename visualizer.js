const lerp = (A, B, t) => A + (B - A) * t;

const getY = (containerWidth, boxWidth, numberOfBoxes, index) => {
  const totalWidthOfBoxes = boxWidth * numberOfBoxes;
  const spaceBetweenBoxes =
    (containerWidth - totalWidthOfBoxes) / (numberOfBoxes + 1);

  const boxPosition = (index + 1) * spaceBetweenBoxes + index * boxWidth;

  return boxPosition;
};

const drawNetwork = (ctx, network) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const margin = 50;
  const width = ctx.canvas.width - margin * 2;
  const height = ctx.canvas.height - margin * 2;

  const left = margin;
  const top = margin;
  const bottom = top + height;
  const right = left + width;

  const layerWidth = width / (network.layers.length - 1);

  const points = [];

  const circleRadius = 26;

  for (let i = 0; i < network.layers.length; i++) {
    const layer = network.layers[i].neurons;
    points[i] = [];

    for (let j = 0; j < layer.length; j++) {
      const x = left + i * layerWidth;
      const y = top + j * 84;

      points[i].push([x, y]);

      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  for (let i = points.length - 1; i > 0; i--) {
    const outputs = points[i];
    const inputs = points[i - 1];

    for (let x = 0; x < outputs.length; x++) {
      for (let y = 0; y < inputs.length; y++) {
        const a = outputs[x];
        const b = inputs[y];
        const w = network.layers[i].neurons[x].w[y].data;
        const alpha = 0.2 + Math.abs(w);

        ctx.beginPath();
        ctx.moveTo(a[0] - circleRadius, a[1]);
        ctx.lineTo(b[0] + circleRadius, b[1]);
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.strokeStyle =
          w < 0
            ? `rgba(192, 75, 95, ${alpha})`
            : `rgba(75, 192, 192, ${alpha})`;
        ctx.stroke();
      }
    }
  }
};
