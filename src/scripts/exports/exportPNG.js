export function exportPNG(svgElement, fileName = "chart_table.png") {
  const svgClone = svgElement.cloneNode(true);
  svgClone.setAttribute("width", 800);
  svgClone.setAttribute("height", 800);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 800;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    context.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, "image/png");
  };

  img.onerror = err => {
    console.error("Ошибка загрузки изображения", err);
  };

  img.src = url;
}
