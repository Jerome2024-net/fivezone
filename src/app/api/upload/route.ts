import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Aucun fichier téléchargé' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `uploads/${filename}`);
    
    // Upload the file
    // metadata makes it viewable in browser if content-type is set correctly
    const metadata = {
        contentType: file.type,
    };
    
    await uploadBytes(storageRef, buffer, metadata);
    
    // Get the public URL
    const publicUrl = await getDownloadURL(storageRef);
    
    return NextResponse.json({ success: true, activeUrl: publicUrl });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Échec du téléchargement: ' + error.message }, { status: 500 });
  }
}
