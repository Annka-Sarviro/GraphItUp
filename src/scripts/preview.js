import * as XLSX from "xlsx";
import { hasMultipleTables } from "./helpers/hasMultipleTables";

const openChartPageBtn = document.querySelector(".open-chart-page-btn");
const tabsContainer = document.getElementById("tabs");
const previewTitle = document.getElementById("preview-title");
const tabsTitle = document.getElementById("tabs-title");
const previewSelectCell = document.getElementById("preview-select-cell");

let selectedCells = [];

export function displayPreview(file, preview) {
  localStorage.setItem("selectedCells", []);
  localStorage.setItem("isMultipleTables", false);
  const fileType = file.type;
  preview.innerHTML = "";
  if (fileType === "text/csv") {
    handleCSVFile(file, preview);
  } else if (
    fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileType === "application/vnd.ms-excel"
  ) {
    handleXLSFile(file, preview);
  } else if (fileType === "application/json") {
    handleJSONFile(file, preview);
  } else {
    const fileInfo = document.createElement("div");
    fileInfo.textContent = `Невідомий файл: ${file.name}`;
    openChartPageBtn.classList.add("open-chart-page-btn-disabled");
    preview.appendChild(fileInfo);
  }
}

function handleCSVFile(file, preview) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.split("\n").map(row =>
      row.split(",").map(cell => {
        const trimmedCell = cell.trim();

        return !isNaN(trimmedCell) && trimmedCell !== "" ? Number(trimmedCell) : trimmedCell;
      })
    );

    const nonEmptyRows = rows.filter(row => row.some(cell => cell !== ""));
    if (nonEmptyRows.length === 0) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Немає даних для відображення.";
      openChartPageBtn.classList.add("open-chart-page-btn-disabled");
      preview.appendChild(errorMessage);
      return;
    }

    displayTable(nonEmptyRows, preview);
    localStorage.setItem("chartData", JSON.stringify(nonEmptyRows));
  };

  reader.readAsText(file);
}

function handleXLSFile(file, preview) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    tabsContainer.innerHTML = "";
    preview.innerHTML = "";

    const sheets = workbook.SheetNames;
    const sheetData = {};
    let selectedSheet = sheets[0];

    sheets.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

      const filledJson = json.map(row => row.map(cell => (cell === null || cell === undefined ? "" : cell)));
      const nonEmptyRows = filledJson.filter(row => row.some(cell => cell !== ""));
      const filteredData = removeEmptyColumns(nonEmptyRows);
      sheetData[sheetName] = filteredData;
    });

    localStorage.setItem("isMultipleTables", hasMultipleTables(sheetData[selectedSheet]));
    displayTable(sheetData[selectedSheet], preview);

    if (localStorage.getItem("isMultipleTables") === "true") {
      previewSelectCell.style.display = "block";
    } else {
      previewSelectCell.style.display = "none";
    }

    if (sheets.length > 1) {
      sheets.forEach(sheetName => {
        const tab = document.createElement("button");
        tab.innerText = sheetName;
        tab.classList.add("tab-button");
        tab.classList.add("button-tab");
        if (sheetName === selectedSheet) {
          tab.classList.add("active");
        }
        tab.addEventListener("click", () => {
          preview.innerHTML = "";
          selectedSheet = sheetName;
          localStorage.setItem("isMultipleTables", hasMultipleTables(sheetData[selectedSheet]));
          displayTable(sheetData[selectedSheet], preview);
          setActiveTab(tab);
          if (localStorage.getItem("isMultipleTables") === "true") {
            previewSelectCell.style.display = "block";
          } else {
            previewSelectCell.style.display = "none";
          }
          document.getElementById("openChartWindow").addEventListener("click", () => {
            const isMultipleTables = localStorage.getItem("isMultipleTables");
            const el = getSelectedData(sheetData[selectedSheet]);

            if (isMultipleTables === "true") {
              localStorage.setItem("chartData", JSON.stringify(el));
            } else {
              localStorage.setItem("chartData", JSON.stringify(sheetData[selectedSheet]));
            }
          });
        });

        tabsContainer.appendChild(tab);
      });

      tabsContainer.style.display = "flex";
      tabsTitle.style.display = "block";
    } else {
      tabsContainer.style.display = "none";
      tabsTitle.style.display = "none";
    }

    document.getElementById("openChartWindow").addEventListener("click", () => {
      const el = getSelectedData(sheetData[selectedSheet]);

      const isMultipleTables = localStorage.getItem("isMultipleTables");
      if (isMultipleTables === "true") {
        localStorage.setItem("chartData", JSON.stringify(el));
      } else {
        localStorage.setItem("chartData", JSON.stringify(sheetData[selectedSheet]));
      }
    });
  };

  reader.readAsArrayBuffer(file);
}

