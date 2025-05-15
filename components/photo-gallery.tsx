"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PhotoGalleryProps {
  photos: File[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [thumbnails, setThumbnails] = useState<{ id: string; url: string; name: string }[]>([])

  useEffect(() => {
    // Create thumbnails for all photos
    const newThumbnails = photos.map((photo) => {
      const url = URL.createObjectURL(photo)
      return {
        id: `${photo.name}-${photo.size}`,
        url,
        name: photo.name,
      }
    })

    setThumbnails(newThumbnails)

    // Clean up object URLs when component unmounts or photos change
    return () => {
      thumbnails.forEach((thumbnail) => URL.revokeObjectURL(thumbnail.url))
    }
  }, [photos])

  if (photos.length === 0) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>已上传照片 ({photos.length}张)</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {thumbnails.map((thumbnail) => (
              <div key={thumbnail.id} className="flex flex-col items-center">
                <div className="relative w-full aspect-square overflow-hidden rounded-md border">
                  <img
                    src={thumbnail.url || "/placeholder.svg"}
                    alt={thumbnail.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-xs text-center mt-1 truncate w-full" title={thumbnail.name}>
                  {thumbnail.name}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
