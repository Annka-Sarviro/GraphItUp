import { drawChart } from "./chart";

let gridSize = localStorage.getItem("gridSize") || 0;
const dropdownToggle = document.getElementById("scale-toggle");
const dropdownMenu = document.getElementById("scale-menu");

// Если gridSize сохранён в localStorage, отобразить его в поле
if (gridSize) {
  dropdownToggle.value = gridSize;
}

// Показать/скрыть дропдаун по клику
dropdownToggle.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

// Создать элементы для чисел, кратных 4, от 4 до 100
for (let i = 10; i <= 500; i += 10) {
  const menuItem = document.createElement("div");
  menuItem.textContent = i;

  // При клике на элемент обновляем текст в окне, сохраняем значение и в localStorage
  menuItem.addEventListener("click", () => {
    dropdownToggle.value = i; // Обновляем значение в input
    gridSize = i; // Сохраняем значение как gridSize
    localStorage.setItem("gridSize", gridSize); // Сохраняем в localStorage
    let chartType = localStorage.getItem("chartType");
    drawChart(chartType);

    dropdownMenu.classList.add("hidden"); // Скрываем дропдаун после выбора
    console.log("Selected gridSize:", gridSize);
  });

  dropdownMenu.appendChild(menuItem);
}

// Ввод значения вручную без проверок и сохранение в localStorage
dropdownToggle.addEventListener("input", event => {
  gridSize = event.target.value;
  console.log("Entered gridSize:", gridSize);
});

// Сохранение по нажатию Enter и скрытие дропдауна
dropdownToggle.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    localStorage.setItem("gridSize", gridSize);
    let chartType = localStorage.getItem("chartType");
    drawChart(chartType);
    // Сохраняем в localStorage
    dropdownMenu.classList.add("hidden"); // Закрываем дропдаун
    console.log("GridSize saved and dropdown closed on Enter:", gridSize);
  }
});

// Закрыть дропдаун при клике вне его области
document.addEventListener("click", function (event) {
  if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add("hidden");
  }
});
