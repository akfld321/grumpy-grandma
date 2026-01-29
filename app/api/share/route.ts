import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { encrypt, decrypt } from '@/lib/crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userName, birthData, aiResult } = body;

        if (!userName || !aiResult) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        // Encrypt PII
        const encryptedName = encrypt(userName);
        // Note: birthData is stored as JSONB. For full security, we should encrypt values, 
        // but to preserve schema compatibility, we will focus on Strict Access Control (not returning it in GET).

        const { data, error } = await supabaseAdmin
            .from('saju_results')
            .insert([
                {
                    user_name: encryptedName,
                    birth_data: birthData,
                    ai_result: aiResult
                }
            ])
            .select('id')
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, id: data.id });

    } catch (error: any) {
        console.error('Save Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('saju_results')
        .select('id, user_name, ai_result, created_at') // EXCLUDE birth_data explicitly
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Decrypt & Mask Name
    const decryptedName = decrypt(data.user_name);
    const maskedName = decryptedName.length > 2
        ? decryptedName[0] + '*'.repeat(decryptedName.length - 2) + decryptedName[decryptedName.length - 1]
        : decryptedName[0] + '*';

    // Sanitize AI Result (remove potential phone number inside JSON)
    const sanitizedAiResult = { ...data.ai_result };
    if (sanitizedAiResult.userPhone) delete sanitizedAiResult.userPhone;
    // sajuKey is required for rendering charts/chapters, so we keep it. 
    // Raw birth date (birth_data column) is already excluded above.

    return NextResponse.json({
        ...data,
        user_name: maskedName,
        ai_result: sanitizedAiResult,
        birth_data: undefined // Ensure it's gone
    });
}
