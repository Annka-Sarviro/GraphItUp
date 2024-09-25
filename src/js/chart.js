import { renderChart } from "./chartRenderer";

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
  const labels = data.slice(1).map(row => row[0]);
  const values = data.slice(1).map(row => row[1]);

  chartSVG.innerHTML = "";
  const oneColor = getComputedStyle(document.body).getPropertyValue("--one-color").trim();
  const twoColor = getComputedStyle(document.body).getPropertyValue("--two-color").trim();
  const threeColor = getComputedStyle(document.body).getPropertyValue("--three-color").trim();
  const fourColor = getComputedStyle(document.body).getPropertyValue("--four-color").trim();
  const fiveColor = getComputedStyle(document.body).getPropertyValue("--five-color").trim();

  const colors = [oneColor, twoColor, threeColor, fourColor, fiveColor];
  renderChart(type, values, labels, colors, chartSVG);
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
