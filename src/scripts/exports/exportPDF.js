export function exportPDF(svgElement, tableElement, fileName = "chart_table.pdf") {
  // const canvas = document.createElement("canvas");
  // const context = canvas.getContext("2d");
  // const svgWidth = svgElement.clientWidth;
  // const svgHeight = svgElement.clientHeight;
  // const tableHeight = tableElement.offsetHeight;
  // // Устанавливаем размеры канваса
  // canvas.width = Math.max(svgWidth, tableElement.offsetWidth);
  // canvas.height = svgHeight + tableHeight;
  // // Сериализуем SVG в строку и создаем Blob
  // const svgData = new XMLSerializer().serializeToString(svgElement);
  // const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
  // const svgUrl = URL.createObjectURL(svgBlob);
  // // Создаем изображение для SVG
  // const img = new Image();
  // img.onload = function () {
  //   context.drawImage(img, 0, 0); // Рисуем график на канвасе
  //   // Сериализуем таблицу в строку и создаем Blob
  //   const tableData = new XMLSerializer().serializeToString(tableElement);
  //   const tableBlob = new Blob([tableData], { type: "image/svg+xml" });
  //   const tableUrl = URL.createObjectURL(tableBlob);
  //   // Создаем изображение для таблицы
  //   const tableImg = new Image();
  //   tableImg.onload = function () {
  //     context.drawImage(tableImg, 0, svgHeight); // Рисуем таблицу под графиком
  //     // Экспортируем Canvas в PDF
  //     canvas.toBlob(blob => {
  //       if (blob) {
  //         const url = URL.createObjectURL(blob);
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.download = fileName;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         URL.revokeObjectURL(url); // Освобождаем объект URL
  //       } else {
  //         console.error("Не удалось создать Blob из canvas.");
  //       }
  //     }, "image/png");
  //     // Освобождаем URL для таблицы
  //     URL.revokeObjectURL(tableUrl);
  //   };
  //   // Устанавливаем источник для изображения таблицы
  //   tableImg.src = tableUrl;
  // };
  // // Устанавливаем источник для изображения SVG
  // img.src = svgUrl;
  // // Обработка ошибок
  // img.onerror = function () {
  //   console.error("Ошибка загрузки изображения SVG.");
  // };
}
