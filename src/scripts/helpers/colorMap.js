import { darkenColor } from "./darkenColor";

export function generateColorsForHeaderRow(headerRow) {
  const oneColor = getComputedStyle(document.body).getPropertyValue("--one-color").trim();
  const twoColor = getComputedStyle(document.body).getPropertyValue("--two-color").trim();
  const threeColor = getComputedStyle(document.body).getPropertyValue("--three-color").trim();
  const fourColor = getComputedStyle(document.body).getPropertyValue("--four-color").trim();
  const fiveColor = getComputedStyle(document.body).getPropertyValue("--five-color").trim();

  const baseColors = [oneColor, twoColor, threeColor, fourColor, fiveColor];
  const colorMap = {};

  headerRow.forEach((item, index) => {
    let color;

    if (index < 5) {
      color = baseColors[index];
    } else {
      const baseColor = baseColors[index % 5];
      color = darkenColor(baseColor, -20 * Math.floor(index / 5));
    }

    colorMap[item] = color;
  });

  localStorage.setItem("headerColors", JSON.stringify(colorMap));

  console.log("Generated Color Map:", colorMap);
}
