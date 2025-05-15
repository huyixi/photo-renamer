"use client"
import { Toaster } from "@/components/ui/toaster"
import FileUploadSection from "@/components/file-upload-section"
import FilenameColumnSelector from "@/components/filename-column-selector"
import FormatSelector from "@/components/format-selector"
import PhotoPreview from "@/components/photo-preview"
import PhotoGallery from "@/components/photo-gallery"
import ColumnValuesList from "@/components/column-values-list"
import { usePhotoRenamer } from "@/hooks/use-photo-renamer"

export default function PhotoRenamerApp() {
  const {
    excelData,
    columns,
    photos,
    filenameColumn,
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
  } = usePhotoRenamer()

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">照片批量重命名工具</h1>

      <FileUploadSection
        excelData={excelData}
        photos={photos}
        onExcelUpload={handleExcelUpload}
        onPhotoUpload={handlePhotoUpload}
      />

      {photos.length > 0 && <PhotoGallery photos={photos} />}

      {columns.length > 0 && (
        <FilenameColumnSelector columns={columns} filenameColumn={filenameColumn} onColumnSelect={setFilenameColumn} />
      )}

      {columns.length > 0 && (
        <FormatSelector
          columns={columns}
          formatParts={formatParts}
          excelData={excelData}
          onFormatPartsChange={setFormatParts}
          onColumnSelect={setSelectedColumn}
        />
      )}

      {selectedColumn && excelData.length > 0 && <ColumnValuesList columnName={selectedColumn} excelData={excelData} />}

      {previewData.length > 0 && (
        <PhotoPreview
          previewData={previewData}
          matchedCount={matchedCount}
          unmatchedCount={unmatchedCount}
          isProcessing={isProcessing}
          onDownload={processPhotos}
        />
      )}

      {columns.length > 0 && photos.length > 0 && previewData.length === 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={generatePreview}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            disabled={!filenameColumn}
          >
            匹配照片并生成预览
          </button>
        </div>
      )}

      <Toaster />
    </main>
  )
}
