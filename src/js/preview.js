import * as XLSX from "xlsx";

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
    displayTable(rows, preview);
    localStorage.setItem("chartData", JSON.stringify(rows));
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
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    displayTable(json, preview);

    localStorage.setItem("chartData", JSON.stringify(json));
  };

  reader.readAsArrayBuffer(file);
}

function handleJSONFile(file, preview) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const jsonData = JSON.parse(e.target.result);
    displayJSON(jsonData, preview);
    const transformedData = [
      Object.keys(jsonData[0]),
      ...jsonData.map(obj =>
        Object.values(obj).map(value => (typeof value === "number" ? value : isNaN(value) ? value : Number(value)))
      ),
    ];

    localStorage.setItem("chartData", JSON.stringify(transformedData));
  };

  reader.readAsText(file);
}

function displayJSON(data, preview) {
  const jsonPre = document.createElement("pre");
  jsonPre.textContent = JSON.stringify(data, null, 2);
  preview.appendChild(jsonPre);
}

function displayTable(data, preview) {
  const table = document.createElement("table");
  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = rowIndex === 0 ? document.createElement("th") : document.createElement("td");
      td.textContent = cell || "";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  preview.appendChild(table);
}
