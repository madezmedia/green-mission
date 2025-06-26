# Image Management Implementation Guide

## Step-by-Step Implementation

### Step 1: Update Feature Flags System

#### File: `lib/feature-flags.ts`
Add new feature flags for image management:

```typescript
export interface FeatureFlags {
  /** Enable simplified dashboard mode with reduced complexity */
  simplifiedDashboard: boolean;
  
  /** Show advanced form fields and validation */
  advancedForm: boolean;
  
  /** Display sidebar navigation */
  sidebarNavigation: boolean;
  
  /** Enable Airtable synchronization features */
  airtableSync: boolean;
  
  /** Show sustainability metrics and reporting tab */
  sustainabilityTab: boolean;
  
  /** Display settings and configuration tab */
  settingsTab: boolean;
  
  /** Show directory visibility controls */
  directoryVisibility: boolean;
  
  /** Display membership tier information */
  membershipTierDisplay: boolean;
  
  /** Enable status management features */
  statusManagement: boolean;
  
  /** Enable advanced form validation */
  advancedValidation: boolean;
  
  /** Enable image management features */
  imageManagement: boolean;
  
  /** Enable advanced image features (multiple images, gallery) */
  advancedImageFeatures: boolean;
}
```

Update default configuration:
```typescript
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  simplifiedDashboard: true,
  advancedForm: false,
  sidebarNavigation: false,
  airtableSync: false,
  sustainabilityTab: false,
  settingsTab: false,
  directoryVisibility: false,
  membershipTierDisplay: false,
  statusManagement: false,
  advancedValidation: false,
  imageManagement: true,        // Enable basic image management
  advancedImageFeatures: false, // Disable advanced features in simplified mode
};
```

### Step 2: Update Configuration System

#### File: `lib/config.ts`
Add logo to essential fields:

```typescript
export const ESSENTIAL_FIELDS = [
  'businessName',
  'description', 
  'industry',
  'email',
  'city',
  'country',
  'website',
  'phone',
  'logo'  // Add logo as essential field
] as const;
```

Add image configuration interface:
```typescript
export interface ImageConfig {
  /** Whether image upload is enabled */
  enabled: boolean;
  /** Maximum file size in MB */
  maxSize: number;
  /** Accepted file types */
  acceptedTypes: string[];
  /** Maximum number of images */
  maxImages: number;
  /** Whether multiple images are allowed */
  allowMultiple: boolean;
}
```

Update dashboard configuration:
```typescript
export interface DashboardConfig {
  /** Feature flags that drive the configuration */
  features: FeatureFlags;
  /** Form-related configuration */
  form: FormConfig;
  /** Layout-related configuration */
  layout: LayoutConfig;
  /** Feature-specific settings */
  featureSettings: FeaturesConfig;
  /** Image management configuration */
  images: ImageConfig;
  /** Whether dashboard is in simplified mode */
  isSimplified: boolean;
}
```

Add image configuration function:
```typescript
function getImageConfig(flags: FeatureFlags): ImageConfig {
  return {
    enabled: flags.imageManagement,
    maxSize: 5, // 5MB for logos
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxImages: flags.advancedImageFeatures ? 6 : 1, // 1 logo + 5 business images
    allowMultiple: flags.advancedImageFeatures,
  };
}
```

### Step 3: Create Image Upload Components

#### File: `components/ui/image-upload.tsx`
Core image upload component with drag-and-drop:

```typescript
"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  maxSize?: number // in MB
  acceptedTypes?: string[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  placeholder = "Upload an image",
  disabled = false,
  className
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${acceptedTypes.join(', ')}`
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size too large. Maximum size: ${maxSize}MB`
    }
    
    return null
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload to API endpoint
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const { url } = await response.json()
      onChange(url)
    } catch (error) {
      setError('Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    const validationError = validateFile(file)
    
    if (validationError) {
      setError(validationError)
      return
    }
    
    uploadFile(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled) return
    
    handleFileSelect(e.dataTransfer.files)
  }, [disabled, handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={value}
                alt="Uploaded image"
                className="w-full h-32 object-cover rounded-md"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragging && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-destructive"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-muted p-3">
                    {isDragging ? (
                      <Upload className="h-6 w-6 text-primary" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isDragging ? "Drop image here" : placeholder}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max {maxSize}MB • {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
```

#### File: `components/ui/image-gallery.tsx`
Advanced image gallery component for multiple images:

