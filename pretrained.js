const pn = new MLP(3, [4, 4, 1]);

pn.parameters().forEach((p, i) => {
  p.data = check_point_00001[i].data;
  p.grad = check_point_00001[i].grad;
});

const xs1 = [
  [1, 2, 2],
  [2, 2, 3],
  [1, 3, 3],
];

const ys1 = [5, 7, 7]; // a = b + c + d;

xs1.forEach((x, i) => {
  const row = pretrainedTable.insertRow(i + 1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);

  cell1.innerHTML = x.join(",");
  cell2.innerHTML = ys1[i];
  cell3.innerHTML = pn.call(x).data;
});
