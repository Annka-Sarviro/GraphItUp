export function renderLegend(labels, colors, axisY) {
  const legendContainer = document.getElementById("legend"); // Предположим, у вас есть элемент с id "legend"
  legendContainer.innerHTML = ""; // Очищаем существующую легенду
  const axisYLabel = document.createElement("p");
  axisYLabel.textContent = axisY; // Устанавливаем текст
  //   axisYLabel.style.fontWeight = "bold"; // Устанавливаем жирный шрифт
  axisYLabel.style.marginBottom = "10px"; // Отступ снизу

  // Добавляем текст оси Y в контейнер легенды
  legendContainer.appendChild(axisYLabel);
  labels.forEach((label, index) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "5px";

    // Квадрат цвета
    const colorBox = document.createElement("div");
    colorBox.style.width = "15px";
    colorBox.style.height = "15px";
    colorBox.style.backgroundColor = colors[index % colors.length];
    colorBox.style.marginRight = "10px";

    // Текст метки
    const labelText = document.createElement("span");
    labelText.textContent = label;

    // Добавляем цвет и текст в элемент легенды
    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);

    // Добавляем элемент легенды в контейнер
    legendContainer.appendChild(legendItem);
  });
}
