'use client';

import React, { useEffect, useState } from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import PaidResult from '@/components/paid/PaidResult';
import { useParams, useSearchParams } from 'next/navigation';

export default function SharedResultPage() {
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams(); // Hook moved to top

    const [data, setData] = useState<PaidSajuResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/share?id=${id}`);
                if (!res.ok) throw new Error("결과를 찾을 수 없습니다.");

                const dbRow = await res.json();
                // The API returns { id, user_name, birth_data, ai_result }
                // We stored the FULL PaidSajuResult in 'ai_result' column

                if (dbRow.ai_result) {
                    setData(dbRow.ai_result); // Restore full state
                } else {
                    throw new Error("데이터 형식이 올바르지 않습니다.");
                }

            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-200">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>할머니가 기록을 찾고 계십니다...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 text-red-400">
            <div className="text-center p-6 border border-red-500 rounded-xl">
                <p className="text-2xl mb-2">⚠️ 오류 발생</p>
                <p>{error}</p>
                <a href="/" className="inline-block mt-6 px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition">홈으로 돌아가기</a>
            </div>
        </div>
    );

    if (!data) return null;

    // Parse chapter from URL
    const chapterParam = searchParams.get('chapter');
    const initialChapter = chapterParam ? parseInt(chapterParam) : 0;

    // Render the Result Component
    // Pass isSharedView={true} if we want to hide "Save" buttons or customize UI
    return (
        <PaidResult data={data} resultId={id} initialChapter={initialChapter} />
    );
}
