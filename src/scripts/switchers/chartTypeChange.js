import { drawChart } from "../chart";
import { renderTable } from "../chart";

const data = JSON.parse(localStorage.getItem("chartData")) || [];
let chartType = localStorage.getItem("chartType");

if (!chartType) {
  chartType = "bar";
  localStorage.setItem("chartType", chartType);
}

const radioButtons = document.querySelectorAll('input[name="chartType"]');

radioButtons.forEach(radio => {
  if (radio.value === chartType) {
    radio.checked = true;
  }
});
radioButtons.forEach(radio => {
  radio.addEventListener("change", e => {
    chartType = e.target.value;
    localStorage.setItem("chartType", chartType);
    drawChart(chartType);
    renderTable(data);
  });
});

const labels = document.querySelectorAll(".type-wrapper label");

labels.forEach(label => {
  label.addEventListener("click", () => {
    const associatedRadio = document.getElementById(label.getAttribute("for"));

    if (associatedRadio) {
      associatedRadio.checked = true;
      chartType = associatedRadio.value;
      localStorage.setItem("chartType", chartType);

      drawChart(chartType);
      renderTable(data);
    }
  });
});
