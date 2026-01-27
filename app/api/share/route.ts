import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userName, birthData, aiResult } = body;

        if (!userName || !aiResult) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('saju_results')
            .insert([
                {
                    user_name: userName,
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

    const { data, error } = await supabase
        .from('saju_results')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}
