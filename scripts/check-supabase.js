// Simple script to check Supabase connection
require('dotenv').config({ path: '.env.local' });

console.log('Checking Supabase configuration...');
console.log('--------------------------------');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
console.log('--------------------------------');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('ERROR: Supabase environment variables are missing!');
  console.log('Please create a .env.local file in the root of your project with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
} else {
  console.log('Environment variables appear to be configured correctly.');
  console.log('If you still have connection issues, verify that the values are correct.');
}
