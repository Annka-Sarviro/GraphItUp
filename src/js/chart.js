import { renderChart } from "./chartRenderer";
import { renderLegend } from "./renderLegend";
const loader = document.getElementById("chartLoader");
const chartSVGWrapper = document.querySelector(".chartSVG-wrapper");

function showLoader() {
  loader.style.display = "block";
  chartSVGWrapper.classList.add("blurred");
}

function hideLoader() {
  loader.style.display = "none";
  chartSVGWrapper.classList.remove("blurred");
}

let chartType = "bar";
const itemsPerPage = 6;
let currentPage = 1;

const data = JSON.parse(localStorage.getItem("chartData")) || [];

document.getElementById("drawChart").addEventListener("click", () => {
  renderTable(data);
  localStorage.setItem("chartType", chartType);
  currentPage = 1;
  drawChart(chartType, currentPage);
  changePage(0);
});

function renderTable(data, currentPage = 1) {
  localStorage.setItem("chartType", chartType);
  const effectiveItemsPerPage = chartType === "pie" ? 1 : itemsPerPage;
  const table = document.getElementById("dataTable");
  table.innerHTML = "";

  const totalRows = data.length;

  const headerRow = data[0];
  const headerTr = document.createElement("tr");

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

    row.forEach(cell => {
      const cellElement = document.createElement("td");
      cellElement.textContent = cell;
      tr.appendChild(cellElement); // Append cells to the current row
    });
    table.appendChild(tr); // Append the current row to the table
  }
}
document.getElementById("drawChart").addEventListener("click", () => {
  renderTable(data, currentPage);
  localStorage.setItem("chartType", chartType);
  currentPage = 1;
  drawChart(chartType, currentPage);
});

export function drawChart(type, currentPage = 1) {
  showLoader();
  const effectiveItemsPerPage = type === "pie" ? 1 : itemsPerPage;
  const startIndex = (currentPage - 1) * effectiveItemsPerPage + 1;
  const paginatedData = data.slice(startIndex, startIndex + effectiveItemsPerPage);

  const axisX = data.slice(0)[0][0];
  const axisY = paginatedData.length > 0 ? paginatedData[0][1] : "";
  const categories = data[0].slice(1).map(category => (category === "" ? "" : category));
  const labels = paginatedData.map(row => row[0]);

  const values = paginatedData.map(row => row.slice(1));

  const oneColor = getComputedStyle(document.body).getPropertyValue("--one-color").trim();
  const twoColor = getComputedStyle(document.body).getPropertyValue("--two-color").trim();
  const threeColor = getComputedStyle(document.body).getPropertyValue("--three-color").trim();
  const fourColor = getComputedStyle(document.body).getPropertyValue("--four-color").trim();
  const fiveColor = getComputedStyle(document.body).getPropertyValue("--five-color").trim();

  const colors = [oneColor, twoColor, threeColor, fourColor, fiveColor];

  setTimeout(() => {
    chartSVG.innerHTML = "";

    renderChart(type, values, labels, categories, colors, chartSVG, axisX, axisY);
    renderLegend(categories, colors, axisY, labels);

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
  localStorage.setItem("chartType", chartType);
  const effectiveItemsPerPage = chartType === "pie" ? 1 : itemsPerPage;
  const totalPages = chartType === "pie" ? data.length - 1 : Math.ceil(data.length / effectiveItemsPerPage);
  currentPage += direction;

  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  drawChart(chartType, currentPage);
  renderTable(data, currentPage);
  document.getElementById("pageInfo").innerText = `${currentPage} з ${totalPages}`;
}

document.getElementById("prevBtn").addEventListener("click", () => changePage(-1));
document.getElementById("nextBtn").addEventListener("click", () => changePage(1));

document.getElementById("drawChart").addEventListener("click", () => {
  renderTable(data);
  localStorage.setItem("chartType", chartType);
  currentPage = 1;
  drawChart(chartType, currentPage);
});
const radioButtons = document.querySelectorAll('input[name="chartType"]');

radioButtons.forEach(radio => {
  radio.addEventListener("change", e => {
    chartType = e.target.value;
  });
});

document.getElementById("drawChart").addEventListener("click", () => {
  renderTable(data);
  localStorage.setItem("chartType", chartType);
  drawChart(chartType, currentPage);
});

renderTable(data);
drawChart(chartType, currentPage);
