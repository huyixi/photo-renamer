"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilenameColumnSelectorProps {
  columns: string[]
  filenameColumn: string
  onColumnSelect: (column: string) => void
}

export default function FilenameColumnSelector({
  columns,
  filenameColumn,
  onColumnSelect,
}: FilenameColumnSelectorProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>选择文件名列</CardTitle>
        <CardDescription>选择Excel中包含照片文件名的列</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={filenameColumn} onValueChange={onColumnSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择文件名列" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-2">
          请选择Excel中包含照片原始文件名的列，系统将根据此列匹配照片
        </p>
      </CardContent>
    </Card>
  )
}
