import { exportPDF } from "./exportPDF";
import { exportPNG } from "./exportPNG";
import { exportSVG } from "./exportSVG";

// Получаем элементы SVG и таблицы
const svgElement = document.getElementById("chartSVG"); // Ваш график
const tableElement = document.getElementById("dataTable"); // Ваша таблица

// Функция для экспорта
document.getElementById("exportButton").addEventListener("click", () => {
  const format = document.getElementById("exportSelect").value;
  console.log(format);
  if (format === "png") {
    exportPNG(svgElement, tableElement, "chart_table.png");
  } else if (format === "svg") {
    exportSVG(svgElement, tableElement, "chart.svg");
  } else if (format === "pdf") {
    exportPDF(svgElement, tableElement, "chart_table.pdf");
  }
});

const customLabel = document.getElementById("customLabel");
const selectedFormat = document.getElementById("selectedFormat");
const selectOptions = document.getElementById("selectOptions");
const arrow = document.querySelector(".arrow"); // Стрілка

// Клік на customLabel - відкрити/закрити меню
customLabel.addEventListener("click", () => {
  selectOptions.classList.toggle("show");
  arrow.classList.toggle("rotate");
});

// Клік на опції у меню
document.querySelectorAll("#selectOptions div").forEach(option => {
  option.addEventListener("click", function () {
    // Оновити текст вибраного формату
    selectedFormat.textContent = this.getAttribute("data-value");
    // Закрити меню після вибору
    arrow.classList.remove("rotate");
    selectOptions.classList.remove("show");
  });
});

// Закриття меню, якщо клікнув не на меню
document.addEventListener("click", function (event) {
  if (!customLabel.contains(event.target)) {
    arrow.classList.remove("rotate");
    selectOptions.classList.remove("show");
  }
});
