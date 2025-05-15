"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FormatPart, ExcelRow } from "@/types"
import { applyFormatToData } from "@/lib/format-utils"

interface FormatSelectorProps {
  columns: string[]
  formatParts: FormatPart[]
  excelData: ExcelRow[]
  onFormatPartsChange: (parts: FormatPart[]) => void
  onColumnSelect: (column: string) => void
}

export default function FormatSelector({
  columns,
  formatParts,
  excelData,
  onFormatPartsChange,
  onColumnSelect,
}: FormatSelectorProps) {
  const [showCustomSeparator, setShowCustomSeparator] = useState(false)
  const [customSeparator, setCustomSeparator] = useState("")
  const [formatPreview, setFormatPreview] = useState<string>("(未设置格式)")
  const [hasFormatError, setHasFormatError] = useState(false)

  // Update format preview whenever format parts or excel data changes
  useEffect(() => {
    if (formatParts.length === 0 || excelData.length === 0) {
      setFormatPreview("(未设置格式)")
      setHasFormatError(false)
      return
    }

    const formatString = formatParts.map((part) => (part.type === "column" ? `{${part.value}}` : part.value)).join("")
    const preview = applyFormatToData(formatString, excelData[0])

    // Check if any placeholders remain in the preview
    const hasUnreplacedPlaceholders = /\{[^{}]+\}/.test(preview)
    setHasFormatError(hasUnreplacedPlaceholders)
    setFormatPreview(preview)
  }, [formatParts, excelData])

  // Add a column to the format parts
  const addColumnToParts = (column: string) => {
    onFormatPartsChange([...formatParts, { type: "column", value: column }])
    // Also notify parent about column selection
    onColumnSelect(column)
  }

  // Add a separator to the format parts
  const addSeparatorToParts = (separator: string) => {
    if (separator === "custom") {
      setShowCustomSeparator(true)
    } else {
      onFormatPartsChange([...formatParts, { type: "separator", value: separator }])
    }
  }

  // Add a custom separator to the format parts
  const addCustomSeparator = () => {
    if (customSeparator) {
      onFormatPartsChange([...formatParts, { type: "separator", value: customSeparator }])
      setCustomSeparator("")
      setShowCustomSeparator(false)
    }
  }

  // Remove a part from the format
  const removeFormatPart = (index: number) => {
    onFormatPartsChange(formatParts.filter((_, i) => i !== index))
  }

  // Get the format string from format parts
  const getFormatString = () => {
    return formatParts.map((part) => (part.type === "column" ? `{${part.value}}` : part.value)).join("")
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>自定义重命名格式</CardTitle>
        <CardDescription>选择字段和分隔符来构建重命名格式</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>当前格式</Label>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md">
              {formatParts.map((part, index) => (
                <div key={index} className="flex items-center gap-1 bg-muted p-1 rounded-md">
                  <span className="text-sm px-2">{part.type === "column" ? `{${part.value}}` : part.value}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFormatPart(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {formatParts.length === 0 && (
                <span className="text-sm text-muted-foreground">点击下方按钮添加字段和分隔符</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="add-column">添加字段</Label>
              <Select onValueChange={addColumnToParts}>
                <SelectTrigger id="add-column">
                  <SelectValue placeholder="选择字段" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="add-separator">添加分隔符</Label>
              <Select onValueChange={addSeparatorToParts}>
                <SelectTrigger id="add-separator">
                  <SelectValue placeholder="选择分隔符" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">下划线 (_)</SelectItem>
                  <SelectItem value="-">连字符 (-)</SelectItem>
                  <SelectItem value=".">点 (.)</SelectItem>
                  <SelectItem value=" ">空格 ( )</SelectItem>
                  <SelectItem value="custom">自定义...</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showCustomSeparator && (
            <div>
              <Label htmlFor="custom-separator">自定义分隔符</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-separator"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  className="flex-1"
                  placeholder="输入自定义分隔符"
                />
                <Button onClick={addCustomSeparator}>添加</Button>
              </div>
            </div>
          )}

          <div className="bg-muted p-3 rounded-md">
            <Label>格式模板</Label>
            <p className="font-mono mt-1">{getFormatString() || "(未设置格式)"}</p>

            {formatParts.length > 0 && excelData.length > 0 && (
              <>
                <Label className="mt-3">示例预览</Label>
                <p className="font-mono mt-1">{formatPreview}</p>

                {hasFormatError && (
                  <Alert variant="warning" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      格式预览中存在未替换的占位符，请检查Excel列名是否与格式中的字段名匹配
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
