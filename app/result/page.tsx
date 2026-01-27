"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateSaju } from '@/lib/saju';
import { convertSajuToPaidResult } from '@/lib/saju/transform';
import { PaidSajuResult } from '@/types/PaidResultTypes';

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<string>("사주 팔자를 계산하고 있습니다...");

    useEffect(() => {
        const name = searchParams.get('name');
        const gender = searchParams.get('gender');
        const birthDate = searchParams.get('birthDate');
        const birthTime = searchParams.get('birthTime');
        const mbti = searchParams.get('mbti');
        const question = searchParams.get('question');

        if (!name || !gender || !birthDate || !birthTime) {
            router.replace('/');
            return;
        }

        const initResult = async () => {
            try {
                // 1. Calculate Local Data
                const prefix = parseInt(birthDate.substring(0, 2)) < 30 ? "20" : "19";
                const fullYear = parseInt(prefix + birthDate.substring(0, 2));
                const month = parseInt(birthDate.substring(2, 4));
                const day = parseInt(birthDate.substring(4, 6));

                let hour = 12;
                if (birthTime !== "UNKNOWN") {
                    hour = parseInt(birthTime.substring(0, 2));
                }

                const rawResult = calculateSaju(fullYear, month, day, hour, gender);
                if (birthTime === "UNKNOWN") rawResult.hour = "모름";

                const enrichedRaw = { ...rawResult, mbti: mbti || undefined, userName: name };

                const finalResult = convertSajuToPaidResult(enrichedRaw, {
                    name: name,
                    gender: gender as 'male' | 'female',
                    birthDate: birthDate,
                    birthTime: birthTime,
                    question: question || undefined
                });
                finalResult.mbti = mbti || undefined;

                // 2. Create DB Entry IMMEDIATELY using /api/share
                setStatus("서버에 기록을 생성하고 있습니다...");

                const res = await fetch('/api/share', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userName: name,
                        birthData: { birthDate, birthTime, gender },
                        aiResult: finalResult
                    })
                });

                if (!res.ok) throw new Error("서버 저장 실패");

                const data = await res.json();
                if (data.id) {
                    // 3. Redirect to Persistent URL
                    console.log("✅ Result Created, Redirecting to:", data.id);
                    router.replace(`/share/${data.id}`);
                } else {
                    throw new Error("ID 반환 실패");
                }

            } catch (e) {
                console.error("Result Init Error:", e);
                alert("초기화 중 오류가 발생했습니다. 다시 시도해주세요.");
                router.replace('/');
            }
        };

        // Debounce double-call in React Strict Mode
        const timeout = setTimeout(() => {
            initResult();
        }, 100);

        return () => clearTimeout(timeout);

    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 text-stone-200">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-bold animate-pulse">{status}</p>
            <p className="text-stone-500 text-sm mt-2">잠시만 기다려주세요...</p>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-900"></div>}>
            <ResultContent />
        </Suspense>
    );
}
