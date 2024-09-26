import { renderChart } from "./chartRenderer";
import { renderLegend } from "./renderLegend";

const chartSVG = document.getElementById("chartSVG");
let chartType = "bar";

const data = JSON.parse(localStorage.getItem("chartData")) || [];

function renderTable(data) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const cellElement = rowIndex === 0 ? document.createElement("th") : document.createElement("td");
      cellElement.textContent = cell;
      tr.appendChild(cellElement);
    });
    table.appendChild(tr);
  });
}

export function drawChart(type) {
  const axisX = data.slice(0).map(row => row[0])[0];
  const axisY = data.slice(0).map(row => row[1])[0];
  const categories = data[0].slice(1).map(category => (category === "" ? "" : category));
  const labels = data.slice(1).map(row => row[0]);

  // Replace text values in values with 0
  const values = data.slice(1).map(row => row.slice(1).map(value => (typeof value === "number" ? value : 0)));

  chartSVG.innerHTML = "";
  const oneColor = getComputedStyle(document.body).getPropertyValue("--one-color").trim();
  const twoColor = getComputedStyle(document.body).getPropertyValue("--two-color").trim();
  const threeColor = getComputedStyle(document.body).getPropertyValue("--three-color").trim();
  const fourColor = getComputedStyle(document.body).getPropertyValue("--four-color").trim();
  const fiveColor = getComputedStyle(document.body).getPropertyValue("--five-color").trim();

  const colors = [oneColor, twoColor, threeColor, fourColor, fiveColor];
  renderChart(type, values, labels, categories, colors, chartSVG, axisX, axisY);
  renderLegend(categories, colors, axisY);
}

const radioButtons = document.querySelectorAll('input[name="chartType"]');

radioButtons.forEach(radio => {
  radio.addEventListener("change", e => {
    chartType = e.target.value;
  });
});

document.getElementById("drawChart").addEventListener("click", () => {
  renderTable(data);
  localStorage.setItem("chartType", chartType);
  drawChart(chartType);
});

renderTable(data);
drawChart(chartType);
