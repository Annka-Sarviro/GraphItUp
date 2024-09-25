export function renderLineChart(values, labels, chartSVG) {
  const maxVal = Math.max(...values);
  const stepX = chartSVG.clientWidth / (values.length - 1);
  const stepY = chartSVG.clientHeight / maxVal;

  let pathData = `M 0 ${chartSVG.clientHeight - values[0] * stepY}`;
  values.forEach((value, index) => {
    pathData += ` L ${index * stepX} ${chartSVG.clientHeight - value * stepY}`;
  });

  const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  linePath.setAttribute("d", pathData);
  linePath.setAttribute("stroke", "#4CAF50");
  linePath.setAttribute("fill", "none");
  chartSVG.appendChild(linePath);

  values.forEach((value, index) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", index * stepX);
    circle.setAttribute("cy", chartSVG.clientHeight - value * stepY);
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", "#4CAF50");
    chartSVG.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", index * stepX);
    text.setAttribute("y", chartSVG.clientHeight - value * stepY - 5);
    text.setAttribute("fill", "#000");
    text.textContent = value;
    chartSVG.appendChild(text);
  });

  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute("x", 10);
  yLabel.setAttribute("y", chartSVG.clientHeight / 2);
  yLabel.setAttribute("fill", "#000");
  yLabel.textContent = "Значення";
  chartSVG.appendChild(yLabel);

  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", chartSVG.clientWidth / 2);
  xLabel.setAttribute("y", chartSVG.clientHeight - 10);
  xLabel.setAttribute("fill", "#000");
  xLabel.textContent = "Мітки";
  chartSVG.appendChild(xLabel);
}
