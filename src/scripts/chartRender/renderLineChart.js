export function renderLineChart(values, labels, categories, chartSVG, axisX, axisY) {
  chartSVG.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("chartData")) || [];
  const headersRow = data[0].slice(1);
  const padding = 40;
  const chartWidth = chartSVG.clientWidth - 2 * padding;
  const chartHeight = chartSVG.clientHeight - 2 * padding;

  const maxVal = Math.max(...values.flat());

  const gridSize = parseInt(localStorage.getItem("gridSize")) || 10;
  const numberOfLines = Math.floor(maxVal / gridSize);

  const stepX = chartWidth / (values[0].length + 1);
  const stepY = chartHeight / maxVal;

  for (let i = 0; i <= numberOfLines; i++) {
    const y = padding + chartHeight - i * gridSize * stepY;

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

  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  values[0].forEach((_, index) => {
    const xPos = padding + stepX * (index + 1);

    const verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    verticalLine.setAttribute("x1", xPos);
    verticalLine.setAttribute("y1", padding);
    verticalLine.setAttribute("x2", xPos);
    verticalLine.setAttribute("y2", chartHeight + padding);
    verticalLine.setAttribute("stroke", "var(--grey)");
    gridGroup.appendChild(verticalLine);
  });
  chartSVG.insertBefore(gridGroup, chartSVG.firstChild);

  const transposedValues = values[0].map((_, colIndex) => values.map(row => row[colIndex]));
  transposedValues.forEach((series, seriesIndex) => {
    const storedColors = JSON.parse(localStorage.getItem("headerColors")) || {};
    const category = categories[seriesIndex];
    let lineColor = storedColors[category];
    let pathData = "";
    let started = false;

    series.forEach((value, index) => {
      console.log(value);
      if (value === undefined || value === null || isNaN(value) || !value) {
        started = false;
        return;
      }

      const xPos = padding + stepX * (index + 1);
      const yPos = padding + chartHeight - value * stepY;

      if (!started) {
        pathData += `M ${xPos} ${yPos} `;
        started = true;
      } else {
        pathData += `L ${xPos} ${yPos} `;
      }
    });

    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePath.setAttribute("d", pathData);
    linePath.setAttribute("stroke", lineColor);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke-width", "2");
    linePath.setAttribute("data-category", categories[seriesIndex]);
    chartSVG.appendChild(linePath);

    const hoverPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hoverPath.setAttribute("d", pathData);
    hoverPath.setAttribute("stroke", "transparent");
    hoverPath.setAttribute("fill", "none");
    hoverPath.setAttribute("stroke-width", "12");
    hoverPath.style.cursor = "pointer";
    chartSVG.appendChild(hoverPath);

    series.forEach((value = "", index) => {
      if (value) {
        const xPos = padding + stepX * (index + 1);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", xPos);
        text.setAttribute("y", padding + chartHeight - value * stepY - 10);
        text.setAttribute("fill", "var(--text-color)");
        text.setAttribute("text-anchor", "middle");
        text.textContent = value || "";
        text.classList.add("hover-text");
        chartSVG.appendChild(text);
      }
    });

    hoverPath.addEventListener("mouseover", function () {
      linePath.setAttribute("stroke-width", "4");
      const index = headersRow.indexOf(categories[seriesIndex]);
      const highlightRows = document.querySelectorAll("#dataTable tr.highlight");
      const rows = document.querySelectorAll("#dataTable tr");
      if (highlightRows.length > 0) {
        highlightRows.forEach(row => {
          const cell = row.querySelector(`td:nth-child(${index + 2})`);
          if (cell) {
            cell.classList.add("extra");
          }
        });
      } else {
        rows.forEach(row => {
          const cell = row.querySelector(`td:nth-child(${index + 2})`);
          if (cell) {
            cell.classList.add("extra");
          }
        });
      }
    });

    hoverPath.addEventListener("mouseout", function () {
      linePath.setAttribute("stroke-width", "2");
      const index = headersRow.indexOf(categories[seriesIndex]);
      if (values.length <= 6) {
        const rows = document.querySelectorAll("#dataTable tr");
        rows.forEach(row => {
          const cell = row.querySelector(`td:nth-child(${index + 2})`);
          if (cell) {
            cell.classList.remove("extra");
          }
        });
      }

      const rows = document.querySelectorAll("#dataTable .highlight");
      rows.forEach((row, rowIndex) => {
        if (rowIndex === index) {
          row.classList.remove("extra");
        }
      });
    });

    series.forEach((value, index) => {
      if (typeof value === "number" && !isNaN(value)) {
        const xPos = padding + stepX * (index + 1);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", xPos);
        circle.setAttribute("cy", padding + chartHeight - value * stepY);
        circle.setAttribute("r", 5);
        circle.setAttribute("fill", lineColor);
        circle.setAttribute("data-category", categories[seriesIndex]);
        chartSVG.appendChild(circle);
      }
    });
  });

  values[0].forEach((_, index) => {
    const xPos = padding + stepX * (index + 1);
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", xPos);
    labelText.setAttribute("y", chartSVG.clientHeight - padding + 15);
    labelText.setAttribute("fill", "var(--text-color)");
    labelText.textContent = labels[index];
    labelText.setAttribute("text-anchor", "middle");
    chartSVG.appendChild(labelText);
  });

  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", chartSVG.clientWidth / 2);
  xLabel.setAttribute("y", chartSVG.clientHeight - 10);
  xLabel.setAttribute("fill", "#000");
  xLabel.textContent = axisX;
  chartSVG.appendChild(xLabel);
}
