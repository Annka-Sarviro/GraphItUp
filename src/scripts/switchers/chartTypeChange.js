import { drawChart } from "../../chart/chart";
import { renderTable } from "../table/renderTable";

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
    localStorage.setItem("currentPage", 1);
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
      localStorage.setItem("currentPage", 1);
      associatedRadio.checked = true;
      chartType = associatedRadio.value;
      localStorage.setItem("chartType", chartType);

      drawChart(chartType);
      renderTable(data);
    }
  });
});
