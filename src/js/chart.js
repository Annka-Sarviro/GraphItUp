const chartSVG = document.getElementById("chartSVG");
let chartType = "bar";

const data = JSON.parse(localStorage.getItem("chartData")) || [];

function renderTable(data) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const cellElement = rowIndex === 0 ? document.createElement("th") : document.createElement("td");
      cellElement.textContent = cell;
      tr.appendChild(cellElement);
    });
    table.appendChild(tr);
  });
}

// Функція для побудови діаграми
function drawChart(type) {
  const labels = data.slice(1).map(row => row[0]);
  const values = data.slice(1).map(row => row[1]);
  const total = values.reduce((acc, val) => acc + val, 0);

  chartSVG.innerHTML = "";
  const oneColor = getComputedStyle(document.body).getPropertyValue("--one-color").trim();
  const twoColor = getComputedStyle(document.body).getPropertyValue("--two-color").trim();
  const threeColor = getComputedStyle(document.body).getPropertyValue("--three-color").trim();
  const fourColor = getComputedStyle(document.body).getPropertyValue("--four-color").trim();
  const fiveColor = getComputedStyle(document.body).getPropertyValue("--five-color").trim();

  const colors = [oneColor, twoColor, threeColor, fourColor, fiveColor];
  console.log(colors);
  if (type === "bar") {
    const maxVal = Math.max(...values);
    const barWidth = chartSVG.clientWidth / values.length;

    values.forEach((value, index) => {
      const barHeight = (value / maxVal) * chartSVG.clientHeight;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", index * barWidth);
      rect.setAttribute("y", chartSVG.clientHeight - barHeight);
      rect.setAttribute("width", barWidth - 10);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", colors[index % colors.length]);
      chartSVG.appendChild(rect);

      // Додаємо підписи
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", index * barWidth + barWidth / 4);
      text.setAttribute("y", chartSVG.clientHeight - barHeight - 5);
      text.setAttribute("fill", "#000");
      text.textContent = labels[index];
      chartSVG.appendChild(text);
    });

    const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yLabel.setAttribute("x", 10);
    yLabel.setAttribute("y", chartSVG.clientHeight / 2);
    yLabel.setAttribute("fill", "#000");
    yLabel.textContent = "Значення";
    chartSVG.appendChild(yLabel);

    const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xLabel.setAttribute("x", chartSVG.clientWidth / 2);
    xLabel.setAttribute("y", chartSVG.clientHeight - 10);
    xLabel.setAttribute("fill", "#000");
    xLabel.textContent = "Мітки";
    chartSVG.appendChild(xLabel);
  } else if (type === "pie") {
    let startAngle = 0;

    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const radius = 150;
      const x = chartSVG.clientWidth / 2;
      const y = chartSVG.clientHeight / 2;
      const x1 = x + radius * Math.cos(startAngle);
      const y1 = y + radius * Math.sin(startAngle);
      const x2 = x + radius * Math.cos(startAngle + sliceAngle);
      const y2 = y + radius * Math.sin(startAngle + sliceAngle);

      const pathData = `M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${sliceAngle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5]);
      chartSVG.appendChild(path);
      startAngle += sliceAngle;
    });

    let legendY = 20;
    labels.forEach((label, index) => {
      const legendRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      legendRect.setAttribute("x", 10);
      legendRect.setAttribute("y", legendY);
      legendRect.setAttribute("width", 15);
      legendRect.setAttribute("height", 15);
      legendRect.setAttribute("fill", ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5]);
      chartSVG.appendChild(legendRect);

      const legendText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      legendText.setAttribute("x", 30);
      legendText.setAttribute("y", legendY + 12);
      legendText.setAttribute("fill", "#000");
      legendText.textContent = label;
      chartSVG.appendChild(legendText);

      legendY += 20;
    });
  } else if (type === "line") {
    const maxVal = Math.max(...values);
    const stepX = chartSVG.clientWidth / (values.length - 1);
    const stepY = chartSVG.clientHeight / maxVal;

    let pathData = `M 0 ${chartSVG.clientHeight - values[0] * stepY}`;
    values.forEach((value, index) => {
      pathData += ` L ${index * stepX} ${chartSVG.clientHeight - value * stepY}`;
    });

    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePath.setAttribute("d", pathData);
    linePath.setAttribute("stroke", "#4CAF50");
    linePath.setAttribute("fill", "none");
    chartSVG.appendChild(linePath);

    values.forEach((value, index) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", index * stepX);
      circle.setAttribute("cy", chartSVG.clientHeight - value * stepY);
      circle.setAttribute("r", 5);
      circle.setAttribute("fill", "#4CAF50");
      chartSVG.appendChild(circle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", index * stepX);
      text.setAttribute("y", chartSVG.clientHeight - value * stepY - 5);
      text.setAttribute("fill", "#000");
      text.textContent = value;
      chartSVG.appendChild(text);
    });

    const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yLabel.setAttribute("x", 10);
    yLabel.setAttribute("y", chartSVG.clientHeight / 2);
    yLabel.setAttribute("fill", "#000");
    yLabel.textContent = "Значення";
    chartSVG.appendChild(yLabel);

    const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xLabel.setAttribute("x", chartSVG.clientWidth / 2);
    xLabel.setAttribute("y", chartSVG.clientHeight - 10);
    xLabel.setAttribute("fill", "#000");
    xLabel.textContent = "Мітки";
    chartSVG.appendChild(xLabel);
  }
}

const radioButtons = document.querySelectorAll('input[name="chartType"]');

radioButtons.forEach(radio => {
  radio.addEventListener("change", e => {
    chartType = e.target.value;
    console.log("Тип діаграми:", chartType); // Виводимо вибраний тип діаграми
  });
});

document.getElementById("drawChart").addEventListener("click", () => {
  renderTable(data);
  drawChart(chartType);
});

renderTable(data);
drawChart(chartType);
