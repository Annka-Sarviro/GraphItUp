export function exportSVG(svgElement, tableElement, filename) {
  // Клонируем SVG элемент
  const svgClone = svgElement.cloneNode(true);

  // Создаем новый SVG элемент, который будет содержать график и таблицу
  const exportSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const svgWidth = svgElement.clientWidth;
  const svgHeight = svgElement.clientHeight + tableElement.clientHeight; // Учитываем высоту таблицы

  exportSVG.setAttribute("width", svgWidth);
  exportSVG.setAttribute("height", svgHeight);
  exportSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Добавляем график в новый SVG
  exportSVG.appendChild(svgClone);

  // Создаем новый текстовый элемент для таблицы
  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute("x", 0);
  foreignObject.setAttribute("y", svgHeight - tableElement.clientHeight);
  foreignObject.setAttribute("width", svgWidth);
  foreignObject.setAttribute("height", tableElement.clientHeight);

  // Клонируем таблицу и добавляем её в foreignObject
  const tableClone = tableElement.cloneNode(true);
  const wrapper = document.createElement("div");
  wrapper.appendChild(tableClone);
  foreignObject.appendChild(wrapper);

  exportSVG.appendChild(foreignObject);

  // Создаем Blob и ссылаемся на него
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(exportSVG);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Создаем ссылку для скачивания
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
