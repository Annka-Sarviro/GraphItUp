import { drawChart } from "../../chart/chart";

let gridSize = localStorage.getItem("gridSize") || 0;
const dropdownToggle = document.getElementById("scale-toggle");
const dropdownMenu = document.getElementById("scale-menu");

if (gridSize) {
  dropdownToggle.value = gridSize;
}

dropdownToggle.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

for (let i = 10; i <= 500; i += 10) {
  const menuItem = document.createElement("li");
  menuItem.textContent = i;

  menuItem.addEventListener("click", () => {
    dropdownToggle.value = i;
    gridSize = i;
    localStorage.setItem("gridSize", gridSize);
    let chartType = localStorage.getItem("chartType") || "bar";
    drawChart(chartType);

    dropdownMenu.classList.add("hidden");
    console.log("Selected gridSize:", gridSize);
  });

  dropdownMenu.appendChild(menuItem);
}

dropdownToggle.addEventListener("input", event => {
  gridSize = event.target.value;
  console.log("Entered gridSize:", gridSize);
});

dropdownToggle.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    localStorage.setItem("gridSize", gridSize);
    let chartType = localStorage.getItem("chartType") || "bar";
    drawChart(chartType);

    dropdownMenu.classList.add("hidden");
    console.log("GridSize saved and dropdown closed on Enter:", gridSize);
  }
});

document.addEventListener("click", function (event) {
  if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add("hidden");
  }
});
