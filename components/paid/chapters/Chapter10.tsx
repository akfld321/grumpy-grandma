'use client';

import React from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter10AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';

interface Chapter10Props {
    content: ChapterContent;
}

const Chapter10: React.FC<Chapter10Props> = ({ content }) => {
    const aiData = content.aiResponse as Chapter10AIResponse | undefined;

    // Fallback data
    const weakOrgan = aiData?.weakestOrgan || "분석 중...";
    const vulnerability = aiData?.vulnerability || "";
    const advice = aiData?.advice || "건강이 최고다. 밥 잘 챙겨 먹어라.";
    const mental = aiData?.mentalHealth || "스트레스 받지 마라.";

    return (
        <div className="w-full flex-1 bg-stone-900 font-serif text-stone-100 relative flex flex-col items-center">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Header */}
            <div className="pt-12 px-6 text-center w-full mb-8 relative z-10">
                <p className="text-xs font-bold tracking-[0.3em] text-red-500 mb-2">CHAPTER 10</p>
                <h2 className="text-3xl font-black mb-2 leading-tight">
                    삐그덕대는<br />
                    <span className="text-red-500">니 몸뚱아리</span>
                </h2>
                <p className="text-stone-400 text-sm">
                    오행으로 본 신체 사용 설명서.<br />아껴 써라. 부품 없다.
                </p>
            </div>

            {/* Main Content Card */}
            <div className="w-full max-w-sm px-6 pb-20 relative z-10">
                <motion.div
                    className="bg-stone-800 rounded-2xl border border-stone-700 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* X-Ray Visual (Conceptual) */}
                    <div className="bg-black p-8 flex justify-center relative overflow-hidden">
                        <div className="w-32 h-40 border-2 border-stone-600 rounded-xl relative opacity-50">
                            {/* Ribcage hint */}
                            <div className="absolute top-4 left-2 right-2 h-0.5 bg-stone-600"></div>
                            <div className="absolute top-8 left-2 right-2 h-0.5 bg-stone-600"></div>
                            <div className="absolute top-12 left-2 right-2 h-0.5 bg-stone-600"></div>
                        </div>
                        {/* Red Pulse on Weak Area */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 bg-red-500 rounded-full blur-2xl animate-pulse opacity-40"></div>
                            <div className="text-4xl relative z-10 text-center drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                🚨
                            </div>
                        </div>

                        <div className="absolute bottom-2 right-4 text-xs font-mono text-red-500 animate-pulse">
                            WARNING: SYSTEM WEAKNESS DETECTED
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Diagnosis */}
                        <div className="mb-6">
                            <h3 className="text-stone-400 text-sm font-bold uppercase mb-1">가장 취약한 부위</h3>
                            <div className="text-3xl font-black text-white mb-2 text-left">{weakOrgan}</div>
                            <p className="text-red-400 text-base font-bold bg-red-900/20 p-3 rounded border border-red-900/50 text-left whitespace-pre-wrap break-keep">
                                ⚠️ {formatWithSentenceBreaks(vulnerability)}
                            </p>
                        </div>

                        {/* Prescriptions */}
                        <div className="space-y-4">
                            <div className="bg-stone-700/50 p-5 rounded-lg">
                                <h4 className="flex items-center gap-2 text-green-400 text-lg font-bold mb-3">
                                    <span>💊</span> 할머니 처방 (신체)
                                </h4>
                                <p className="text-stone-200 text-[15px] leading-relaxed text-left font-medium whitespace-pre-wrap">
                                    {formatWithSentenceBreaks(advice)}
                                </p>
                            </div>

                            <div className="bg-stone-700/50 p-5 rounded-lg">
                                <h4 className="flex items-center gap-2 text-blue-400 text-lg font-bold mb-3">
                                    <span>🧠</span> 할머니 처방 (멘탈)
                                </h4>
                                <p className="text-stone-200 text-[15px] leading-relaxed text-left font-medium whitespace-pre-wrap">
                                    {formatWithSentenceBreaks(mental)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-stone-950 p-4 text-center border-t border-stone-700">
                        <p className="text-sm text-stone-500">
                            ※ 본 결과는 의학적 진단이 아닙니다. <br />아프면 병원 가라. 미련하게 참지 말고.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Chapter10;
