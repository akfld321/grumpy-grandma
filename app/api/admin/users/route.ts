import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { decrypt } from '@/lib/crypto';

export async function GET(req: NextRequest) {
    try {
        // AUTHENTICATION CHECK
        const authHeader = req.headers.get('x-admin-key');
        const adminSecret = process.env.ADMIN_SECRET_KEY;

        if (!adminSecret || authHeader !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'paid', 'free', or null (all)
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabaseAdmin
            .from('saju_results')
            .select('id, created_at, user_name, ai_result') // Select minimal fields
            .order('created_at', { ascending: false })
            .limit(limit);

        // Fetch Data
        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Processing & Filtering in Application Layer (since JSON filtering has limitations in simple client)
        // Ideally we filter in DB, but ai_result is JSONB.

        // ...

        const users = data.map((row: any) => {
            const r = row.ai_result || {};
            // Decrypt Name
            const realName = decrypt(row.user_name || r.userName || 'Unknown');
            // Decrypt Phone if present
            const realPhone = r.userPhone ? decrypt(r.userPhone) : '-';

            return {
                id: row.id,
                created_at: row.created_at,
                name: realName,
                isPaid: !!r.isPaidResult,
                birth: r.sajuKey ? `${r.sajuKey.year}-${r.sajuKey.month}-${r.sajuKey.day}` : '-',
                phone: realPhone,
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
