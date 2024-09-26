function darkenColor(color, percent) {
  console.log(color);
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}
export function renderBarChart(dataset, labels, categories, colors, chartSVG, axisX, axisY) {
  const padding = 40;
  const chartWidth = chartSVG.clientWidth - 2 * padding;
  const chartHeight = chartSVG.clientHeight - 2 * padding;
  const totalPadding = padding + 60;
  const availableWidth = chartWidth - 60;
  const barWidth = (availableWidth / labels.length) * 0.8;

  const maxVal = Math.max(...dataset.flat().filter(value => !isNaN(value) && value !== "")); // Filter valid numbers

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
    horizontalLine.setAttribute("stroke", "var(--grey)");
    chartSVG.appendChild(horizontalLine);

    const labelValue = (i * gridSize).toFixed(0);
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", padding - 10);
    label.setAttribute("y", y + 5);
    label.setAttribute("fill", "var(--text-color)");
    label.textContent = labelValue;
    chartSVG.appendChild(label);
  }

  const categoryColorMap = categories.reduce((acc, category, index) => {
    acc[category] = colors[index % colors.length];
    return acc;
  }, {});

  dataset.forEach((yearData, yearIndex) => {
    let xOffset = totalPadding + yearIndex * (barWidth + yearGap);
    let cumulativeHeight = 0;

    const sortedData = yearData
      .map((value, index) => ({ value, category: categories[index] }))
      .filter(({ value }) => !isNaN(value) && value !== "") // Skip non-numeric and empty values
      .sort((a, b) => b.value - a.value);

    sortedData.forEach(({ value, category }, valueIndex) => {
      const barHeight = (value / maxVal) * chartHeight;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("data-category", category);
      const barColor = valueIndex >= 5 ? darkenColor(categoryColorMap[category], -20) : categoryColorMap[category];
      rect.setAttribute("x", xOffset);
      rect.setAttribute("y", padding + chartHeight - barHeight);
      rect.setAttribute("width", barWidth);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", barColor);
      chartSVG.appendChild(rect);

      cumulativeHeight += barHeight;
    });

    sortedData.forEach(({ value }, valueIndex) => {
      if (!isNaN(value) && value !== "") {
        // Ensure the value is numeric and not an empty string
        const barHeight = (value / maxVal) * chartHeight;
        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("x", xOffset + barWidth / 2);
        valueText.setAttribute("y", padding + chartHeight - barHeight - 5);
        valueText.setAttribute("fill", "#000");
        valueText.textContent = value.toFixed(0);
        valueText.setAttribute("text-anchor", "middle");
        chartSVG.appendChild(valueText);
      }
    });

    if (labels[yearIndex] !== "") {
      // Skip empty string labels
      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", xOffset + barWidth / 2);
      labelText.setAttribute("y", chartSVG.clientHeight - padding + 15);
      labelText.setAttribute("fill", "var(--text-color)");
      labelText.textContent = labels[yearIndex];
      labelText.setAttribute("text-anchor", "middle");
      chartSVG.appendChild(labelText);
    }
  });

  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", chartSVG.clientWidth / 2);
  xLabel.setAttribute("y", chartSVG.clientHeight - padding + 40);
  xLabel.setAttribute("fill", "var(--text-color)");
  xLabel.textContent = axisX;
  xLabel.setAttribute("text-anchor", "middle");
  chartSVG.appendChild(xLabel);
}
