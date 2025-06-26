"use client"

import { useState } from "react"
import { Plus, X, GripVertical, Eye, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUpload from "./image-upload"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  maxSize?: number
  acceptedTypes?: string[]
  disabled?: boolean
  className?: string
}

interface ImageItem {
  url: string
  alt?: string
  caption?: string
}

export default function ImageGallery({
  value = [],
  onChange,
  maxImages = 5,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
  className
}: ImageGalleryProps) {
  const [showUpload, setShowUpload] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleImageAdd = (url: string) => {
    onChange([...value, url])
    setShowUpload(false)
  }

  const handleImageRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...value]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  const handleImageReplace = (index: number, newUrl: string) => {
    const newImages = [...value]
    newImages[index] = newUrl
    onChange(newImages)
    setEditingIndex(null)
  }

  const canAddMore = value.length < maxImages

  return (
    <div className={cn("space-y-4", className)}>
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={`${url}-${index}`} className="relative group">
              <CardContent className="p-2">
                <div className="relative">
                  <img
                    src={url}
                    alt={`Business image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md cursor-pointer"
                    onClick={() => setPreviewImage(url)}
                  />
                  {!disabled && (
                    <>
                      <div className="absolute top-1 left-1 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 bg-black/50 hover:bg-black/70"
                          onClick={() => setPreviewImage(url)}
                        >
                          <Eye className="h-3 w-3 text-white" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 bg-black/50 hover:bg-black/70"
                          onClick={() => setEditingIndex(index)}
                        >
                          <Edit3 className="h-3 w-3 text-white" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleImageRemove(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Reorder button */}
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="absolute bottom-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
                          onClick={() => handleImageReorder(index, index - 1)}
                        >
                          <GripVertical className="h-3 w-3 text-white" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Replace Dialog */}
      <Dialog open={editingIndex !== null} onOpenChange={() => setEditingIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Image</DialogTitle>
          </DialogHeader>
          {editingIndex !== null && (
            <div className="space-y-4">
              <div>
                <Label>Current Image</Label>
                <img
                  src={value[editingIndex]}
                  alt="Current"
                  className="w-full h-32 object-cover rounded-md mt-2"
                />
              </div>
              <div>
                <Label>Upload New Image</Label>
                <ImageUpload
                  onChange={(url) => url && handleImageReplace(editingIndex, url)}
                  maxSize={maxSize}
                  acceptedTypes={acceptedTypes}
                  placeholder="Upload replacement image"
                  disabled={disabled}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showUpload ? (
        <div className="space-y-2">
          <ImageUpload
            onChange={(url) => url && handleImageAdd(url)}
            maxSize={maxSize}
            acceptedTypes={acceptedTypes}
            placeholder="Add business image"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUpload(false)}
            disabled={disabled}
          >
            Cancel
          </Button>
        </div>
      ) : (
        canAddMore && !disabled && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUpload(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image ({value.length}/{maxImages})
          </Button>
        )
      )}
    </div>
  )
}