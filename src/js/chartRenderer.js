import { renderBarChart } from "./renderBarChart";
import { renderPieChart } from "./renderPieChart";
import { renderLineChart } from "./renderLineChart";

export function renderChart(type, values, labels, categories, colors, chartSVG, axisX, axisY) {
  if (type === "bar") {
    renderBarChart(values, labels, categories, colors, chartSVG, axisX, axisY);
  } else if (type === "pie") {
    renderPieChart(values, labels, colors, chartSVG);
  } else if (type === "line") {
    renderLineChart(values, labels, colors, chartSVG);
  } else {
    console.error("Unknown chart type");
  }
}
