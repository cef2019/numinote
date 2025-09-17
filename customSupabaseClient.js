import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvhqvulslzayxryvramu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aHF2dWxzbHpheXhyeXZyYW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjY4MTEsImV4cCI6MjA3MDg0MjgxMX0.rPYzOcm7VgsF8Dbe6exszHBliVhFYtuzM0Z97pcTZHE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);