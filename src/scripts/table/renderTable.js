import { generateColorsForHeaderRow } from "../helpers/colorMap";

const itemsPerPage = 6;
export function renderTable(data) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";
  let currentPage = parseInt(localStorage.getItem("currentPage"));
  const chartType = localStorage.getItem("chartType") || "bar";
  const effectiveItemsPerPage = chartType === "pie" ? 1 : itemsPerPage;

  const totalRows = data.length;

  const headerRow = data[0];
  const headerTr = document.createElement("tr");

  const tableData = data.map(row =>
    row.map((cell, colIndex) => {
      const isTextOnlyColumn = data.every(row => isNaN(row[colIndex]) || row[colIndex] === "");
      if (isTextOnlyColumn) {
        return "error-undefined";
      }
      return cell;
    })
  );
  const tableDataHeader = tableData[0].slice(1);
  generateColorsForHeaderRow(tableDataHeader);

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
