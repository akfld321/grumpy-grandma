
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { encrypt } from '@/lib/crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resultId, aiResult, phone } = body;

        if (!resultId) {
            return NextResponse.json({ error: 'Missing Id' }, { status: 400 });
        }

        const updateData: any = {};
        if (aiResult) updateData.ai_result = aiResult;

        if (phone) {
            const encryptedPhone = encrypt(phone);

            // Attempt to fetch current data first to merge if we are only sending phone
            if (!aiResult) {
                const { data: current } = await supabaseAdmin.from('saju_results').select('ai_result').eq('id', resultId).single();
                if (current && current.ai_result) {
                    updateData.ai_result = { ...current.ai_result, userPhone: encryptedPhone };
                } else {
                    // If no current ai_result and no new aiResult, just create one with phone
                    updateData.ai_result = { userPhone: encryptedPhone };
                }
            } else {
                // If aiResult is provided, ensure updateData.ai_result exists before adding userPhone
                if (!updateData.ai_result) {
                    updateData.ai_result = {};
                }
                updateData.ai_result.userPhone = encryptedPhone;
            }
        }

        const { error } = await supabaseAdmin
            .from('saju_results')
            .update(updateData)
            .eq('id', resultId);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Update Result Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
