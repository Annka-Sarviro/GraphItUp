import { renderChart } from "../scripts/chartRender/chartRenderer";
import { renderLegend } from "../scripts/chartRender/renderLegend";
import { cleanData } from "../scripts/helpers/cleanData";
import { generateColorsForHeaderRow } from "../scripts/helpers/colorMap";

const loader = document.getElementById("chartLoader");
const chartSVGWrapper = document.querySelector(".chartSVG-wrapper");

let currentPage = parseInt(localStorage.getItem("currentPage"));
let chartType = localStorage.getItem("chartType");
const itemsPerPage = 6;
const parsedata = JSON.parse(localStorage.getItem("chartData")) || [];
const data = parsedata.map(row =>
  row.filter((_, colIndex) => {
    return parsedata.some(row => !isNaN(row[colIndex]) && row[colIndex] !== "");
  })
);

if (!currentPage) {
  currentPage = 1;
  localStorage.setItem("currentPage", currentPage);
}

function showLoader() {
  loader.style.display = "block";
  chartSVGWrapper.classList.add("blurred");
}

function hideLoader() {
  loader.style.display = "none";
  chartSVGWrapper.classList.remove("blurred");
}

export function renderTable(data) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";
  let currentPage = parseInt(localStorage.getItem("currentPage"));
  const chartType = localStorage.getItem("chartType") || "bar";
  const effectiveItemsPerPage = chartType === "pie" ? 1 : itemsPerPage;

  const totalRows = data.length;

  const headerRow = data[0];
  const headerTr = document.createElement("tr");
  const categoriesRow = headerRow.slice(1);
  generateColorsForHeaderRow(categoriesRow);

  headerRow.forEach(cell => {
    const headerCell = document.createElement("th");
    headerCell.textContent = cell;
    headerTr.appendChild(headerCell);
  });
  table.appendChild(headerTr);

  const startIndex = (currentPage - 1) * effectiveItemsPerPage + 1;
  const endIndex = startIndex + effectiveItemsPerPage;

  for (let i = 1; i < totalRows; i++) {
    const row = data[i];

    const tr = document.createElement("tr");

    const isCurrentPageRow = i >= startIndex && i < endIndex;

    if (isCurrentPageRow && totalRows > effectiveItemsPerPage) {
      tr.classList.add("highlight");
    }

    row.forEach((cell, ind) => {
      const cellElement = document.createElement("td");
      cellElement.textContent = cell;
      cellElement.setAttribute("data-X", row[0]);
      cellElement.setAttribute("data-Y", headerRow[ind]);
      tr.appendChild(cellElement);
    });
    table.appendChild(tr);
  }
}

export function drawChart() {
  const type = localStorage.getItem("chartType");
  let currentPage = parseInt(localStorage.getItem("currentPage"));
  showLoader();
  const effectiveItemsPerPage = type === "pie" ? 1 : itemsPerPage;
  const startIndex = (currentPage - 1) * effectiveItemsPerPage + 1;
  const paginatedData = data.slice(startIndex, startIndex + effectiveItemsPerPage);

  const axisX = data.slice(0)[0][0];
  const axisY = paginatedData.length > 0 ? paginatedData[0][1] : "";

  const cleanedData = cleanData(data);
  const categories = cleanedData[0].slice(1).map(category => (category === "" ? "" : category));
  const labels = paginatedData.map(row => row[0]);

  const values = paginatedData.map(row => row.slice(1));

  setTimeout(() => {
    chartSVG.innerHTML = "";

    renderChart(type, values, labels, categories, chartSVG, axisX, axisY);
    renderLegend(categories, axisY, type);

    hideLoader();
  }, 1500);

  const scaleWrapper = document.getElementById("scale-wrapper");
  if (type === "pie") {
    scaleWrapper.style.display = "none";
  } else {
    scaleWrapper.style.display = "flex";
  }

  const paginationContainer = document.getElementById("pagination");
  const totalPages = chartType === "pie" ? data.length - 1 : Math.ceil((data.length - 1) / effectiveItemsPerPage);
  if (totalPages > 1) {
    paginationContainer.style.display = "flex";
    document.getElementById("pageInfo").innerText = `${currentPage} з ${totalPages}`;
  } else {
    paginationContainer.style.display = "none";
  }
}

function changePage(direction) {
  let currentPage = parseInt(localStorage.getItem("currentPage"));
  const effectiveItemsPerPage = chartType === "pie" ? 1 : itemsPerPage;
  const totalPages = chartType === "pie" ? data.length - 1 : Math.ceil(data.length / effectiveItemsPerPage);
  const newPage = currentPage + direction;

  if (newPage < 1) {
    localStorage.setItem("currentPage", 1);
  } else if (newPage > totalPages) {
    localStorage.setItem("currentPage", totalPages);
  } else {
    localStorage.setItem("currentPage", newPage);
  }
  drawChart(chartType);
  renderTable(data);
  let page = localStorage.getItem("currentPage");
  document.getElementById("pageInfo").innerText = `${page} з ${totalPages}`;
}

const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");

if (!prevButton.dataset.eventAttached) {
  prevButton.addEventListener("click", event => {
    console.log("Prev button clicked");
    event.preventDefault();
    changePage(-1);
  });
  prevButton.dataset.eventAttached = true;
}

if (!nextButton.dataset.eventAttached) {
  nextButton.addEventListener("click", event => {
    console.log("Next button clicked");
    event.preventDefault();
    changePage(1);
  });
  nextButton.dataset.eventAttached = true;
}

renderTable(data);
drawChart(chartType);
