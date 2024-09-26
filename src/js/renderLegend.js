function darkenColor(color, percent) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}

export function renderLegend(categories, colors, axisY) {
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
      highlightCategory(category, true);
    });

    legendItem.addEventListener("mouseleave", () => {
      highlightCategory(category, false);
    });

    legendContainer.appendChild(legendItem);
  });
}

function highlightCategory(category, isHovering) {
  const bars = document.querySelectorAll("rect, path");

  bars.forEach(bar => {
    const categoryValue = bar.getAttribute("data-category");
    if (categoryValue === category) {
      if (isHovering) {
        bar.style.stroke = "var(--accent-color-hover)";
        bar.style.strokeWidth = "3px";
      } else {
        bar.style.stroke = "none";
      }
    }
  });
}
