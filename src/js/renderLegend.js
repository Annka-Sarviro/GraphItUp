function darkenColor(color, percent) {
  const num = parseInt(color.slice(1), 16); // Convert hex to number
  const amt = Math.round(2.55 * percent); // Calculate amount to darken
  const R = (num >> 16) + amt; // Get red
  const G = ((num >> 8) & 0x00ff) + amt; // Get green
  const B = (num & 0x0000ff) + amt; // Get blue

  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}

export function renderLegend(categories, colors, axisY) {
  console.log(categories);
  const legendContainer = document.getElementById("legend");
  legendContainer.innerHTML = ""; // Clear existing legend

  categories.forEach((category, index) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "5px";
    legendItem.style.cursor = "pointer"; // Change cursor to pointer

    const colorBox = document.createElement("div");
    colorBox.style.width = "15px";
    colorBox.style.height = "15px";

    // Determine color
    const boxColor = index >= 5 ? darkenColor(colors[index % colors.length], -20) : colors[index % colors.length];

    colorBox.style.backgroundColor = boxColor;
    colorBox.style.marginRight = "10px";

    const labelText = document.createElement("span");
    labelText.textContent = category;

    // Append color and text to legend item
    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);

    // Add hover event listeners
    legendItem.addEventListener("mouseenter", () => {
      highlightCategory(category, true); // Highlight on hover
    });

    legendItem.addEventListener("mouseleave", () => {
      highlightCategory(category, false); // Remove highlight on leave
    });

    // Append legend item to container
    legendContainer.appendChild(legendItem);
  });
}

// Function to highlight the category in the chart
function highlightCategory(category, isHovering) {
  const bars = document.querySelectorAll("rect"); // Select all bars
  bars.forEach(bar => {
    const categoryValue = bar.getAttribute("data-category"); // Assuming each bar has a data-category attribute
    if (categoryValue === category) {
      if (isHovering) {
        bar.style.stroke = "var(--accent-color-hover)"; // Add border on hover
        bar.style.strokeWidth = "3px"; // Set border width
      } else {
        bar.style.stroke = "none"; // Remove border when not hovering
      }
    }
  });
}
