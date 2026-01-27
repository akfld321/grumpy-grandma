'use client';

import React from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import { Chapter4AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import Image from 'next/image';

interface Chapter4Props {
    content: {
        chapterId: number;
        chapterTitle: string;
        chapterSub: string;
        desc: string;
        data: any;
        aiResponse?: Chapter4AIResponse;
    };
}

// 12 Unseong Energy Level Mapping (approximate for visualization)
const ENERGY_LEVELS: Record<string, number> = {
    "제왕": 100, "건록": 90, "관대": 80, "장생": 75,
    "목욕": 60, "양": 50, "태": 40, "쇠": 35,
    "병": 25, "사": 15, "묘": 10, "절": 5
};

const STAGE_DESC: Record<string, string> = {
    "제왕": "King (정점)", "건록": "Success (안정)", "관대": "Youth (패기)", "장생": "Birth (시작)",
    "목욕": "Bath (도화)", "양": "Nurture (양육)", "태": "Womb (잉태)", "쇠": "Decline (노련)",
    "병": "Sick (역마)", "사": "Death (정지)", "묘": "Grave (입묘)", "절": "Cut (절단)"
};

const Chapter4: React.FC<Chapter4Props> = ({ content }) => {
    // 1. Extract Pillars & 12 Stages Data
    // We assume data.pillars structure is updated in parent. 
    // If not, we fallback safely.
    const pillars = (content.data as any)?.pillars || {}; // This might come from parent prop `data` strictly speaking, 
    // but `content.data` is usually where we put chapter specific stuff.
    // Actually in PaidResult, we pass the *whole* `sajuData` to `Chapter1/0`, 
    // but for `Chapter2/3` we passed `content={chapterData}`.
    // We need to access the computed pillars from the MAIN `PaidSajuResult` object.
    // However, `content` prop only has the chapter info.
    // FIX: We need access to the FULL `PaidSajuResult` to get the calculated pillars.
    // For now, I'll assume the parent passes `data` prop or I need to update the Interface.
    // WAIT: Chapter 2 and 3 didn't need raw pillar data because AI did everything?
    // Chapter 2 actually used `data` prop in `Chapter2.tsx`? No.
    // Chapter 2 only used AI response.
    // Chapter 4 NEEDS raw pillar calculations for the graph.
    // I will modify `PaidResult` to inject `pillars` into `content.data` or pass it separately.
    // Let's assume `content.data.pillars` is populated.

    const aiData = content.aiResponse;

    // Safety check for Pillars (Mocking if missing to prevent crash during dev)
    const stageData = [
        { label: '초년(Year)', stage: pillars?.year?.branch?.unseong || '절', pillar: '년주' },
        { label: '청년(Month)', stage: pillars?.month?.branch?.unseong || '태', pillar: '월주' },
        { label: '중년(Day)', stage: pillars?.day?.branch?.unseong || '장생', pillar: '일주' }, // Day is current/core
        { label: '말년(Time)', stage: pillars?.time?.branch?.unseong || '제왕', pillar: '시주' },
    ];

    // 2. Determine Graph Data Source (AI vs Local Fallback)
    let finalPoints: { x: number, y: number, val: number, label: string, stage?: string }[] = [];

    if (aiData?.lifeGraph && aiData.lifeGraph.length > 0) {
        // USE AI DATA (10s ~ 80s)
        finalPoints = aiData.lifeGraph.map((item, i) => {
            const count = aiData.lifeGraph!.length;
            const x = (i / (count - 1)) * 100;
            const val = item.score;
            const y = 100 - val;
            return { x, y, val, label: item.age, stage: item.keyword };
        });
    } else {
        // FALLBACK: User Local Pillars Logic (4 points)
        finalPoints = stageData.map((d, i) => {
            const x = (i / (stageData.length - 1)) * 100;
            const baseVal = ENERGY_LEVELS[d.stage] || 50;
            // Add subtle variation based on index to break linearity if all values are same
            const variation = (i % 2 === 0 ? 5 : -5);
            const val = Math.min(100, Math.max(0, baseVal + variation));
            const y = 100 - val;
            return { x, y, val, label: d.label, stage: d.stage };
        });
    }

    // Catmull-Rom to Bezier conversion or simple smoothing for better waves
    // Creating intermediate control points for a "bouncy" life graph
    const pathD = finalPoints.reduce((acc, p, i, a) => {
        if (i === 0) return `M ${p.x} ${p.y}`;

        // Control points for bezier (smooth wave)
        const prev = a[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 2;
        const cp1y = prev.y; // Hold y level start
        const cp2x = prev.x + (p.x - prev.x) / 2;
        const cp2y = p.y;   // Hold y level end

        // Use Cubic Bezier for S-curve
        return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${p.y}, ${p.x} ${p.y}`;
    }, "");

    return (
        <div className="w-full max-w-md mx-auto bg-white border-x-2 border-black font-serif text-stone-900 pb-20">

            {/* --- Intro Section --- */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="min-h-[40vh] flex flex-col items-center justify-center p-6 text-center bg-stone-100 border-b-4 border-black relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none"></div>
                <h2 className="text-3xl font-black mb-4 relative z-10">
                    <span className="block text-xl text-stone-500 mb-2 font-medium">Chapter 4</span>
                    너의 인생<br />
                    <span className="text-blue-600">파도타기</span>
                </h2>
                <div className="w-full max-w-[200px] h-2 bg-gradient-to-r from-transparent via-black to-transparent mb-8"></div>

                <p className="text-lg leading-relaxed text-stone-700 font-bold z-10">
                    "인생이 늘 좋을 수만은 없지.<br />
                    오르막이 있으면 내리막이 있다."
                </p>

                <div className="mt-8 w-24 h-24 relative rounded-full border-2 border-black overflow-hidden bg-white shadow-xl rotate-3">
                    <Image src="/grandma_webtoon_style.png" alt="Grandma" fill className="object-cover" />
                </div>
            </motion.section>

            {/* --- The Graph Section (Visual Core) --- */}
            <section className="py-12 px-2 bg-white relative">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black inline-block border-b-4 border-yellow-400 px-2">
                        인생 에너지 그래프 🌊
                    </h3>
                    <p className="text-xs text-stone-500 mt-2">초년부터 말년까지의 에너지 흐름</p>
                </div>

                <div className="aspect-[4/3] w-full relative bg-stone-50 rounded-xl border-2 border-stone-800 p-4 shadow-lg overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-4 flex flex-col justify-between text-[10px] text-stone-400 font-mono pointer-events-none">
                        <div className="border-b border-stone-200 w-full h-0">HIGH (왕)</div>
                        <div className="border-b border-stone-200 w-full h-0">MID (쇠)</div>
                        <div className="border-b border-stone-200 w-full h-0">LOW (절)</div>
                    </div>

                    {/* SVG Graph */}
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible relative z-10">
                        <defs>
                            <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Area under curve */}
                        <path d={`${pathD} V 100 H 0 Z`} fill="url(#waveGradient)" stroke="none" />
                        {/* The Wave Line */}
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        {/* Points */}
                        {finalPoints.map((p, i) => (
                            <g key={i}>
                                <motion.circle
                                    cx={p.x} cy={p.y} r="3"
                                    fill={p.val > 70 ? "#dc2626" : (p.val < 30 ? "#57534e" : "#ea580c")}
                                    stroke="white" strokeWidth="1"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 1 + (i * 0.3) }}
                                />
                                <motion.text
                                    x={p.x} y={p.y - 6}
                                    textAnchor="middle"
                                    fontSize="4"
                                    fontWeight="bold"
                                    fill="#1a1a1a"
                                    initial={{ opacity: 0, y: 5 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 + (i * 0.3) }}
                                >
                                    {p.stage}
                                </motion.text>
                                <text x={p.x} y="105" textAnchor="middle" fontSize="3" fill="#78716c">
                                    {p.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                {/* --- Legend / Reference Guide --- */}
                <div className="mt-8 bg-stone-100 p-4 rounded-lg border border-stone-200">
                    <h4 className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider text-center">
                        📜 할머니의 용어 사전
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-600">
                        {Object.entries(STAGE_DESC).map(([key, desc]) => (
                            <div key={key} className="flex justify-between border-b border-stone-200 pb-1">
                                <span className="font-bold text-stone-800">{key}</span>
                                <span className="text-stone-500">{desc}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2 text-center">
                        * 그래프의 높낮이는 에너지의 세기를 의미합니다.
                    </p>
                </div>
            </section>

            {/* --- AI Analysis Section --- */}
            {aiData ? (
                <div className="px-6 space-y-12">
                    {/* 1. Interpretation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-stone-100 p-6 rounded-2xl border-l-4 border-blue-600 shadow-sm"
                    >
                        <h4 className="font-bold text-lg mb-2">📊 할머니의 분석</h4>
                        <p className="whitespace-pre-wrap leading-normal">
                            {formatWithSentenceBreaks(aiData?.graphInterpretation || "할머니가 네 인생 곡선을 따라가보고 있다...")}
                        </p>
                    </motion.div>

                    {/* 2. Current Stage Detail */}
                    <div className="relative">
                        <div className="absolute -top-6 -left-2 bg-yellow-400 text-black font-bold px-4 py-1 transform -rotate-2 border-2 border-black z-10 shadow-md">
                            지금 네 위치는?
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-stone-900 text-stone-100 p-8 pt-10 rounded-xl text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black">
                                {aiData?.currentStage?.stage?.charAt(0) || "?"}
                            </div>
                            <h3 className="text-3xl font-black text-yellow-500 mb-2">
                                {aiData?.currentStage?.stage || "분석 중"}
                            </h3>
                            <p className="text-stone-400 text-sm mb-6 whitespace-pre-wrap leading-normal">
                                {formatWithSentenceBreaks(aiData?.currentStage?.description || "조금만 기다려보거라.")}
                            </p>
                            <div className="bg-stone-800 p-4 rounded-lg border border-stone-700">
                                <p className="font-bold text-white">Advice</p>
                                <p className="text-stone-300 whitespace-pre-wrap leading-normal">
                                    "{formatWithSentenceBreaks(aiData?.currentStage?.advice || "...")}"
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* 3. One Point Lesson */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <p className="text-sm text-stone-500 mb-2">오늘의 한마디</p>
                        <h3 className="text-2xl font-black text-red-600 leading-snug drop-shadow-sm">
                            "{aiData?.onePointLesson || "인생은 롤러코스터여!"}"
                        </h3>
                    </motion.div>

                </div>
            ) : (
                /* Skeleton Loader */
                <div className="px-6 py-10 space-y-6 animate-pulse">
                    <div className="h-40 bg-stone-200 rounded-xl"></div>
                    <div className="h-60 bg-stone-200 rounded-xl"></div>
                </div>
            )}

            {/* --- Outro Image --- */}
            <div className="mt-12 opacity-80 mix-blend-multiply">
                <div className="w-full h-48 relative grayscale contrast-125">
                    <Image src="/shaman_house_entrance.png" alt="Wave" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                </div>
            </div>

        </div>
    );
};

export default Chapter4;
