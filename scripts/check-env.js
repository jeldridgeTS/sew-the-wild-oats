// Simple script to check if .env.local file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
console.log('Checking for .env.local file at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  // Read file content (don't log sensitive values)
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  console.log(`Found ${lines.length} configuration lines.`);
  
  const supabaseUrlExists = content.includes('NEXT_PUBLIC_SUPABASE_URL=');
  const supabaseKeyExists = content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
  const supabaseServiceRoleExists = content.includes('SUPABASE_SERVICE_ROLE_KEY=');
  
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrlExists ? '✅ Found' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKeyExists ? '✅ Found' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleExists ? '✅ Found' : '❌ Missing');
  
  if (!supabaseUrlExists || !supabaseKeyExists || !supabaseServiceRoleExists) {
    console.log('\nMissing required Supabase environment variables.');
    console.log('Your .env.local file should contain:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (for admin operations)');
  }
} else {
  console.log('❌ .env.local file is missing!');
  console.log('\nYou need to create a .env.local file in the root of your project with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (for admin operations)');
}
