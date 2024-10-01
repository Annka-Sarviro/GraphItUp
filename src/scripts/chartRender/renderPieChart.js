import { highlightCategory } from "../helpers/highlightCategory";
import { highlightLegend } from "../helpers/highlightLegend";

export function renderPieChart(values, labels, categories, chartSVG, axisX, axisY, radius = 300) {
  const rawValues = values[0].map(value => parseInt(value)).filter(value => !isNaN(value) && value !== "");

  const total = rawValues.reduce((a, b) => a + b, 0);

  if (total === 0) {
    console.error("Total is zero. Cannot render pie chart.");
    return;
  }

  let startAngle = 0;

  values[0].forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const x = chartSVG.clientWidth / 2;
    const y = chartSVG.clientHeight / 2;
    const x1 = x + radius * Math.cos(startAngle);
    const y1 = y + radius * Math.sin(startAngle);
    const x2 = x + radius * Math.cos(startAngle + sliceAngle);
    const y2 = y + radius * Math.sin(startAngle + sliceAngle);

    const pathData = `M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${sliceAngle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    const storedColors = JSON.parse(localStorage.getItem("headerColors")) || {};
    const category = categories[index];
    let fillColor = storedColors[category];

    path.setAttribute("d", pathData);
    path.setAttribute("fill", fillColor);
    path.setAttribute("data-category", categories[index]);
    path.setAttribute("data-year", labels[0]);

    path.addEventListener("mouseenter", () => {
      highlightCategory(path, true);
      const category = path.getAttribute("data-category");
      highlightLegend(category, true, "pie");
    });

    path.addEventListener("mouseleave", () => {
      highlightCategory(path, false);
      const category = path.getAttribute("data-category");
      highlightLegend(category, false, "pie");
    });
    chartSVG.appendChild(path);

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

    const axisXText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    axisXText.setAttribute("x", chartSVG.clientWidth / 2);
    axisXText.setAttribute("y", y + radius + 40);
    axisXText.setAttribute("fill", "var(--text-color)");
    axisXText.setAttribute("text-anchor", "middle");
    axisXText.textContent = `${labels[0]}  ${axisX}`;
    chartSVG.appendChild(axisXText);
  });
}
