import type { ExcelRow } from "@/types"

/**
 * Apply a format string to data, replacing placeholders with actual values
 */
export function applyFormatToData(formatString: string, data: ExcelRow): string {
  // Enhanced regex to handle Chinese characters, parentheses and other special characters
  return formatString.replace(/\{([^{}]+)\}/g, (match, columnName) => {
    // Try exact match first
    if (data[columnName] !== undefined) {
      return data[columnName]
    }

    // If exact match fails, try to find a column that contains the core part of the placeholder
    // For example, if placeholder is {姓名（必填）} but column is just "姓名"
    for (const key of Object.keys(data)) {
      // Remove common annotations like （必填）, (必填), （选填）, (选填) etc.
      const cleanColumnName = columnName
        .replace(/（[^）]*）/g, "") // Chinese parentheses
        .replace(/$$[^)]*$$/g, "") // Regular parentheses
        .trim()

      if (key === cleanColumnName || key.includes(cleanColumnName) || cleanColumnName.includes(key)) {
        return data[key]
      }
    }

    // If no match found, return the original placeholder
    console.warn(`No matching column found for placeholder: ${match}`)
    return match
  })
}

/**
 * Find a matching row in Excel data based on photo filename
 */
export function findMatchingRow(
  photoName: string,
  excelData: ExcelRow[],
  filenameColumn: string,
): ExcelRow | undefined {
  // Try different matching strategies
  const nameWithoutExtension = photoName.substring(0, photoName.lastIndexOf("."))

  // 1. Exact match
  const exactMatch = excelData.find((row) => row[filenameColumn] === photoName)
  if (exactMatch) return exactMatch

  // 2. Match without extension
  const extensionlessMatch = excelData.find((row) => row[filenameColumn] === nameWithoutExtension)
  if (extensionlessMatch) return extensionlessMatch

  // 3. Contains match
  return excelData.find(
    (row) => photoName.includes(row[filenameColumn]) || row[filenameColumn].includes(nameWithoutExtension),
  )
}

/**
 * Debug function to help identify column name issues
 */
export function debugColumnNames(formatParts: any[], excelData: ExcelRow[]): string {
  if (excelData.length === 0) return "No Excel data available"

  const sampleRow = excelData[0]
  const availableColumns = Object.keys(sampleRow)

  const formatColumns = formatParts.filter((part) => part.type === "column").map((part) => part.value)

  return `
Format columns: ${formatColumns.join(", ")}
Available columns: ${availableColumns.join(", ")}
  `
}
