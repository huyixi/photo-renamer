"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ExcelRow } from "@/types"

interface ColumnValuesListProps {
  columnName: string
  excelData: ExcelRow[]
}

export default function ColumnValuesList({ columnName, excelData }: ColumnValuesListProps) {
  // Extract unique values from the column
  const uniqueValues = Array.from(new Set(excelData.map((row) => row[columnName])))

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>"{columnName}" 列的值</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>序号</TableHead>
                <TableHead>值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueValues.map((value, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <p className="text-sm text-muted-foreground mt-2">共 {uniqueValues.length} 个不同的值</p>
      </CardContent>
    </Card>
  )
}
