export function renderBarChart(dataset, labels, categories, colors, chartSVG, axisX, axisY) {
  const padding = 40;
  const chartWidth = chartSVG.clientWidth - 2 * padding;
  const chartHeight = chartSVG.clientHeight - 2 * padding;
  const totalPadding = padding + 60;
  const availableWidth = chartWidth - 60;
  const barWidth = (availableWidth / labels.length) * 0.8;

  const maxVal = Math.max(...dataset.flat());

  const yearGap = barWidth * 0.2;

  const gridSize = parseInt(localStorage.getItem("gridSize")) || 10;
  const numberOfLines = Math.floor(maxVal / gridSize);

  for (let i = 0; i <= numberOfLines; i++) {
    const y = padding + chartHeight - i * gridSize * (chartHeight / maxVal);
    const horizontalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    horizontalLine.setAttribute("x1", padding);
    horizontalLine.setAttribute("y1", y);
    horizontalLine.setAttribute("x2", chartWidth + padding);
    horizontalLine.setAttribute("y2", y);
    horizontalLine.setAttribute("stroke", "#e0e0e0");
    chartSVG.appendChild(horizontalLine);

    const labelValue = (i * gridSize).toFixed(0);
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", padding - 10);
    label.setAttribute("y", y + 5);
    label.setAttribute("fill", "#000");
    label.textContent = labelValue;
    chartSVG.appendChild(label);
  }

  // Loop over each year's data to draw stacked bars on top of each other
  dataset.forEach((yearData, yearIndex) => {
    let xOffset = totalPadding + yearIndex * (barWidth + yearGap);
    let cumulativeHeight = 0;
    yearData.sort((a, b) => b - a);
    yearData.forEach((value, valueIndex) => {
      const barHeight = (value / maxVal) * chartHeight;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

      rect.setAttribute("x", xOffset);
      rect.setAttribute("y", padding + chartHeight - barHeight);
      rect.setAttribute("width", barWidth);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", colors[valueIndex % colors.length]);
      chartSVG.appendChild(rect);

      cumulativeHeight += barHeight;
    });

    yearData.forEach((value, valueIndex) => {
      const barHeight = (value / maxVal) * chartHeight;
      const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valueText.setAttribute("x", xOffset + barWidth / 2);
      valueText.setAttribute("y", padding + chartHeight - barHeight - 5); // 5 пікселів над верхньою межею
      valueText.setAttribute("fill", "#000");
      valueText.textContent = value.toFixed(0);
      valueText.setAttribute("text-anchor", "middle");
      chartSVG.appendChild(valueText);
    });
    // yearData.forEach((value, valueIndex) => {
    //   const barHeight = (value / maxVal) * chartHeight;
    //   const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    //   rect.setAttribute("x", xOffset);
    //   rect.setAttribute("y", padding + chartHeight - barHeight);
    //   rect.setAttribute("width", barWidth);
    //   rect.setAttribute("height", barHeight);
    //   rect.setAttribute("fill", colors[valueIndex % colors.length]);
    //   chartSVG.appendChild(rect);

    //   cumulativeHeight += barHeight;

    //   // Label for each bar's value (inside the stacked bars)
    //   const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    //   valueText.setAttribute("x", xOffset + barWidth / 2);
    //   valueText.setAttribute("y", padding + chartHeight - cumulativeHeight - 10); // Підпис над верхньою межею
    //   valueText.setAttribute("fill", "#000");
    //   valueText.textContent = value.toFixed(0);
    //   valueText.setAttribute("text-anchor", "middle");
    //   chartSVG.appendChild(valueText);
    // });

    // Label for each year (below the bars)
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", xOffset + barWidth / 2);
    labelText.setAttribute("y", chartSVG.clientHeight - padding + 15);
    labelText.setAttribute("fill", "#000");
    labelText.textContent = labels[yearIndex];
    labelText.setAttribute("text-anchor", "middle");
    chartSVG.appendChild(labelText);
  });

  // Y-axis label
  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute("x", padding - 10);
  yLabel.setAttribute("y", padding + chartHeight / 2);
  yLabel.setAttribute("fill", "#000");
  yLabel.textContent = axisY;
  yLabel.setAttribute("text-anchor", "middle");
  yLabel.setAttribute("transform", `rotate(-90, ${padding - 20}, ${padding + chartHeight / 2})`);
  chartSVG.appendChild(yLabel);

  // X-axis label
  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", chartSVG.clientWidth / 2);
  xLabel.setAttribute("y", chartSVG.clientHeight - padding + 40);
  xLabel.setAttribute("fill", "#000");
  xLabel.textContent = axisX;
  xLabel.setAttribute("text-anchor", "middle");
  chartSVG.appendChild(xLabel);
}
