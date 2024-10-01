import { darkenColor } from "../helpers/darkenColor";

export function renderLegend(categories, axisY, type = "bar") {
  const legendContainer = document.getElementById("legend");
  legendContainer.innerHTML = "";

  const storedColors = JSON.parse(localStorage.getItem("headerColors")) || {};

  categories.forEach((category, index) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "5px";
    legendItem.style.cursor = "pointer";

    const colorBox = document.createElement("div");
    colorBox.style.width = "15px";
    colorBox.style.minWidth = "15px";
    colorBox.style.height = "15px";

    const boxColor = storedColors[category] || "#cccccc";

    colorBox.style.backgroundColor = boxColor;
    colorBox.style.marginRight = "10px";

    const labelText = document.createElement("span");
    labelText.textContent = category;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);

    legendItem.addEventListener("mouseenter", () => {
      highlightCategory(category, true, type);
      highlightColumn(category, true, type);
    });

    legendItem.addEventListener("mouseleave", () => {
      highlightCategory(category, false, type);
      highlightColumn(category, false, type);
    });

    legendContainer.appendChild(legendItem);
  });
}

function highlightCategory(category, isHovering, type = "bar") {
  const bars = document.querySelectorAll("rect, path");

  bars.forEach(bar => {
    const categoryValue = bar.getAttribute("data-category");

    if (categoryValue === category) {
      if (isHovering) {
        if (type === "line") {
          bar.setAttribute("stroke-width", "4");
        } else {
          bar.setAttribute("stroke-width", "3");
          bar.style.stroke = "var(--accent-color-hover)";
        }
      } else {
        if (type === "line") {
          bar.setAttribute("stroke-width", "2");
        } else {
          bar.setAttribute("stroke-width", "0");
        }
      }
    }
  });
}

function highlightColumn(category, isHovering, type = "bar") {
  const table = document.getElementById("dataTable");
  const rows = table.querySelectorAll("tr");
  console.log(category, isHovering);
  rows.forEach(row => {
    const cells = row.querySelectorAll("td, th");

    cells.forEach((cell, index) => {
      const categoryValue = cell.getAttribute("data-y");

      if (categoryValue === category) {
        const columnIndex = index;

        rows.forEach(r => {
          const cellToHighlight = r.cells[columnIndex];

          if (cellToHighlight) {
            if (isHovering) {
              cellToHighlight.style.backgroundColor = "var(--accent-color-hover)";
            } else {
              cellToHighlight.style.backgroundColor = "";
            }
          }
        });
      }
    });
  });
}
