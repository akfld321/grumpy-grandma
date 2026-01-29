import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// COST CONFIGURATION
// Gemini 1.5 Flash Price (Approx): Input $0.075 / 1M, Output $0.30 / 1M
// We'll average to $0.20 / 1M for simplicity, then multiply by 10 as requested.
// 1M Tokens = $0.20
// 1 Token = $0.0000002
// x10 Safety Margin = $0.000002 per token
// Exchange Rate: 1450 KRW
const COST_PER_TOKEN_KRW = 0.000002 * 1450;

export async function GET(req: NextRequest) {
    try {
        // AUTHENTICATION CHECK
        const authHeader = req.headers.get('x-admin-key');
        const adminSecret = process.env.ADMIN_SECRET_KEY;

        if (!adminSecret || authHeader !== adminSecret) {
            return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate'); // YYYY-MM-DD
        const endDate = searchParams.get('endDate');     // YYYY-MM-DD

        let query = supabaseAdmin
            .from('saju_results')
            .select('ai_result, created_at');

        // Date Filter
        if (startDate) {
            query = query.gte('created_at', `${startDate}T00:00:00`);
        }
        if (endDate) {
            query = query.lte('created_at', `${endDate}T23:59:59`);
        }

        // Fetch Data (Limit to 1000 for now to avoid huge payload, or better: use database aggregation if possible)
        // Since we store data in JSONB, standard SQL aggregation is hard without RPC.
        // We will fetch minimal fields and aggregate in JS for MVP.
        const { data, error } = await query;

        if (error) {
            console.error("Admin Stats Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const stats = {
            visitors: data.length,
            paidUsers: 0,
            revenue: 0,
            aiCost: 0,
            conversionRate: 0,
            tokenUsage: 0,
            refundedUsers: 0
        };

        data.forEach((row: any) => {
            const result = row.ai_result || {};

            // 0. Refund Check
            if (result.isRefunded) {
                stats.refundedUsers++;
                // Skip revenue calculation for refunded users, but maybe count as visitor?
                // Let's exclude from paidUsers count (revenue generating users)
                return;
            }

            // 1. Paid Check
            if (result.isPaidResult) {
                stats.paidUsers++;
            }

            // 2. AI Cost (Summing up usage array) - Even refunded users consumed tokens, so we should count cost?
            // Actually, if we return above, we don't count cost. Let's move cost calculation outside if needed.
            // But usually refunded means we lost money, so net profit calculation should subtract cost.
            // Let's count cost for everyone.
        });

        // Re-iterate for cost on ALL users (even refunded)
        data.forEach((row: any) => {
            const result = row.ai_result || {};
            if (Array.isArray(result.usage)) {
                result.usage.forEach((u: any) => {
                    if (u.totalTokens) {
                        stats.tokenUsage += u.totalTokens;
                    }
                });
            }
        });

        // 3. Financials
        stats.revenue = stats.paidUsers * 29800;
        stats.aiCost = Math.round(stats.tokenUsage * COST_PER_TOKEN_KRW); // x10 Applied in constant

        // 4. Rate
        stats.conversionRate = stats.visitors > 0
            ? parseFloat(((stats.paidUsers / stats.visitors) * 100).toFixed(2))
            : 0;

        return NextResponse.json(stats);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
