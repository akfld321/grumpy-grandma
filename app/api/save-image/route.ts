import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resultId, imageUrl } = body;

        if (!resultId || !imageUrl) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
        }

        console.log(`📸 Persisting Image for Result ID: ${resultId}`);

        // 1. Fetch current data
        const { data: current, error: fetchError } = await supabase
            .from('saju_results')
            .select('ai_result')
            .eq('id', resultId)
            .single();

        if (fetchError || !current) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        // 2. Update the specific chapter field in the JSON
        const aiResult = current.ai_result;
        let updated = false;

        // Find Chapter 8 and inject URL
        if (aiResult.chapters) {
            const ch8 = aiResult.chapters.find((c: any) => c.chapterId === 8);
            if (ch8 && ch8.aiResponse && ch8.aiResponse.spouse) {
                ch8.aiResponse.spouse.imageUrl = imageUrl;
                updated = true;
            }
        }

        if (!updated) {
            return NextResponse.json({ error: 'Chapter 8 data not found in result' }, { status: 400 });
        }

        // 3. Save back to DB
        const { error: updateError } = await supabase
            .from('saju_results')
            .update({ ai_result: aiResult })
            .eq('id', resultId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Save Image Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
