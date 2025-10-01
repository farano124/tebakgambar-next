import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface RouteParams {
  params: Promise<{
    filename: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const resolvedParams = await params
    const filename = resolvedParams.filename

    // Validate filename (should be number.jpg)
    if (!/^\d+\.jpg$/.test(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    // Path to the original images directory
    const imagePath = path.join(process.cwd(), '..', 'img', filename)

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      // Return a placeholder or default image
      const placeholderPath = path.join(process.cwd(), 'public', 'placeholder-image.jpg')
      if (fs.existsSync(placeholderPath)) {
        const imageBuffer = fs.readFileSync(placeholderPath)
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000',
          },
        })
      }

      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Read and serve the image
    const imageBuffer = fs.readFileSync(imagePath)

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })

  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}