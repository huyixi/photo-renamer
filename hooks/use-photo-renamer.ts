"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import * as XLSX from "xlsx"
import { toast } from "@/components/ui/use-toast"
import type { ExcelRow, PhotoMatch, FormatPart } from "@/types"
import { findMatchingRow, applyFormatToData } from "@/lib/format-utils"

export function usePhotoRenamer() {
  const [excelData, setExcelData] = useState<ExcelRow[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [customFormat, setCustomFormat] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState<PhotoMatch[]>([])
  const [filenameColumn, setFilenameColumn] = useState<string>("")
  const [matchedCount, setMatchedCount] = useState<number>(0)
  const [unmatchedCount, setUnmatchedCount] = useState<number>(0)
  const [formatParts, setFormatParts] = useState<FormatPart[]>([])
  const [selectedColumn, setSelectedColumn] = useState<string>("")

  // Update custom format whenever format parts change
  useEffect(() => {
    if (formatParts.length > 0) {
      const newFormat = formatParts.map((part) => (part.type === "column" ? `{${part.value}}` : part.value)).join("")
      setCustomFormat(newFormat)
    } else {
      setCustomFormat("")
    }
  }, [formatParts])

  // Reset filename column when columns change
  useEffect(() => {
    if (columns.length > 0 && !columns.includes(filenameColumn)) {
      // Try to find a column that might contain filenames
      const possibleColumns = columns.filter(
        (col) =>
          col.toLowerCase().includes("file") ||
          col.toLowerCase().includes("photo") ||
          col.toLowerCase().includes("image") ||
          col.toLowerCase().includes("照片") ||
          col.toLowerCase().includes("文件") ||
          col.toLowerCase().includes("图片"),
      )

      if (possibleColumns.length > 0) {
        setFilenameColumn(possibleColumns[0])
      } else {
        setFilenameColumn(columns[0])
      }
    }
  }, [columns, filenameColumn])

  // Handle Excel file upload
  const handleExcelUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet)

        if (jsonData.length === 0) {
          toast({
            title: "错误",
            description: "Excel文件中没有数据",
            variant: "destructive",
          })
          return
        }

        // Log column names for debugging
        console.log("Excel columns:", Object.keys(jsonData[0]))

        setExcelData(jsonData)
        setColumns(Object.keys(jsonData[0]))
        setPreviewData([]) // Reset preview when new Excel file is uploaded

        toast({
          title: "成功",
          description: `已加载Excel文件，共${jsonData.length}条数据`,
        })
      } catch (error) {
        toast({
          title: "错误",
          description: "Excel文件解析失败",
          variant: "destructive",
        })
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  // Handle photo files upload
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    setPhotos(imageFiles)
    setPreviewData([]) // Reset preview when new photos are uploaded

    toast({
      title: "成功",
      description: `已加载${imageFiles.length}张照片`,
    })
  }, [])

  // Generate filename based on format and data
  const generateFilename = useCallback(
    (matchedRow: ExcelRow, originalName: string): string => {
      const extension = originalName.split(".").pop()

      if (customFormat) {
        const newName = applyFormatToData(customFormat, matchedRow)
        return `${newName}.${extension}`
      }

      // Default format if none is specified
      const firstColumn = Object.keys(matchedRow)[0]
      return `${matchedRow[firstColumn] || "unknown"}.${extension}`
    },
    [customFormat],
  )

  // Match photos with Excel data based on filename column
  const matchPhotos = useCallback(() => {
    if (!filenameColumn || excelData.length === 0 || photos.length === 0) {
      toast({
        title: "错误",
        description: "请先上传Excel文件和照片，并选择文件名列",
        variant: "destructive",
      })
      return []
    }

    try {
      const matches: PhotoMatch[] = []
      let matched = 0
      let unmatched = 0

      // For each photo, try to find a matching row in the Excel data
      photos.forEach((photo) => {
        const photoName = photo.name
        const matchedRow = findMatchingRow(photoName, excelData, filenameColumn)

        if (matchedRow) {
          matched++
          const newName = generateFilename(matchedRow, photoName)

          matches.push({
            photo,
            matched: true,
            matchedRow,
            originalName: photoName,
            newName,
          })
        } else {
          unmatched++
          matches.push({
            photo,
            matched: false,
            originalName: photoName,
            newName: photoName, // Keep original name for unmatched photos
          })
        }
      })

      setMatchedCount(matched)
      setUnmatchedCount(unmatched)

      return matches
    } catch (error) {
      toast({
        title: "错误",
        description: "匹配照片失败，请检查数据格式",
        variant: "destructive",
      })
      return []
    }
  }, [excelData, filenameColumn, photos, generateFilename])

  // Generate preview based on current format
  const generatePreview = useCallback(() => {
    if (previewData.length === 0) {
      const matches = matchPhotos()
      setPreviewData(matches)

      if (matches.length > 0) {
        if (unmatchedCount > 0) {
          toast({
            title: "警告",
            description: `有${unmatchedCount}张照片未匹配到Excel数据`,
            variant: "warning",
          })
        } else {
          toast({
            title: "成功",
            description: `所有照片已成功匹配`,
          })
        }
      }
    } else {
      // Update existing preview with new format
      const updatedPreview = previewData.map((item) => {
        if (!item.matched) return item

        const newName = generateFilename(item.matchedRow!, item.originalName)

        return {
          ...item,
          newName,
        }
      })

      setPreviewData(updatedPreview)

      toast({
        title: "成功",
        description: "预览已更新",
      })
    }
  }, [previewData, matchPhotos, unmatchedCount, generateFilename])

  // Process and download renamed photos
  const processPhotos = useCallback(async () => {
    if (previewData.length === 0) {
      toast({
        title: "错误",
        description: "请先生成预览",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create a zip file containing all renamed photos
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Create folders for matched and unmatched photos
      const matchedFolder = zip.folder("已匹配")
      const unmatchedFolder = zip.folder("未匹配")

      // Add each photo to the zip with its new name
      for (const item of previewData) {
        if (item.matched) {
          matchedFolder?.file(item.newName, item.photo)
        } else {
          unmatchedFolder?.file(item.originalName, item.photo)
        }
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const link = document.createElement("a")
      link.href = url
      link.download = "renamed_photos.zip"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "成功",
        description: "照片已重命名并打包下载",
      })
    } catch (error) {
      toast({
        title: "错误",
        description: "处理照片失败",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [previewData])

  return {
    excelData,
    columns,
    photos,
    filenameColumn,
    customFormat,
    formatParts,
    previewData,
    matchedCount,
    unmatchedCount,
    isProcessing,
    selectedColumn,
    handleExcelUpload,
    handlePhotoUpload,
    setFilenameColumn,
    setFormatParts,
    setSelectedColumn,
    generatePreview,
    processPhotos,
  }
}
