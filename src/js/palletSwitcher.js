document.addEventListener("DOMContentLoaded", () => {
  const paletteSelector = document.getElementById("palette-selector");
  paletteSelector.addEventListener("change", event => {
    document.body.className = "";
    document.body.classList.add(`palette-${event.target.value}`);
  });
});
