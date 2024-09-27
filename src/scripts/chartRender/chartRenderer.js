import { renderBarChart } from "./renderBarChart";
import { renderPieChart } from "./renderPieChart";
import { renderLineChart } from "./renderLineChart";

export function renderChart(type, values, labels, categories, chartSVG, axisX, axisY) {
  if (type === "bar") {
    renderBarChart(values, labels, categories, chartSVG, axisX, axisY);
  } else if (type === "pie") {
    renderPieChart(values, labels, categories, chartSVG, axisX, axisY);
  } else if (type === "line") {
    renderLineChart(values, labels, categories, chartSVG, axisX, axisY);
  } else {
    console.error("Unknown chart type");
  }
}
