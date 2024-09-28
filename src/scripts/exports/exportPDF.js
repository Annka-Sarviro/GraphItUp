export function exportPDF(svgElement, fileName = "chart_table.pdf") {
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

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const imgDataURL = canvas.toDataURL("image/png");
      printWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
          </head>
          <body>
            <img src="${imgDataURL}" style="width:100%;height:auto;">
          </body>
        </html>
      `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

  img.onerror = err => {
    console.error("Ошибка загрузки изображения", err);
  };

  img.src = url;
}
