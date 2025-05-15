export interface ExcelRow {
  [key: string]: string
}

export interface PhotoMatch {
  photo: File
  matched: boolean
  matchedRow?: ExcelRow
  originalName: string
  newName: string
}

export interface FormatPart {
  type: "column" | "separator"
  value: string
}
