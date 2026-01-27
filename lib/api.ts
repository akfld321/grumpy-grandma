import { PaidSajuResult } from '@/types/PaidResultTypes';
import { SajuAIResponse } from '@/types/GeminiSchema';

export async function fetchAIAnalysis(sajuResult: PaidSajuResult, chapterId: number): Promise<SajuAIResponse | null> {
    try {
        const response = await fetch('/api/consult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sajuContext: sajuResult, // Send the full local context
                chapterId: chapterId
            }),
        });

        if (!response.ok) {
            console.error('AI Analysis Request Failed:', await response.text());
            return null;
        }

        const data = await response.json();
        return data as SajuAIResponse;
    } catch (error) {
        console.error('Error fetching AI analysis:', error);
        return null;
    }
}

export async function saveSajuResult(data: PaidSajuResult): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        // Prepare payload matching Supabase Schema
        const payload = {
            userName: data.userName,
            birthData: {
                birthDate: data.birthDate,
                birthTime: data.birthTime,
                gender: data.gender
            },
            // We store the FULL result object in aiResult column for simplicity, 
            // OR we can rename the column in DB, but for now let's use the jsonb column.
            aiResult: data
        };

        const response = await fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Server Save Failed');
        }

        const res = await response.json();
        return { success: true, id: res.id };
    } catch (e: any) {
        console.error("Save Failed:", e);
        return { success: false, error: e.message };
    }
}
