import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
    if (process.env.NODE_ENV === 'production') {
        console.error("❌ CRTICAL: Missing Supabase Admin Keys in Production!");
    } else {
        console.warn("⚠️ Missing Supabase Admin Keys (Service Role). DB operations may fail.");
    }
}

// Create a client with the SERVICE ROLE key (Admin privileges, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
