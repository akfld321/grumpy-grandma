import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'paid', 'free', or null (all)
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabase
            .from('saju_results')
            .select('id, created_at, ai_result') // Select minimal fields
            .order('created_at', { ascending: false })
            .limit(limit);

        // Fetch Data
        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Processing & Filtering in Application Layer (since JSON filtering has limitations in simple client)
        // Ideally we filter in DB, but ai_result is JSONB.

        const users = data.map((row: any) => {
            const r = row.ai_result || {};
            return {
                id: row.id,
                created_at: row.created_at,
                name: r.userName || 'Unknown',
                isPaid: !!r.isPaidResult,
                birth: r.sajuKey ? `${r.sajuKey.year}-${r.sajuKey.month}-${r.sajuKey.day}` : '-',
                phone: r.userPhone || '-',
                amount: r.isPaidResult ? 29800 : 0
            };
        });

        let filtered = users;
        if (type === 'paid') {
            filtered = users.filter((u: any) => u.isPaid);
        } else if (type === 'free') {
            filtered = users.filter((u: any) => !u.isPaid);
        }

        return NextResponse.json(filtered);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
