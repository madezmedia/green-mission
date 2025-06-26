"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUpload from "@/components/ui/image-upload"
import ImageGallery from "@/components/ui/image-gallery"

export default function ImageTestPage() {
  const [logo, setLogo] = useState<string>("")
  const [businessImages, setBusinessImages] = useState<string[]>([])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Image Management Test</h1>
        <p className="text-muted-foreground">
          Test the image upload and gallery functionality for the dashboard
        </p>
      </div>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logo">Logo Upload</TabsTrigger>
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={logo}
                onChange={(url) => setLogo(url || "")}
                maxSize={5}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                placeholder="Upload your business logo"
              />
              {logo && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Current Logo URL:</p>
                  <p className="text-xs text-muted-foreground break-all">{logo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Images Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                value={businessImages}
                onChange={setBusinessImages}
                maxImages={5}
                maxSize={10}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              />
              {businessImages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Current Images ({businessImages.length}):</p>
                  <div className="text-xs text-muted-foreground space-y-1 mt-2">
                    {businessImages.map((url, index) => (
                      <div key={index} className="break-all">
                        {index + 1}. {url.substring(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Logo:</span> {logo ? "✅ Uploaded" : "❌ Not set"}
            </div>
            <div>
              <span className="font-medium">Gallery:</span> {businessImages.length} images
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">How it works:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
              <li>• Images are uploaded to <code>/api/upload/image</code></li>
              <li>• Currently using base64 data URLs (for development)</li>
              <li>• In production, would use cloud storage (Cloudinary, Vercel Blob, etc.)</li>
              <li>• Logo and business images are stored in Airtable fields</li>
              <li>• Dashboard form includes these components in the Images tab</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}