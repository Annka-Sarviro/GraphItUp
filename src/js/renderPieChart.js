export function renderPieChart(values, labels, colors, chartSVG) {
  let startAngle = 0;
  const total = values.reduce((a, b) => a + b, 0);

  values.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const radius = 150;
    const x = chartSVG.clientWidth / 2;
    const y = chartSVG.clientHeight / 2;
    const x1 = x + radius * Math.cos(startAngle);
    const y1 = y + radius * Math.sin(startAngle);
    const x2 = x + radius * Math.cos(startAngle + sliceAngle);
    const y2 = y + radius * Math.sin(startAngle + sliceAngle);

    const pathData = `M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${sliceAngle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", colors[index % 5]);
    chartSVG.appendChild(path);

    startAngle += sliceAngle;
  });

  let legendY = 20;
  labels.forEach((label, index) => {
    const legendRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    legendRect.setAttribute("x", 10);
    legendRect.setAttribute("y", legendY);
    legendRect.setAttribute("width", 15);
    legendRect.setAttribute("height", 15);
    legendRect.setAttribute("fill", ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5]);
    chartSVG.appendChild(legendRect);

    const legendText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    legendText.setAttribute("x", 30);
    legendText.setAttribute("y", legendY + 12);
    legendText.setAttribute("fill", "#000");
    legendText.textContent = label;
    chartSVG.appendChild(legendText);

    legendY += 20;
  });
}
