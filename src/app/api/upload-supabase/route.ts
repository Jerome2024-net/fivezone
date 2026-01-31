
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Force dynamic to prevent static caching
export const dynamic = 'force-dynamic'

// Fallback values (NEXT_PUBLIC are safe to expose)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://klvquwlfknonzjczrljp.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ODKqeznVSqBKwHe78jjBnQ__jLAmMT1'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    
    // Sanitize filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Upload to 'uploads' bucket
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
       console.error("Supabase API Upload Error:", error)
       return NextResponse.json({ error: `Erreur Supabase: ${error.message}` }, { status: 500 })
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })

  } catch (error: any) {
    console.error("Proxy Upload Error:", error)
    return NextResponse.json({ error: error.message || "Erreur interne serveur" }, { status: 500 })
  }
}
