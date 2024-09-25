export function renderBarChart(values, labels, colors, chartSVG) {
  const maxVal = Math.max(...values);
  const barWidth = chartSVG.clientWidth / values.length;

  values.forEach((value, index) => {
    const barHeight = (value / maxVal) * chartSVG.clientHeight;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", index * barWidth);
    rect.setAttribute("y", chartSVG.clientHeight - barHeight);
    rect.setAttribute("width", barWidth - 10);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", colors[index % colors.length]);
    chartSVG.appendChild(rect);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", index * barWidth + barWidth / 4);
    text.setAttribute("y", chartSVG.clientHeight - barHeight - 5);
    text.setAttribute("fill", "#000");
    text.textContent = labels[index];
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
