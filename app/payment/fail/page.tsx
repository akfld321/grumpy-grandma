
"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentFailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "결제가 취소되었습니다.";
    const code = searchParams.get("code");

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">😢</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
            <p className="text-stone-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                "{message}"<br />
                <span className="text-xs text-stone-600 mt-1 block">({code})</span>
            </p>

            <button
                onClick={() => router.back()}
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
                다시 시도하기
            </button>
        </div>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-500">로딩 중...</div>}>
            <PaymentFailContent />
        </Suspense>
    );
}
