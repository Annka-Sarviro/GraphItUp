import * as XLSX from "xlsx";
const openChartPageBtn = document.querySelector(".open-chart-page-btn");

export function displayPreview(file, preview) {
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
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

    const filledJson = json.map(row => row.map(cell => (cell === null || cell === undefined ? "" : cell)));

    const nonEmptyRows = filledJson.filter(row => row.some(cell => cell !== ""));

    displayTable(nonEmptyRows, preview);

    localStorage.setItem("chartData", JSON.stringify(nonEmptyRows));
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

  const titleElement = document.createElement("h2");
  titleElement.textContent = "Попередній перегляд";
  preview.appendChild(titleElement);

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

  data.slice(1).forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell || "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  preview.appendChild(table);
}
