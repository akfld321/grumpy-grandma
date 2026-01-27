'use client';

import React from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import { Chapter5AIResponse } from '@/types/GeminiSchema';
import { motion, AnimatePresence } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import Image from 'next/image';

interface Chapter5Props {
    content: {
        chapterId: number;
        chapterTitle: string;
        chapterSub: string;
        desc: string;
        data: any;
        aiResponse?: Chapter5AIResponse;
    };
}

const Chapter5: React.FC<Chapter5Props> = ({ content }) => {
    const aiData = content.aiResponse;
    const [revealedIndices, setRevealedIndices] = React.useState<number[]>([]);

    const toggleReveal = (idx: number) => {
        setRevealedIndices(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    return (
        <div className="w-full max-w-md mx-auto bg-stone-900 border-x-2 border-stone-800 font-serif text-stone-100 pb-20 min-h-screen">

            {/* --- Intro Section (Dark & Mystical) --- */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="min-h-[30vh] flex flex-col items-center justify-center p-6 text-center bg-stone-900 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] pointer-events-none"></div>
                {/* Purple Aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-900 rounded-full blur-[80px] opacity-40"></div>

                <h2 className="text-3xl font-black mb-6 relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-purple-300 via-white to-purple-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    <span className="block text-sm text-purple-400 mb-2 font-medium tracking-widest">Chapter 5</span>
                    내 안의 숨겨진<br />
                    신(神)과 살(殺)
                </h2>

                <p className="text-stone-400 text-sm leading-relaxed z-10 max-w-xs mx-auto">
                    "살이 꼈다고 다 나쁜 게 아니여.<br />
                    잘 쓰면 그게 바로 필살기가 되는겨."
                </p>
            </motion.section>

            {/* --- Shinsal Reveal Section --- */}
            {aiData && (
                <section className="px-6 py-10 space-y-8">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-purple-200">
                            🔍 발견된 기운
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">카드를 눌러 내용을 확인해라</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {aiData?.shinsalList?.map((item, idx) => (
                            <div key={idx} className="perspective-1000" onClick={() => toggleReveal(idx)}>
                                <motion.div
                                    className="relative w-full h-40 cursor-pointer preserve-3d transition-transform duration-700"
                                    animate={{ rotateY: revealedIndices.includes(idx) ? 180 : 0 }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Front (Hidden) */}
                                    <div className="absolute inset-0 bg-stone-800 rounded-xl border border-stone-700 flex flex-col items-center justify-center shadow-lg backface-hidden group hover:border-purple-500 transition-colors">
                                        <span className="text-3xl mb-2">🃏</span>
                                        <p className="font-bold text-stone-400">숨겨진 카드 {idx + 1}</p>
                                        <p className="text-xs text-stone-600 mt-1">Touch to Reveal</p>
                                    </div>

                                    {/* Back (Revealed) */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-stone-900 rounded-xl border-2 border-purple-500 flex flex-col items-center justify-center p-4 shadow-[0_0_20px_rgba(168,85,247,0.3)] backface-hidden rotate-y-180">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="text-2xl font-black text-white">{item.name}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.isPositive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                {item.isPositive ? '길신(Good)' : '흉살(Bad?)'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-purple-200 text-center leading-snug">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* --- Main Analysis & Solution --- */}
            {aiData ? (
                <div className="px-6 space-y-12">
                    {/* Deep Analyses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-stone-800/50 p-6 rounded-2xl border border-stone-700 backdrop-blur-sm"
                    >
                        <h4 className="font-bold text-lg mb-3 text-purple-400 border-b border-stone-700 pb-2">
                            {aiData?.mainShinsalAnalysis?.title || "기운 분석 중..."}
                        </h4>
                        <p className="text-stone-300 leading-normal whitespace-pre-wrap">
                            {formatWithSentenceBreaks(aiData?.mainShinsalAnalysis?.description || "할머니가 네 안에 숨겨진 힘을 찾고 있다.")}
                        </p>
                        <div className="mt-4 bg-stone-900 p-4 rounded-lg">
                            <p className="text-xs text-stone-500 mb-1">Impact</p>
                            <p className="text-stone-200 italic">"{aiData?.mainShinsalAnalysis?.impact || "..."}"</p>
                        </div>
                    </motion.div>

                    {/* Talisman Solution */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-center relative py-8"
                    >
                        <div className="absolute inset-0 bg-yellow-500/5 blur-[50px] rounded-full pointer-events-none"></div>

                        <h3 className="text-2xl font-serif font-bold text-yellow-500 mb-4 drop-shadow-md">
                            🔱 할머니의 비방 (Modern Talisman)
                        </h3>

                        <div className="relative w-64 min-h-[24rem] h-auto mx-auto bg-[#3e2723] rounded-sm border-4 border-[#ffb300] shadow-2xl flex flex-col items-center justify-center p-6 pb-12 overflow-visible">
                            {/* Talisman Texture */}
                            <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]"></div>
                            <div className="absolute inset-2 border border-[#ffb300] opacity-50"></div>

                            <h4 className="text-xl font-bold text-[#ffb300] mb-4 z-10">{aiData?.modernSolution?.title || "비방 작성 중"}</h4>

                            <div className="flex-1 flex items-center justify-center z-10 w-full">
                                <p className="text-sm text-[#ffe0b2] text-center font-medium leading-normal whitespace-pre-wrap break-keep">
                                    {formatWithSentenceBreaks(aiData?.modernSolution?.advice || "잠시만 기다려라...")}
                                </p>
                            </div>

                            <div className="mt-4 text-[10px] text-[#ffb300] opacity-70 z-10">
                                🧧 액운은 막고 복은 불러온다
                            </div>

                            {/* Stamp */}
                            <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-red-700 rounded-lg flex items-center justify-center rotate-[-15deg] opacity-80">
                                <span className="text-red-700 font-bold text-xs">필승</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : (
                /* Skeleton Loader */
                <div className="px-6 py-10 space-y-6 animate-pulse">
                    <div className="h-40 bg-stone-800 rounded-xl"></div>
                    <div className="h-60 bg-stone-800 rounded-xl"></div>
                </div>
            )}
        </div>
    );
};

export default Chapter5;
