const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Testing Supabase Connection...");
console.log("URL:", supabaseUrl);
console.log("Key Length:", supabaseKey ? supabaseKey.length : 0);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Try to select from the table we (hopefully) created
        const { data, error } = await supabase.from('saju_results').select('count', { count: 'exact', head: true });

        if (error) {
            console.error("Connection Error:", error.message);
            console.error("Details:", error);
        } else {
            console.log("Connection Successful!");
            console.log("Table 'saju_results' exists/accessible.");
        }
    } catch (e) {
        console.error("Unexpected Error:", e);
    }
}

testConnection();
