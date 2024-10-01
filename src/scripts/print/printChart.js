function printChart() {
  const chartSVGContents = document.getElementById("chartSVG-wrapper").outerHTML;

  const dataTable = document.getElementById("dataTable");
  const rowTable = dataTable.querySelectorAll("tr");

  let dataTableContents;
  const headContent = rowTable.length > 0 ? rowTable[0].outerHTML : "";

  if (rowTable.length > 7) {
    const highlightRows = Array.from(dataTable.querySelectorAll("tr.highlight"));
    dataTableContents = `
      <table>
        <thead>${headContent}</thead>
        <tbody>${highlightRows.map(row => row.outerHTML).join("")}</tbody>
      </table>
    `;
  } else {
    dataTableContents = dataTable.outerHTML;
  }

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="/GraphItUp/assets/themeToggle-CbXuv_Eg.css">
      </head>
      <body>
        <div id="print-content">

          ${chartSVGContents}

          ${dataTableContents}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onafterprint = function () {
    printWindow.close();
  };

  printWindow.print();
}

document.getElementById("printChart").addEventListener("click", () => {
  printChart();
});
