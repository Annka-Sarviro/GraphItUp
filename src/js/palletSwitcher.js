const paletteBtn = document.getElementById("palette-btn");
const paletteDropdown = document.getElementById("palette-dropdown");

paletteBtn.addEventListener("click", function (event) {
  paletteDropdown.classList.toggle("hidden");
  event.stopPropagation();
});

document.querySelectorAll("#palette-dropdown li").forEach(function (item) {
  item.addEventListener("click", function () {
    const palette = this.getAttribute("data-palette");

    paletteDropdown.classList.add("hidden");
  });
});

document.addEventListener("click", function (event) {
  if (!paletteDropdown.classList.contains("hidden") && !paletteBtn.contains(event.target)) {
    paletteDropdown.classList.add("hidden");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const paletteSelector = document.getElementById("palette-selector");
  paletteSelector.addEventListener("change", event => {
    const selectedPalette = event.target.value;
    document.body.classList.remove(`palette-${selectedPalette}`);
    void document.body.offsetWidth;
    document.body.classList.add(`palette-${selectedPalette}`);
    drawChart(chartType);
  });
});

document.querySelectorAll("#palette-dropdown li").forEach(function (item) {
  item.addEventListener("click", function () {
    document.querySelectorAll("#palette-dropdown .dropdown-item").forEach(function (el) {
      el.classList.remove("active");
    });

    this.classList.add("active");
    const palette = this.getAttribute("data-palette");
    document.body.className = document.body.className.replace(/\bpalette-\S+/g, "");
    document.body.classList.add(`palette-${palette}`);

    drawChart(chartType);

    document.getElementById("palette-dropdown").classList.add("hidden");
  });
});
