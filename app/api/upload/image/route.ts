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