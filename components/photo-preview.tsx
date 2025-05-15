"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Upload, LoaderCircle } from "lucide-react"
import type { PhotoMatch } from "@/types"

interface PhotoPreviewProps {
  previewData: PhotoMatch[]
  matchedCount: number
  unmatchedCount: number
  isProcessing: boolean
  onDownload: () => Promise<void>
}

export default function PhotoPreview({
  previewData,
  matchedCount,
  unmatchedCount,
  isProcessing,
  onDownload,
}: PhotoPreviewProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>重命名预览</CardTitle>
        <CardDescription>预览重命名后的文件名</CardDescription>
      </CardHeader>
      <CardContent>
        {unmatchedCount > 0 && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>有 {unmatchedCount} 张照片未能匹配到Excel数据，这些照片将保持原文件名</AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>序号</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>原文件名</TableHead>
                <TableHead>重命名后</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.slice(0, 10).map((item, index) => (
                <TableRow key={index} className={item.matched ? "" : "bg-muted/50"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.matched ? "已匹配" : "未匹配"}</TableCell>
                  <TableCell className="font-mono text-sm">{item.originalName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.newName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {previewData.length > 10 && (
          <p className="text-sm text-muted-foreground mt-2">显示前10条，共 {previewData.length} 条</p>
        )}
        <div className="flex justify-between mt-4 text-sm">
          <span>已匹配: {matchedCount} 张照片</span>
          <span>未匹配: {unmatchedCount} 张照片</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onDownload} disabled={isProcessing} className="w-full">
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              处理中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              下载重命名后的照片
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
