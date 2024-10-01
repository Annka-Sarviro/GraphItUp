export function highlightLegend(category, isHovering, type = "bar") {
  const legend = document.getElementById("legend");
  const spans = legend.querySelectorAll("span");

  spans.forEach(span => {
    if (span.textContent.trim() === category) {
      if (isHovering) {
        span.classList.add("hover");
      } else {
        span.classList.remove("hover");
      }
    }
  });
}
