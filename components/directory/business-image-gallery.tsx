"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface BusinessImageGalleryProps {
  images: string[]
  businessName: string
  className?: string
}

export default function BusinessImageGallery({ 
  images, 
  businessName, 
  className 
}: BusinessImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setSelectedImage(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Business Gallery</h3>
      
      {/* Main featured image */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <img
                  src={images[0]}
                  alt={`${businessName} - Main image`}
                  className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                    +{images.length - 1} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <img
              src={images[selectedImage || 0]}
              alt={`${businessName} - Image ${(selectedImage || 0) + 1}`}
              className="h-auto max-h-[80vh] w-full object-contain"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-sm text-white">
                  {(selectedImage || 0) + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnail grid for additional images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={image}
                        alt={`${businessName} - Image ${index + 2}`}
                        className="h-full w-full object-cover"
                      />
                      {index === 3 && images.length > 5 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                          <span className="text-sm font-medium">
                            +{images.length - 5} more
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="relative">
                  <img
                    src={images[index + 1]}
                    alt={`${businessName} - Image ${index + 2}`}
                    className="h-auto max-h-[80vh] w-full object-contain"
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                        onClick={() => setSelectedImage(index === 0 ? images.length - 1 : index)}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                        onClick={() => setSelectedImage(index + 2 >= images.length ? 0 : index + 2)}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-sm text-white">
                        {index + 2} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  )
}