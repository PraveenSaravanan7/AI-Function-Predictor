const getChartData = (xs, ys) => {
  return xs.reduce((acc, x) => {
    acc.push({ x: x[0], y: x[1] });

    return acc;
  }, []);
};

const drawChart = (canvas, xs = [], ys = [], title = "") => {
  const chartData = getChartData(xs, ys);

  return new Chart(canvas, {
    type: "scatter",
    data: {
      datasets: [
        {
          data: chartData,
          backgroundColor: function (context) {
            const index = context.dataIndex;
            const value = ys[index]?.at(0);

            const alpha = Math.abs(value);

            return value < 0
              ? `rgba(192, 75, 95, ${alpha})`
              : `rgba(75, 192, 192, ${alpha})`;
          },
          pointRadius: 4,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: title,
        },
      },
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
