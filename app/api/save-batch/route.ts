import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resultId, batchId, aiData } = body;

        if (!resultId || !batchId || !aiData) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
        }

        console.log(`💾 Saving Batch ${batchId} for Result ${resultId}...`);

        // 1. Fetch current data
        const { data: current, error: fetchError } = await supabase
            .from('saju_results')
            .select('ai_result')
            .eq('id', resultId)
            .single();

        if (fetchError || !current) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        // 2. Merge Data
        const currentResult = current.ai_result;
        let updatedResult = { ...currentResult };

        // Helper to merge chapters
        const mergeChapter = (targetId: number, newData: any) => {
            if (!updatedResult.chapters) return;
            const idx = updatedResult.chapters.findIndex((c: any) => c.chapterId === targetId);
            if (idx !== -1) {
                // Merge existing aiResponse with new one
                const existing = updatedResult.chapters[idx].aiResponse || {};
                updatedResult.chapters[idx].aiResponse = { ...existing, ...newData };
            }
        };

        // BATCH MAPPING
        if (batchId === 'BATCH_1_CORE') {
            mergeChapter(2, aiData.ch2);
            mergeChapter(3, aiData.ch3);
            mergeChapter(4, aiData.ch4);
            mergeChapter(5, aiData.ch5);
            mergeChapter(6, aiData.ch6);
        } else if (batchId === 'BATCH_2_WEALTH') {
            mergeChapter(7, aiData.ch7);
            mergeChapter(9, aiData.ch9);
            mergeChapter(10, aiData.ch10);
            mergeChapter(11, aiData.ch11);
            mergeChapter(12, aiData.ch12);
        } else if (batchId === 'BATCH_3_FUTURE') {
            mergeChapter(8, aiData.ch8);
            mergeChapter(13, aiData.ch13);
            mergeChapter(14, aiData.ch14);
        }

        // 3. Save Back
        const { error: updateError } = await supabase
            .from('saju_results')
            .update({ ai_result: updatedResult })
            .eq('id', resultId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Save Batch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
