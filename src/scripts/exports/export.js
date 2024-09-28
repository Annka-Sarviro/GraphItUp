import { exportPDF } from "./exportPDF";
import { exportPNG } from "./exportPNG";
import { exportSVG } from "./exportSVG";

const chartSVGContents = document.getElementById("chartSVG");
const tableElement = document.getElementById("dataTable");

document.getElementById("exportButton").addEventListener("click", () => {
  const format = document.getElementById("selectedFormat").innerText;

  if (format === "PNG") {
    exportPNG(chartSVGContents, "chart_table.png");
  } else if (format === "SVG") {
    exportSVG(chartSVGContents, "chart.svg");
  } else if (format === "PDF") {
    exportPDF(chartSVGContents, tableElement, "chart_table.pdf");
  } else {
    console.error("Непідтримуваний формат: " + format);
  }
});

const customLabel = document.getElementById("customLabel");
const selectedFormat = document.getElementById("selectedFormat");
const selectOptions = document.getElementById("selectOptions");
const arrow = document.querySelector(".arrow");

customLabel.addEventListener("click", () => {
  selectOptions.classList.toggle("show");
  arrow.classList.toggle("rotate");
});

document.querySelectorAll("#selectOptions li").forEach(option => {
  option.addEventListener("click", function () {
    selectedFormat.textContent = this.getAttribute("data-value");
    arrow.classList.remove("rotate");
  });
});

document.addEventListener("click", function (event) {
  if (!customLabel.contains(event.target)) {
    arrow.classList.remove("rotate");
    selectOptions.classList.remove("show");
  }
});
