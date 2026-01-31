
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import path from 'path'
import * as dotenv from 'dotenv'

// Force load env vars from file system to fallback if Next.js loader misses them
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Force dynamic to prevent static caching of env vars
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Ensure we have credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Debug Log (will show in terminal)
    console.log("Supabase Config Check:", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey, 
        urlStart: supabaseUrl ? supabaseUrl.substring(0, 10) : 'N/A' 
    });

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase Credentials in API Route")
        return NextResponse.json({ error: 'Configuration serveur manquante (Supabase). Vérifiez les logs serveur.' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
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
