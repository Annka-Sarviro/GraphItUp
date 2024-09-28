export function highlightCategory(el, isHovering) {
  const category = el.getAttribute("data-category");
  const year = el.getAttribute("data-year");
  const cells = document.querySelectorAll("#dataTable td");
  const selectedCells = document.querySelectorAll("#dataTable  tr.highlight td");

  if (isHovering) {
    el.style.cursor = "pointer";
    el.setAttribute("stroke", "var(--accent-color-hover)");
    el.setAttribute("stroke-width", "3");
    if (selectedCells.length > 0) {
      selectedCells.forEach(cell => {
        const cellCategory = cell.getAttribute("data-Y");
        const cellYear = cell.getAttribute("data-X");

        if (cellCategory === category && cellYear === year) {
          cell.classList.add("highlight");
        }
      });
    } else {
      cells.forEach(cell => {
        const cellCategory = cell.getAttribute("data-Y");
        const cellYear = cell.getAttribute("data-X");

        if (cellCategory === category && cellYear === year) {
          cell.classList.add("highlight");
        }
      });
    }
  } else {
    el.setAttribute("stroke", "none");
    el.setAttribute("stroke-width", "initial");

    cells.forEach(cell => {
      cell.classList.remove("highlight");
    });
  }
}
