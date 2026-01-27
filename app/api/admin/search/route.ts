import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { password, query } = body;

        // 1. Simple Auth
        if (password !== 'grandma1234') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Search DB (Case insensitive pattern matching OR fetch recent)
        let queryBuilder = supabase
            .from('saju_results')
            .select('id, user_name, birth_data, created_at, ai_result') // Fetch AI Result for status check
            .order('created_at', { ascending: false })
            .limit(50);

        if (query) {
            console.log(`🔍 Admin Search Query: ${query}`);
            queryBuilder = queryBuilder.ilike('user_name', `%${query}%`);
        } else {
            console.log("📋 Admin Fetching Recent 50");
        }
        const { data, error } = await queryBuilder;

        if (error) throw error;

        // Optimize payload: Extract only necessary fields + is_paid status
        const optimizedResults = data.map((row: any) => ({
            id: row.id,
            user_name: row.user_name,
            birth_data: row.birth_data,
            created_at: row.created_at,
            is_paid: row.ai_result?.isPaidResult === true
        }));

        return NextResponse.json({ results: optimizedResults });

    } catch (error: any) {
        console.error("Admin Search Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
