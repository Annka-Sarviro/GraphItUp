export function exportPNG(svgElement, tableElement, fileName = "chart_table.png") {
  // Создаем Canvas для объединения графика и таблицы
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Получаем размеры SVG
  const svgWidth = svgElement.clientWidth;
  const svgHeight = svgElement.clientHeight;

  // Сериализуем SVG в строку
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);

  // Создаем изображение для SVG
  const img = new Image();
  img.crossOrigin = "anonymous"; // Убедитесь, что это установлено
  img.onload = function () {
    // Устанавливаем размеры Canvas с учетом таблицы и графика
    const tableHeight = tableElement.offsetHeight;
    canvas.width = Math.max(svgWidth, tableElement.offsetWidth); // Максимальная ширина
    canvas.height = svgHeight + tableHeight; // Общая высота

    // Рисуем график (SVG) на Canvas
    context.drawImage(img, 0, 0);

    // Сериализуем таблицу в строку
    const tableData = new XMLSerializer().serializeToString(tableElement);
    const tableBlob = new Blob([tableData], { type: "image/svg+xml" });
    const tableUrl = URL.createObjectURL(tableBlob);

    // Создаем изображение для таблицы
    const tableImg = new Image();
    tableImg.crossOrigin = "anonymous"; // Убедитесь, что это установлено
    tableImg.onload = function () {
      context.drawImage(tableImg, 0, svgHeight); // Рисуем таблицу под графиком

      // Экспортируем Canvas как PNG
      canvas.toBlob(function (blob) {
        if (blob) {
          // Создаем ссылку для скачивания
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url); // Освобождаем объект URL
        } else {
          console.error("Не удалось создать Blob из canvas.");
        }
      }, "image/png");

      // Освобождаем URL для таблицы
      URL.revokeObjectURL(tableUrl);
    };

    // Устанавливаем источник для изображения таблицы
    tableImg.src = tableUrl;
  };

  // Устанавливаем источник для изображения SVG
  img.src = svgUrl;

  // Обработка ошибок
  img.onerror = function () {
    console.error("Ошибка загрузки изображения SVG.");
  };
}
