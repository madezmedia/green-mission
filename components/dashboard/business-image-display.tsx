"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Image as ImageIcon, Eye, Edit3 } from "lucide-react"
import Image from "next/image"

interface BusinessImageDisplayProps {
  logo?: string
  businessImages?: string[]
  businessName?: string
  onEditClick?: () => void
}

export default function BusinessImageDisplay({
  logo,
  businessImages = [],
  businessName = "Your Business",
  onEditClick
}: BusinessImageDisplayProps) {
  const hasImages = logo || businessImages.length > 0

  if (!hasImages) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Business Images
            </CardTitle>
            {onEditClick && (
              <Button variant="outline" size="sm" onClick={onEditClick}>
                <Edit3 className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Add your business logo and photos to showcase your work</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Business Images
          </CardTitle>
          {onEditClick && (
            <Button variant="outline" size="sm" onClick={onEditClick}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Images
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Section */}
        {logo && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Business Logo</h4>
              <Badge variant="secondary">Logo</Badge>
            </div>
            <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
              <Image
                src={logo}
                alt={`${businessName} logo`}
                fill
                className="object-contain p-2"
                sizes="128px"
              />
            </div>
          </div>
        )}

        {/* Business Images Gallery */}
        {businessImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Business Gallery</h4>
              <Badge variant="secondary">{businessImages.length} image{businessImages.length !== 1 ? 's' : ''}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {businessImages.map((imageUrl, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="relative aspect-square border rounded-lg overflow-hidden bg-muted cursor-pointer group hover:ring-2 hover:ring-primary transition-all">
                      <Image
                        src={imageUrl}
                        alt={`${businessName} image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={imageUrl}
                        alt={`${businessName} image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {logo ? '1 logo' : 'No logo'} • {businessImages.length} gallery image{businessImages.length !== 1 ? 's' : ''}
            </span>
            <span>
              Total: {(logo ? 1 : 0) + businessImages.length} image{((logo ? 1 : 0) + businessImages.length) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}