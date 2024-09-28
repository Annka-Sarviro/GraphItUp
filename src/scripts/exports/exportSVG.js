export function exportSVG(svgElement, filename) {
  const svgClone = svgElement.cloneNode(true);

  svgClone.setAttribute("width", 800);
  svgClone.setAttribute("height", 800);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