function handleJSONFile(file, preview) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const jsonData = JSON.parse(e.target.result);
      displayJSON(jsonData, preview);

      const transformedData = [
        Object.keys(jsonData[0]),
        ...jsonData.map(obj =>
          Object.values(obj).map(value => (typeof value === "number" ? value : isNaN(value) ? value : Number(value)))
        ),
      ];

      localStorage.setItem("chartData", JSON.stringify(transformedData));
    } catch (error) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Помилка: Невалідний JSON.";
      openChartPageBtn.classList.add("open-chart-page-btn-disabled");
      preview.appendChild(errorMessage);
    }
  };

  reader.readAsText(file);
}

function displayJSON(data, preview) {
  if (!Array.isArray(data) || data.length === 0) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = "Немає даних для відображення.";
    preview.appendChild(errorMessage);
    openChartPageBtn.classList.add("open-chart-page-btn-disabled");
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headers = Object.keys(data[0]);

  const trHead = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  data.forEach(item => {
    const tr = document.createElement("tr");
    headers.forEach(header => {
      const td = document.createElement("td");
      td.textContent = item[header] !== undefined ? item[header] : "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  preview.appendChild(table);
}
function displayTable(data, preview) {
  if (!Array.isArray(data) || data.length === 0) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = "Немає даних для відображення.";
    openChartPageBtn.classList.add("open-chart-page-btn-disabled");
    preview.appendChild(errorMessage);
    return;
  }

  previewTitle.textContent = "Попередній перегляд";
  previewTitle.style.display = "block";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = data[0];
  const trHead = document.createElement("tr");
  headerRow.forEach(cell => {
    const th = document.createElement("th");
    th.textContent = cell || "";
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  let isSelecting = false;
  let startCell = null;
  let isMouseDown = false;
  let startX = 0,
    startY = 0;
  const moveThreshold = 15;
  data.slice(1).forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, cellIndex) => {
      const td = document.createElement("td");
      td.textContent = cell || "";

      td.addEventListener("mousedown", () => {
        if (localStorage.getItem("isMultipleTables") === "false") {
          return;
        }

        isMouseDown = true;
        startX = event.clientX;
        startY = event.clientY;
        startCell = [rowIndex + 1, cellIndex + 1];
        selectedCells.push(startCell);
        table.classList.add("table-selecting");
      });

      td.addEventListener("mousemove", e => {
        if (isMouseDown && localStorage.getItem("isMultipleTables") === "true") {
          const currentX = event.clientX;
          const currentY = event.clientY;

          const deltaX = Math.abs(currentX - startX);
          const deltaY = Math.abs(currentY - startY);

          if (deltaX > moveThreshold || deltaY > moveThreshold) {
            isSelecting = true;
            const currentCell = [rowIndex + 1, cellIndex + 1];
            table.querySelectorAll("td").forEach(td => td.classList.remove("highlight"));
            selectedCells = [];
            highlightCells(table, selectedCells, startCell, currentCell);
          }
        }
      });

      td.addEventListener("mouseup", () => {
        if (isSelecting) {
          const endCell = [rowIndex + 1, cellIndex + 1];

          if (startCell[0] === endCell[0] && startCell[1] === endCell[1]) {
            table.querySelectorAll("td").forEach(td => td.classList.remove("highlight"));
            selectedCells = [];
          } else {
            localStorage.setItem("selectedCells", JSON.stringify(selectedCells));
          }

          isSelecting = false;
        }
        isMouseDown = false;
        table.classList.remove("table-selecting");
      });

      document.addEventListener("mouseup", () => {
        isMouseDown = false;

        table.classList.remove("table-selecting");
      });
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  preview.appendChild(table);
}

function removeEmptyColumns(data) {
  const columnCount = data[0].length;
  const columnsToKeep = new Set();

  for (let col = 0; col < columnCount; col++) {
    if (data.some(row => row[col] !== "")) {
      columnsToKeep.add(col);
    }
  }

  return data.map(row => {
    return Array.from(columnsToKeep).map(colIndex => row[colIndex]);
  });
}

function setActiveTab(tabElement) {
  const tabs = tabsContainer.querySelectorAll(".tab-button");
  tabs.forEach(tab => tab.classList.remove("active"));
  tabElement.classList.add("active");
}

function highlightCells(table, selectedCells, start, end) {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  table.querySelectorAll("td").forEach(td => td.classList.remove("highlight"));

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const td = table.querySelector(`tr:nth-child(${row}) td:nth-child(${col})`);
      if (td) {
        td.classList.add("highlight");
        selectedCells.push([row, col]);
      }
    }
  }
}

function getSelectedData(sheet) {
  const d = [];
  const selectedCells = localStorage.getItem("selectedCells") || [];

  if (selectedCells && selectedCells.length > 0) {
    JSON.parse(selectedCells).forEach(([row, col]) => {
      if (!d[row]) d[row] = [];
      if (!d[row]) d[row] = [];

      if (sheet[row] && sheet[row][col - 1] !== undefined) {
        d[row].push(sheet[row][col - 1]);
      }
    });
  }
  return d.filter(row => Array.isArray(row) && row.length > 0);
}
