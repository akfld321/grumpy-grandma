import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // DELETE records older than 30 days
        // Postgres: created_at < NOW() - INTERVAL '30 days'
        // Supabase JS: lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const { count, error } = await supabaseAdmin
            .from('saju_results')
            .delete({ count: 'exact' })
            .lt('created_at', thirtyDaysAgo);

        if (error) {
            console.error('Cleanup Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`[Cron] Cleaned up ${count} old records.`);
        return NextResponse.json({ success: true, deletedCount: count });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
