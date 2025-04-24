import { createClient } from '@supabase/supabase-js';

// Use environment variables or define them here (for demo purposes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nmpumsnblyyrzakdphxd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcHVtc25ibHl5cnpha2RwaHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzODcwMTMsImV4cCI6MjA2MDk2MzAxM30.L3OW9jM3Ge0HjAvmuqHxEEOgEeQv0pdwAJWGvWuKsXE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;