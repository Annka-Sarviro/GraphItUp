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
    <link rel="stylesheet" type="text/css" href="../styles.css">  
          <style>
         font-family: "Roboto", sans-serif;
  line-height: 1.5;
  font-weight: 400;        
          h1,
h2,
h3,
h4 {
  font-size: 20px;
  line-height:  24px;
  color:  #000;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

p,
span {
  font-size: 14px;
  line-height: 16px;
  margin: 0;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}

.label,
.small-text {
  font-size: 10px;
  line-height:12px;
  color:  #0056a2;
}

html,
body {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  background-color: #fff;
  color:  #000;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}   
table {
  border-collapse: collapse;
  width: 100%;
  user-select: none;
}
th,
td {
  border: 1px solid #a2a0a0;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f1f1f1;
}
thead {
  position: sticky;
  top: 0;
  z-index: 3;
}

table td {
  cursor: default;
}

.table-selecting td {
  cursor: crosshair;
}

.highlight {
  background-color: #ffd8056b;
  transition: background-color 0.3s ease;
}

#dataTable .extra {
  background-color: #e4b005;
  transition:background-color 0.3s ease;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
#chartSVG {
  width: 500px;
  height: 500px;
}

@media print, screen and (min-width: 640px) {
  #chartSVG {
    width: 600px;
    height: 600px;
  }
}

@media print, screen and (min-width: 1024px) {
  #chartSVG {
    width: 800px;
    height: 800px;
  }
}
        .chartSVG-wrapper {
  display: flex;
  flex-direction: column;
}
  
@media print, screen and (min-width: 860px) {
  .chartSVG-wrapper {
    flex-direction: row;
    justify-content: space-between;
  }
}
.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
  height: fit-content;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid  #f1f1f1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.legend span {
  position: relative;
  display: inline-block;
}

.legend span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: #ffc300;
  transform: scaleX(0);
  transition:  all 0.3s ease;
  transform-origin: left;
}

.legend span:hover::after,
.legend span.hover::after {
  transform: scaleX(1);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  column-gap: 10px;
}

.pagination-wrapper button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 10px;
}

.pagination-wrapper .material-symbols-outlined {
  font-size: 24px;
  color:  #ffd700;
  transition:  all 0.3s ease;
}

.pagination-wrapper .material-symbols-outlined:hover {
  color:  #ffc300;
}

.export-wrapper {
  display: flex;
  justify-content: space-between;
}

          
          </style>
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
