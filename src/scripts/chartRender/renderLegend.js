import { darkenColor } from "../helpers/darkenColor";

export function renderLegend(categories, colors, axisY, type = "bar") {
  const legendContainer = document.getElementById("legend");
  legendContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "5px";
    legendItem.style.cursor = "pointer";

    const colorBox = document.createElement("div");
    colorBox.style.width = "15px";
    colorBox.style.height = "15px";

    const boxColor = index >= 5 ? darkenColor(colors[index % colors.length], -20) : colors[index % colors.length];

    colorBox.style.backgroundColor = boxColor;
    colorBox.style.marginRight = "10px";

    const labelText = document.createElement("span");
    labelText.textContent = category;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);

    legendItem.addEventListener("mouseenter", () => {
      highlightCategory(category, true, type);
    });

    legendItem.addEventListener("mouseleave", () => {
      highlightCategory(category, false, type);
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
          bar.style.strokeWidth = "4px";
        } else {
          bar.style.stroke = "var(--accent-color-hover)";
          bar.style.strokeWidth = "3px";
        }
      } else {
        if (type === "line") {
          bar.style.strokeWidth = "initial";
        } else {
          bar.style.stroke = "none";
        }
      }
    }
  });
}
