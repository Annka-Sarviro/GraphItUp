function darkenColor(color, percent) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}
export function renderPieChart(values, labels, categories, colors, chartSVG, axisX, axisY, radius = 300) {
  // Convert values to integers and filter out empty or non-numeric strings
  const rawValues = values[0]
    .map(value => parseInt(value)) // Attempt to convert each value to an integer
    .filter(value => !isNaN(value) && value !== ""); // Only keep valid numbers

  const total = rawValues.reduce((a, b) => a + b, 0);

  if (total === 0) {
    console.error("Total is zero. Cannot render pie chart.");
    return;
  }

  let startAngle = 0;

  rawValues.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const x = chartSVG.clientWidth / 2;
    const y = chartSVG.clientHeight / 2;
    const x1 = x + radius * Math.cos(startAngle);
    const y1 = y + radius * Math.sin(startAngle);
    const x2 = x + radius * Math.cos(startAngle + sliceAngle);
    const y2 = y + radius * Math.sin(startAngle + sliceAngle);

    const pathData = `M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${sliceAngle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Adjust color if there are more than 5 slices
    let darkenPercent = 0;
    if (rawValues.length > 5) {
      darkenPercent = Math.floor(index / 5) * 10;
    }
    const fillColor = darkenColor(colors[index % colors.length], darkenPercent);

    path.setAttribute("d", pathData);
    path.setAttribute("fill", fillColor);
    path.setAttribute("data-category", categories[index]);
    chartSVG.appendChild(path);

    // Only render label if the value is non-zero
    if (value !== 0) {
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = x + (radius + 20) * Math.cos(midAngle);
      const labelY = y + (radius + 20) * Math.sin(midAngle);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", labelX);
      text.setAttribute("y", labelY);
      text.setAttribute("fill", "var(--text-color)");
      text.setAttribute("text-anchor", "middle");
      text.textContent = value;
      chartSVG.appendChild(text);
    }

    startAngle += sliceAngle;

    // Add axis labels at the bottom
    const axisXText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    axisXText.setAttribute("x", chartSVG.clientWidth / 2);
    axisXText.setAttribute("y", y + radius + 40);
    axisXText.setAttribute("fill", "var(--text-color)");
    axisXText.setAttribute("text-anchor", "middle");
    axisXText.textContent = `${labels[0]}  ${axisX}`;
    chartSVG.appendChild(axisXText);
  });
}
