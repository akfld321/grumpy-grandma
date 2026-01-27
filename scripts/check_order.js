
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrder() {
    console.log("Checking Order ID: d8a3f934-0167-4769-92fb-5a333d5598f5");
    const { data, error } = await supabase
        .from('saju_results')
        .select('*')
        .eq('id', 'd8a3f934-0167-4769-92fb-5a333d5598f5')
        .single();

    if (error) {
        console.error("Fetch Error:", error);
    } else {
        console.log("Is PaidResult?", data.ai_result?.isPaidResult);
        console.log("Full AI Result Keys:", Object.keys(data.ai_result || {}));
    }
}

checkOrder();
