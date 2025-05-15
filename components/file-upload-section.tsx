"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, ImageIcon } from "lucide-react"
import type { ChangeEvent } from "react"
import type { ExcelRow } from "@/types"

interface FileUploadSectionProps {
  excelData: ExcelRow[]
  photos: File[]
  onExcelUpload: (e: ChangeEvent<HTMLInputElement>) => void
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FileUploadSection({ excelData, photos, onExcelUpload, onPhotoUpload }: FileUploadSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Excel Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            上传Excel文件
          </CardTitle>
          <CardDescription>上传包含姓名、身份证号等信息的Excel文件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="excel-upload">Excel文件</Label>
            <Input id="excel-upload" type="file" accept=".xlsx,.xls" onChange={onExcelUpload} />
          </div>
        </CardContent>
        <CardFooter>
          {excelData.length > 0 && <p className="text-sm text-muted-foreground">已加载 {excelData.length} 条数据</p>}
        </CardFooter>
      </Card>

      {/* Photos Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            上传照片
          </CardTitle>
          <CardDescription>上传需要重命名的照片文件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="photo-upload">照片文件</Label>
            <Input id="photo-upload" type="file" accept="image/*" multiple onChange={onPhotoUpload} />
          </div>
        </CardContent>
        <CardFooter>
          {photos.length > 0 && <p className="text-sm text-muted-foreground">已加载 {photos.length} 张照片</p>}
        </CardFooter>
      </Card>
    </div>
  )
}
