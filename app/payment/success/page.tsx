
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sendGTMEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function confirm() {
            if (!paymentKey || !orderId || !amount) {
                setError("결제 정보가 부족합니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/confirm-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentKey, orderId, amount }),
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error?.message || "결제 승인에 실패했습니다.");
                }

                // Analytics: Purchase (Wait for confirm to prevent duplicates on client if possible, but simpler here)
                sendGTMEvent(ANALYTICS_EVENTS.PURCHASE, {
                    transaction_id: orderId,
                    value: Number(amount),
                    currency: 'KRW',
                    items: [{
                        item_id: 'full_report_v1',
                        item_name: '욕쟁이 할머니 사주 프리미엄 리포트',
                        price: Number(amount)
                    }]
                });

                // Success! Redirect to result page, targeting Chapter 4
                // Assuming orderId IS the resultId
                router.replace(`/share/${orderId}?chapter=4`);

            } catch (e: any) {
                console.error("Payment Confirmation Error", e);
                setError(e.message);
                setLoading(false);
            }
        }

        if (paymentKey) {
            confirm();
        }
    }, [paymentKey, orderId, amount, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-white text-center">
                <div className="w-20 h-20 bg-red-900/50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">⚠️</span>
                </div>
                <h1 className="text-2xl font-bold mb-4">결제 승인 실패</h1>
                <p className="text-stone-400 mb-8">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 px-8 rounded-xl"
                >
                    이전 페이지로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-white text-center animate-fadeIn">
            <div className="w-20 h-20 relative mb-6">
                <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">결제 확인 중...</h1>
            <p className="text-stone-400">
                할머니가 돋보기를 끼고...<br />
                당신의 사주팔자를 뜯어보고 계십니다...
            </p>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-500">
            할머니가 돋보기를 끼고...<br />
            당신의 사주팔자를 뜯어보고 계십니다...
        </div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