```typescript
"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

  const handleImageAdd = (url: string) => {
    onChange([...value, url])
    setShowUpload(false)
  }

  const handleImageRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(value)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onChange(items)
  }

  const canAddMore = value.length < maxImages

  return (
    <div className={cn("space-y-4", className)}>
      {value.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {value.map((url, index) => (
                  <Draggable key={url} draggableId={url} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "relative group",
                          snapshot.isDragging && "shadow-lg"
                        )}
                      >
                        <CardContent className="p-2">
                          <div className="relative">
                            <img
                              src={url}
                              alt={`Business image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            {!disabled && (
                              <>
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute top-1 left-1 p-1 bg-black/50 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <GripVertical className="h-3 w-3 text-white" />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleImageRemove(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

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
```

### Step 4: Update Business Listing Form

#### File: `components/dashboard/business-listing-form.tsx`
Add image fields to the form interface and Basic Info tab:

```typescript
// Add to BusinessListing interface
interface BusinessListing {
  id?: string
  businessName: string
  description: string
  industry: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  sustainabilityPractices: string
  certifications: string
  membershipTier: string
  directoryVisibility: boolean
  status: "Active" | "Pending" | "Inactive"
  lastSynced?: string
  logo?: string                    // Add logo field
  businessImages?: string[]        // Add business images field
}

// Add to Basic Info tab after website field
<div>
  <Label htmlFor="logo">Business Logo</Label>
  <ImageUpload
    value={formData.logo}
    onChange={(url) => handleInputChange("logo", url || "")}
    maxSize={config.images.maxSize}
    acceptedTypes={config.images.acceptedTypes}
    placeholder="Upload your business logo"
    disabled={saving}
  />
</div>

// Add new tab for images in advanced mode
{config.features.advancedImageFeatures && (
  <TabsTrigger value="images">Images</TabsTrigger>
)}

// Add images tab content
{config.features.advancedImageFeatures && (
  <TabsContent value="images" className="space-y-4">
    <div>
      <Label>Business Images</Label>
      <p className="text-sm text-muted-foreground mb-4">
        Add photos of your business, products, or services to showcase your work.
      </p>
      <ImageGallery
        value={formData.businessImages || []}
        onChange={(urls) => handleInputChange("businessImages", urls)}
        maxImages={5}
        maxSize={10}
        disabled={saving}
      />
    </div>
  </TabsContent>
)}
```

### Step 5: Create Image Upload API

#### File: `app/api/upload/image/route.ts`
API endpoint for handling image uploads:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB for logos, 10MB for business images)
    const maxSize = file.type === 'image/svg+xml' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // For now, we'll use a simple approach and return a placeholder URL
    // In production, you would upload to Cloudinary, Vercel Blob, or similar
    
    // Convert file to base64 for temporary storage (not recommended for production)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    // TODO: Replace with actual cloud storage upload
    // const uploadResult = await cloudinary.uploader.upload(dataUrl, {
    //   folder: `green-mission/${userId}`,
    //   resource_type: "auto"
    // })
    
    return NextResponse.json({ 
      url: dataUrl, // In production, return uploadResult.secure_url
      message: "Image uploaded successfully" 
    })
    
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
```

### Step 6: Update Business Listing API

#### File: `app/api/business-listing/route.ts`
Update the API to handle image fields:

```typescript
// Update mapToAirtableFormat function
function mapToAirtableFormat(formData: any, userId: string) {
  const mappedData: any = {
    "Business Name": formData.businessName,
    "Business Description": formData.description,
    "Website": formData.website,
    "Email": formData.email,
    "Phone": formData.phone,
    "Business Address": formData.address,
    "City": formData.city,
    "State": formData.state,
    "Membership Status": formData.status || "Pending",
    "User ID": userId
  }

  // Handle logo upload
  if (formData.logo) {
    mappedData["Logo"] = [{ url: formData.logo }]
  }

  // Handle business images
  if (formData.businessImages && formData.businessImages.length > 0) {
    mappedData["Business Images"] = formData.businessImages.map((url: string) => ({ url }))
  }

  // ... rest of existing mapping logic

  return mappedData
}

// Update mapFromAirtableFormat function
function mapFromAirtableFormat(record: any) {
  if (!record || !record.fields) {
    console.error("Invalid record structure:", record)
    throw new Error("Invalid record structure")
  }
  
  const fields = record.fields
  
  return {
    id: record.id,
    businessName: fields["Business Name"] || "",
    description: fields["Business Description"] || "",
    industry: "", // Will be mapped from Industry Category
    website: fields["Website"] || "",
    email: fields["Email"] || "",
    phone: fields["Phone"] || "",
    address: fields["Business Address"] || "",
    city: fields["City"] || "",
    state: fields["State"] || "",
    country: "", // Not in current schema
    sustainabilityPractices: fields["Sustainability Practices"] || "",
    certifications: (fields["Certifications"] || []).join(", "),
    membershipTier: "Basic", // Default value
    directoryVisibility: fields["Directory Visibility"] !== false,
    status: fields["Membership Status"] || "Pending",
    lastSynced: new Date().toISOString(),
    logo: fields["Logo"] && fields["Logo"][0] ? fields["Logo"][0].url : "",
    businessImages: fields["Business Images"] ? fields["Business Images"].map((img: any) => img.url) : []
  }
}
```

### Step 7: Install Required Dependencies

Add to package.json:
```json
{
  "dependencies": {
    "@hello-pangea/dnd": "^16.5.0"
  }
}
```

Run: `npm install @hello-pangea/dnd`

### Step 8: Testing Checklist

#### Phase 1 Testing
- [ ] Logo upload works in Basic Info tab
- [ ] Image validation (file type, size) works
- [ ] Images display correctly in form
- [ ] Images save to Airtable properly
- [ ] Error handling works for failed uploads
- [ ] Mobile responsive design

#### Phase 2 Testing
- [ ] Multiple image upload works
- [ ] Image gallery displays correctly
- [ ] Drag and drop reordering works
- [ ] Image deletion works
- [ ] Maximum image limit enforced
- [ ] Advanced features hidden in simplified mode

### Step 9: Production Considerations

#### Cloud Storage Integration
For production, replace the base64 approach with proper cloud storage:

1. **Cloudinary Integration**:
```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadResult = await cloudinary.uploader.upload(dataUrl, {
  folder: `green-mission/${userId}`,
  resource_type: "auto",
  transformation: [
    { width: 800, height: 600, crop: "limit" },
    { quality: "auto" },
    { format: "auto" }
  ]
})
```

2. **Vercel Blob Storage**:
```typescript
import { put } from '@vercel/blob'

const blob = await put(`green-mission/${userId}/${file.name}`, file, {
  access: 'public',
})
```

#### Environment Variables
Add to `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

This implementation provides a complete image management system that integrates seamlessly with the existing simplified dashboard while preserving advanced features for future activation.