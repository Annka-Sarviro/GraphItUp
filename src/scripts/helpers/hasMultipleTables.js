export function hasMultipleTables(sheetData) {
  let previousRowLength = null;
  let emptyRowCount = 0;
  const emptyRowThreshold = 2;
  const maxTableSizeDifference = 2;

  for (let i = 0; i < sheetData.length; i++) {
    const row = sheetData[i];
    const nonEmptyCells = row.filter(cell => cell !== "").length;
    if (previousRowLength !== null && Math.abs(previousRowLength - nonEmptyCells) > maxTableSizeDifference) {
      return true;
    }

    if (nonEmptyCells === 0) {
      emptyRowCount++;
    } else {
      emptyRowCount = 0;
      previousRowLength = nonEmptyCells;
    }
    if (emptyRowCount >= emptyRowThreshold) {
      return true;
    }
  }

  return false;
}
