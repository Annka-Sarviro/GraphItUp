import { drawChart, renderTable } from "../../chart/chart";

const parsedata = JSON.parse(localStorage.getItem("chartData")) || [];
const data = parsedata.map(row =>
  row.filter((_, colIndex) => {
    return parsedata.some(row => !isNaN(row[colIndex]) && row[colIndex] !== "");
  })
);
const paletteBtn = document.getElementById("palette-btn");
const paletteDropdown = document.getElementById("palette-dropdown");

paletteBtn.addEventListener("click", function (event) {
  paletteDropdown.classList.toggle("hidden");
  event.stopPropagation();
});

document.querySelectorAll("#palette-dropdown li").forEach(function (item) {
  item.addEventListener("click", function () {
    paletteDropdown.classList.add("hidden");
  });
});

document.addEventListener("click", function (event) {
  if (!paletteDropdown.classList.contains("hidden") && !paletteBtn.contains(event.target)) {
    paletteDropdown.classList.add("hidden");
  }
});

document.querySelectorAll("#palette-dropdown li").forEach(function (item) {
  item.addEventListener("click", function () {
    document.querySelectorAll("#palette-dropdown .dropdown-item").forEach(function (el) {
      el.classList.remove("active");
    });

    this.classList.add("active");
    const selectedPalette = this.getAttribute("data-palette");
    document.body.className = document.body.className.replace(/\bpalette-\S+/g, "");
    document.body.classList.add(`palette-${selectedPalette}`);
    let chartType = localStorage.getItem("chartType");
    renderTable(data);
    drawChart(chartType);

    document.getElementById("palette-dropdown").classList.add("hidden");
  });
});
