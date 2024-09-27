export function cleanData(data) {
  const headers = data[0];
  const cleanedData = [];

  const columnsToKeep = headers.slice(1).map((_, colIndex) => {
    const isTextColumn = data.slice(1).every(row => isNaN(row[colIndex + 1]));
    return !isTextColumn;
  });

  data.forEach(row => {
    const newRow = row.filter((_, colIndex) => colIndex === 0 || columnsToKeep[colIndex - 1]);
    cleanedData.push(newRow);
  });

  return cleanedData;
}
