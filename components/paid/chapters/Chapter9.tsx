'use client';

import React from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter9AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';

interface Chapter9Props {
    content: ChapterContent;
}

const Chapter9: React.FC<Chapter9Props> = ({ content }) => {
    const aiData = content.aiResponse as Chapter9AIResponse | undefined;
    const career = aiData?.career || { type: 'employee', title: '분석 중...', description: '' };

    // Icon mapping for career types
    const CAREER_ICONS: Record<string, string> = {
        'employee': '🏢',
        'business': '💸',
        'freelancer': '💻',
        'expert': '🎓',
        'artist': '🎨'
    };

    const icon = CAREER_ICONS[career.type] || '❓';
    const verdict = aiData?.verdict || "할머니가 고민 중이시다...";

    return (
        <div className="w-full flex-1 bg-stone-100 font-serif text-stone-800 relative flex flex-col items-center">

            {/* Header */}
            <div className="pt-12 px-6 text-center w-full mb-8">
                <p className="text-xs font-bold tracking-[0.3em] text-stone-500 mb-2">CHAPTER 09</p>
                <h2 className="text-3xl font-black mb-2 leading-tight">
                    니 <span className="text-blue-600">천직</span>은<br />
                    뭘로 밥벌어 먹을래?
                </h2>
                <p className="text-stone-500 text-sm">
                    네가 타고난 일복과 재능을<br />적나라하게 까발려주마.
                </p>
            </div>

            {/* Report Card */}
            <motion.div
                className="w-full max-w-sm bg-white rounded-xl shadow-xl border-2 border-stone-200 overflow-hidden relative mb-10 mx-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Decorative Staple */}
                <div className="absolute top-0 left-4 w-4 h-8 bg-stone-300 rounded-b shadow-inner z-10"></div>

                {/* Header Strip */}
                <div className="bg-stone-800 text-white p-4 pl-12 flex justify-between items-center relative overflow-hidden">
                    <h3 className="font-bold text-lg tracking-widest">직무 적성 검사표</h3>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>

                <div className="p-6 relative">
                    {/* "Official" Watermark */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[100px] font-black text-red-600/10 rotate-[-15deg] pointer-events-none whitespace-nowrap">
                        {career?.type ? career.type.toUpperCase() : "ANALYSIS"}
                    </div>

                    {/* Main Type */}
                    <div className="text-center mb-8 pb-8 border-b-2 border-stone-100 border-dashed">
                        <div className="text-6xl mb-4 filter drop-shadow-md">{icon}</div>
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                            YOUR TYPE
                        </div>
                        <h4 className="text-2xl font-black text-stone-800 mb-2">{career.title}</h4>
                        <p className="text-stone-500 text-sm leading-relaxed px-2 text-left whitespace-pre-wrap break-keep">
                            {formatWithSentenceBreaks(career.description)}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-6">
                        {/* Recommended Jobs */}
                        <div>
                            <h5 className="text-sm font-bold text-stone-400 uppercase mb-2 flex items-center gap-1">
                                <span>🎯</span> 추천 직업 (Jobs)
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {(aiData?.recommendedJobs || []).map((job: string, i: number) => (
                                    <span key={i} className="px-3 py-2 bg-stone-100 border border-stone-200 rounded text-stone-800 text-sm font-bold">
                                        {job}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h5 className="text-sm font-bold text-blue-600 uppercase mb-2">💪 강점 (Pros)</h5>
                                <ul className="text-sm text-stone-700 space-y-1.5 list-disc list-inside">
                                    {(aiData?.strengths || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <h5 className="text-sm font-bold text-red-600 uppercase mb-2">⚠️ 약점 (Cons)</h5>
                                <ul className="text-sm text-stone-700 space-y-1.5 list-disc list-inside">
                                    {(aiData?.weaknesses || []).map((w: string, i: number) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>

                        {/* Work Style */}
                        <div>
                            <h5 className="text-sm font-bold text-stone-400 uppercase mb-1">📝 업무 스타일 (Work Style)</h5>
                            <p className="text-base font-medium text-stone-800 bg-stone-50 p-4 rounded border border-stone-100 leading-relaxed text-left whitespace-pre-wrap break-keep">
                                {formatWithSentenceBreaks(aiData?.workStyle)}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div >
    );
};

export default Chapter9;
