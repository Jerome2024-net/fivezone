
const path = require('path');
const dotenv = require('dotenv');

// Load .env first
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Override with .env.local if exists
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('🔄 Testing Supabase Connection...');
  console.log(`URL: ${supabaseUrl}`);
  // Hide key for security in logs, just show first few chars
  console.log(`Key: ${supabaseKey.substring(0, 5)}...`);

  // 1. List Buckets
  console.log('\n--- 1. Testing List Buckets ---');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ Failed to list buckets:', bucketsError.message);
    if (bucketsError.message.includes('Invalid API Key')) {
        console.error('👉 TIP: check if your ANON KEY is correct.');
    }
  } else {
    console.log('✅ Buckets listed successfully:');
    buckets.forEach(b => console.log(` - ${b.name}`));
    
    const uploadsBucket = buckets.find(b => b.name === 'uploads');
    if (!uploadsBucket) {
        console.error('❌ "uploads" bucket NOT FOUND. Please create a public bucket named "uploads".');
    } else {
        console.log('✅ "uploads" bucket found.');
    }
  }

  // 2. Test Upload
  console.log('\n--- 2. Testing Upload to "uploads" ---');
  const fileName = `test-upload-${Date.now()}.txt`;
  const fileContent = 'This is a test file from the diagnostic script.';
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, fileContent, {
        contentType: 'text/plain',
        upsert: true
    });

  if (uploadError) {
      console.error('❌ Upload Failed:', uploadError);
      if (uploadError.message.includes('row-level security')) {
          console.error('👉 TIP: This is an RLS (Policy) issue. You need to enable PUBLIC INSERT on the "uploads" bucket.');
      }
      if (uploadError.message.includes('The resource was not found')) {
          console.error('👉 TIP: The bucket "uploads" might not exist.');
      }
  } else {
      console.log('✅ Upload Successful!', uploadData);
      
      // 3. Test Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);
      console.log('✅ Generated Public URL:', publicUrl);
      
      // Clean up
      console.log('🧹 Cleaning up test file...');
      await supabase.storage.from('uploads').remove([fileName]);
  }
}

testSupabase();
