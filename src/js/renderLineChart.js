function darkenColor(color, percent) {
  console.log(color);
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}
export function renderLineChart(values, labels, categories, colors, chartSVG, axisX, axisY) {
  // Clear the previous chart contents
  chartSVG.innerHTML = "";

  const padding = 40;
  const chartWidth = chartSVG.clientWidth - 2 * padding;
  const chartHeight = chartSVG.clientHeight - 2 * padding;

  // Convert values to integers and filter out invalid or non-numeric entries
  const processedValues = values.map(series =>
    series.map(value => parseInt(value)).filter(value => !isNaN(value) && value !== "")
  );

  // Get the maximum value across all valid data points
  const maxVal = Math.max(...processedValues.flat());

  // Grid size and number of grid lines
  const gridSize = parseInt(localStorage.getItem("gridSize")) || 10;
  const numberOfLines = Math.floor(maxVal / gridSize);

  const stepX = chartWidth / (processedValues[0].length + 1); // Adjust the step to leave space at the start and end
  const stepY = chartHeight / maxVal; // Step size for y-axis

  // Draw grid lines (horizontal)
  for (let i = 0; i <= numberOfLines; i++) {
    const y = padding + chartHeight - i * gridSize * stepY;

    // Draw the grid line
    const horizontalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    horizontalLine.setAttribute("x1", padding);
    horizontalLine.setAttribute("y1", y);
    horizontalLine.setAttribute("x2", chartWidth + padding);
    horizontalLine.setAttribute("y2", y);
    horizontalLine.setAttribute("stroke", "var(--grey)");
    chartSVG.appendChild(horizontalLine);

    // Label for the grid line
    const labelValue = (i * gridSize).toFixed(0);
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", padding - 10);
    label.setAttribute("y", y + 5);
    label.setAttribute("fill", "var(--text-color)");
    label.textContent = labelValue;
    chartSVG.appendChild(label);
  }

  // Draw vertical grid lines and move them to the background
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  processedValues[0].forEach((_, index) => {
    const xPos = padding + stepX * (index + 1); // Start with an offset

    // Vertical grid line
    const verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    verticalLine.setAttribute("x1", xPos);
    verticalLine.setAttribute("y1", padding);
    verticalLine.setAttribute("x2", xPos);
    verticalLine.setAttribute("y2", chartHeight + padding);
    verticalLine.setAttribute("stroke", "var(--grey)");
    gridGroup.appendChild(verticalLine);
  });
  chartSVG.insertBefore(gridGroup, chartSVG.firstChild); // Move grid lines to the background

  // Iterate over each series (each sub-array in the processedValues array)
  processedValues.forEach((series, seriesIndex) => {
    // Darken color every 5 series
    let darkenPercent = Math.floor(seriesIndex / 5) * 10;
    const lineColor = darkenColor(colors[seriesIndex % colors.length], darkenPercent);

    // Create a path for the line chart of each series, starting from the first data point
    const xPosStart = padding + stepX * 1; // Position of the first data point
    let pathData = `M ${xPosStart} ${padding + chartHeight - series[0] * stepY}`; // Start at the first data point
    series.forEach((value, index) => {
      const xPos = padding + stepX * (index + 1); // Adjust the X position for each point
      pathData += ` L ${xPos} ${padding + chartHeight - value * stepY}`; // Draw the line to the next point
    });

    // Create the main line path
    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePath.setAttribute("d", pathData);
    linePath.setAttribute("stroke", lineColor); // Assign the color with darken logic
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke-width", "2"); // Default stroke width
    chartSVG.appendChild(linePath);

    // Create a transparent, wider path for better hover detection
    const hoverPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hoverPath.setAttribute("d", pathData);
    hoverPath.setAttribute("stroke", "transparent");
    hoverPath.setAttribute("fill", "none");
    hoverPath.setAttribute("stroke-width", "12"); // Wider area to detect hover
    hoverPath.style.cursor = "pointer"; // Change cursor to pointer
    chartSVG.appendChild(hoverPath);

    // Add hover effect
    hoverPath.addEventListener("mouseover", function () {
      linePath.setAttribute("stroke-width", "4"); // Make the line thicker on hover

      // Show the values for this series
      series.forEach((value, index) => {
        if (value !== 0) {
          const xPos = padding + stepX * (index + 1);
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", xPos);
          text.setAttribute("y", padding + chartHeight - value * stepY - 5);
          text.setAttribute("fill", "#000");
          text.setAttribute("text-anchor", "middle");
          text.textContent = value;
          text.classList.add("hover-text"); // Add class for easy removal later
          chartSVG.appendChild(text);
        }
      });

      // Highlight corresponding row in the data table
      const rows = document.querySelectorAll("#dataTable .highlight");
      rows.forEach((row, rowIndex) => {
        if (rowIndex === seriesIndex) {
          row.classList.add("extra");
        }
      });
    });

    hoverPath.addEventListener("mouseout", function () {
      linePath.setAttribute("stroke-width", "2"); // Return to original thickness

      // Remove all hover texts
      const hoverTexts = chartSVG.querySelectorAll(".hover-text");
      hoverTexts.forEach(text => text.remove());

      // Remove highlight from the corresponding row in the data table
      const rows = document.querySelectorAll("#dataTable .highlight");
      rows.forEach((row, rowIndex) => {
        if (rowIndex === seriesIndex) {
          row.classList.remove("extra");
        }
      });
    });

    // Add circles at each point on the line (no text now)
    series.forEach((value, index) => {
      const xPos = padding + stepX * (index + 1);
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", xPos);
      circle.setAttribute("cy", padding + chartHeight - value * stepY);
      circle.setAttribute("r", 5);
      circle.setAttribute("fill", lineColor);
      chartSVG.appendChild(circle);
    });
  });

  // Add x-axis labels for each column (under each point)
  processedValues[0].forEach((_, index) => {
    const xPos = padding + stepX * (index + 1);
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", xPos);
    labelText.setAttribute("y", chartSVG.clientHeight - padding + 15);
    labelText.setAttribute("fill", "var(--text-color)");
    labelText.textContent = labels[index];
    labelText.setAttribute("text-anchor", "middle");
    chartSVG.appendChild(labelText);
  });

  // Add x-axis label
  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", chartSVG.clientWidth / 2);
  xLabel.setAttribute("y", chartSVG.clientHeight - 10);
  xLabel.setAttribute("fill", "#000");
  xLabel.textContent = axisX;
  chartSVG.appendChild(xLabel);
}
