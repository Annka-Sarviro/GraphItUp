function darkenColor(color, percent) {
  console.log(color);
  const num = parseInt(color.slice(1), 16); // Convert hex to number
  const amt = Math.round(2.55 * percent); // Calculate amount to darken
  const R = (num >> 16) + amt; // Get red
  const G = ((num >> 8) & 0x00ff) + amt; // Get green
  const B = (num & 0x0000ff) + amt; // Get blue

  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}

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

  // Create a mapping of categories to colors
  const categoryColorMap = categories.reduce((acc, category, index) => {
    acc[category] = colors[index % colors.length];
    return acc;
  }, {});

  dataset.forEach((yearData, yearIndex) => {
    let xOffset = totalPadding + yearIndex * (barWidth + yearGap);
    let cumulativeHeight = 0;

    // Pair category with value and sort
    const sortedData = yearData
      .map((value, index) => ({ value, category: categories[index] }))
      .sort((a, b) => b.value - a.value);

    sortedData.forEach(({ value, category }, valueIndex) => {
      const barHeight = (value / maxVal) * chartHeight;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("data-category", category);
      const barColor =
        valueIndex >= 5
          ? darkenColor(categoryColorMap[category], -20) // Darken by 20%
          : categoryColorMap[category];
      rect.setAttribute("x", xOffset);
      rect.setAttribute("y", padding + chartHeight - barHeight);
      rect.setAttribute("width", barWidth);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", barColor); // Use color from mapping
      chartSVG.appendChild(rect);

      cumulativeHeight += barHeight;
    });

    // Add value labels above bars
    sortedData.forEach(({ value, category }, valueIndex) => {
      const barHeight = (value / maxVal) * chartHeight;
      const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valueText.setAttribute("x", xOffset + barWidth / 2);
      valueText.setAttribute("y", padding + chartHeight - barHeight - 5);
      valueText.setAttribute("fill", "#000");
      valueText.textContent = value.toFixed(0);
      valueText.setAttribute("text-anchor", "middle");
      chartSVG.appendChild(valueText);
    });

    // Label for each year
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", xOffset + barWidth / 2);
    labelText.setAttribute("y", chartSVG.clientHeight - padding + 15);
    labelText.setAttribute("fill", "#000");
    labelText.textContent = labels[yearIndex];
    labelText.setAttribute("text-anchor", "middle");
    chartSVG.appendChild(labelText);
  });

  // X-axis label
  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", chartSVG.clientWidth / 2);
  xLabel.setAttribute("y", chartSVG.clientHeight - padding + 40);
  xLabel.setAttribute("fill", "#000");
  xLabel.textContent = axisX;
  xLabel.setAttribute("text-anchor", "middle");
  chartSVG.appendChild(xLabel);
}
