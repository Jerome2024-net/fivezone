
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore if exists
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const filepath = path.join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Server upload failed" }, { status: 500 })
  }
}
