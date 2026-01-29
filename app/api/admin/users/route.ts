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
        const type = searchParams.get('type'); // 'paid', 'free', 'all'
        const limit = parseInt(searchParams.get('limit') || '100');
        const search = searchParams.get('search') || '';

        let query = supabaseAdmin
            .from('saju_results')
            .select('id, created_at, user_name, ai_result')
            .order('created_at', { ascending: false })
            .limit(limit);

        // Fetch Data
        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

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
                // Check refund status
                isRefunded: !!r.isRefunded,
                birth: r.sajuKey ? `${r.sajuKey.year}-${r.sajuKey.month}-${r.sajuKey.day}` : '-',
                phone: realPhone,
                amount: r.isPaidResult ? 29800 : 0
            };
        });

        let filtered = users;

        // Type Filter
        if (type === 'paid') {
            filtered = users.filter((u: any) => u.isPaid);
        } else if (type === 'free') {
            filtered = users.filter((u: any) => !u.isPaid);
        }

        // Search Filter (Client-side logic required due to encryption)
        if (search) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter((u: any) =>
                u.name.toLowerCase().includes(lowerSearch) ||
                u.phone.includes(search)
            );
        }

        return NextResponse.json(filtered);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // AUTHENTICATION CHECK
        const authHeader = req.headers.get('x-admin-key');
        const adminSecret = process.env.ADMIN_SECRET_KEY;

        if (!adminSecret || authHeader !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
        }

        const body = await req.json();
        const { id, isRefunded } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        // 1. Fetch current data to preserve other fields
        const { data: current, error: fetchError } = await supabaseAdmin
            .from('saju_results')
            .select('ai_result')
            .eq('id', id)
            .single();

        if (fetchError || !current) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Update JSON
        const newAiResult = {
            ...current.ai_result,
            isRefunded: isRefunded // true or false
        };

        const { error: updateError } = await supabaseAdmin
            .from('saju_results')
            .update({ ai_result: newAiResult })
            .eq('id', id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
