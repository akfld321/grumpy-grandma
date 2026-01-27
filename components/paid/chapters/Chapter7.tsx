'use client';

import React, { useState } from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter7AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';

interface Chapter7Props {
    content: ChapterContent;
    forceExpanded?: boolean;
}

const Chapter7: React.FC<Chapter7Props> = ({ content, forceExpanded = false }) => {
    const aiData = content.aiResponse as Chapter7AIResponse | undefined;
    const [isRevealed, setIsRevealed] = useState(forceExpanded);

    // Fallback data if AI fails
    const wealthSize = aiData?.wealthBowl?.size || 'small';

    const getWealthIcon = (size: string) => {
        switch (size) {
            case 'huge': return '💰';
            case 'big': return '💎';
            case 'small': return '🪙';
            case 'cracked': return '💸';
            default: return '🪙';
        }
    };

    return (
        <div className="w-full flex-1 bg-stone-900 font-serif text-stone-100 relative flex flex-col">

            {/* Intro Section */}
            <motion.div
                className="pt-12 px-6 text-center z-10 w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <p className="text-xs font-bold tracking-[0.3em] text-amber-600 mb-4">CHAPTER 07</p>
                <h2 className="text-3xl font-black mb-4 leading-tight">
                    니 <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">돈그릇</span>은<br />
                    얼마나 될꼬?
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
                    돈은 쫓는 게 아니라 붙게 만들어야 해.<br />
                    타고난 재물운의 크기를 확인해 봐라.
                </p>
            </motion.div>

            {/* Interactive Object (The Rice Jar) */}
            <div className="flex-1 w-full flex items-center justify-center relative my-10 min-h-[400px]">
                <motion.div
                    onClick={() => setIsRevealed(true)}
                    className="relative cursor-pointer group"
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/20 blur-[60px] animate-pulse"></div>

                    {/* The Jar Visual */}
                    <div className="w-56 h-56 relative flex items-center justify-center">
                        <div className="text-[150px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-700">
                            {isRevealed ? getWealthIcon(wealthSize) : '🏺'}
                        </div>

                        {/* Shimmer Effect on Jar */}
                        {!isRevealed && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent w-full h-full animate-pulse pointer-events-none"></div>
                        )}
                    </div>

                    {/* 'Touch' hint */}
                    {!isRevealed && (
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs text-amber-200/70 animate-bounce whitespace-nowrap bg-black/50 px-3 py-1 rounded-full border border-amber-500/30">
                            황금 독 열어보기 👇
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Result Content */}
            {isRevealed && (
                <motion.div
                    className="w-full px-6 pb-24 z-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border-2 border-yellow-400 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                        <div className="relative z-10 text-center">
                            <div className="text-6xl mb-4 animate-bounce">
                                {getWealthIcon(wealthSize)}
                            </div>
                            <h3 className="text-2xl font-black text-stone-900 mb-2">
                                {aiData?.wealthBowl?.title || '돈그릇 감별 중...'}
                            </h3>
                            <p className="text-stone-600 leading-relaxed text-left whitespace-pre-wrap break-keep">
                                {formatWithSentenceBreaks(aiData?.wealthBowl?.description) || '할머니가 돈 냄새를 맡고 계십니다.'}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border bg-amber-950/40 border-amber-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>

                        {/* Timing Section */}
                        <div className="bg-black/30 p-4 rounded-xl mb-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">⏳</span>
                                <h4 className="text-stone-400 text-xs font-bold uppercase tracking-wider">Wealth Timing</h4>
                            </div>
                            <p className="text-amber-100 font-bold text-lg mb-2">{aiData?.timing?.callToAction || '때를 기다려라'}</p>
                            <p className="text-stone-300 text-sm text-left whitespace-pre-wrap leading-relaxed">{formatWithSentenceBreaks(aiData?.timing?.description) || '...'}</p>
                        </div>

                        {/* Strategy Section */}
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">💎</span>
                                <h4 className="text-stone-400 text-xs font-bold uppercase tracking-wider">Action Plan</h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-stone-500 text-xs block mb-1">투자 스타일</span>
                                    <p className="text-stone-200 text-sm p-2 bg-stone-900/50 rounded-lg text-left whitespace-pre-wrap">{formatWithSentenceBreaks(aiData?.strategies?.investment || '분석 중...')}</p>
                                </div>
                                <div>
                                    <span className="text-stone-500 text-xs block mb-1">개운 습관</span>
                                    <p className="text-stone-200 text-sm italic p-2 bg-stone-900/50 rounded-lg text-left whitespace-pre-wrap">"{formatWithSentenceBreaks(aiData?.strategies?.habit || '분석 중...')}"</p>
                                </div>
                            </div>
                        </div>

                        {/* NEW: 2026 Monthly Wealth Calendar (The Core Feature) */}
                        <div className="bg-black/40 p-5 rounded-xl border border-amber-500/10 mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">📅</span>
                                <h4 className="text-amber-400 text-sm font-bold uppercase tracking-wider">2026 Wealth Calendar</h4>
                            </div>

                            {aiData?.monthlyCalendar ? (
                                <div className="grid grid-cols-3 gap-3"> {/* Expanded to 3 cols for readability */}
                                    {aiData.monthlyCalendar.map((m) => {
                                        const isGood = m.score >= 70;
                                        const isBad = m.score <= 40;
                                        const color = isGood ? 'text-green-400' : isBad ? 'text-red-400' : 'text-stone-300';
                                        const borderColor = isGood ? 'border-green-500/30' : isBad ? 'border-red-500/30' : 'border-stone-700/30';
                                        const bg = isGood ? 'bg-green-900/20' : isBad ? 'bg-red-900/20' : 'bg-stone-800/30';

                                        return (
                                            <div key={m.month} className={`p-3 rounded border ${borderColor} ${bg} flex flex-col items-center justify-center text-center`}>
                                                <span className="text-xs text-stone-500 font-mono mb-1">{m.month}월</span>
                                                <div className={`text-xl font-black ${color} leading-none mb-1`}>{m.score}</div>
                                                <span className="text-xs text-stone-400 w-full px-1 break-keep leading-tight">{m.keyword}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-stone-500 text-sm">
                                    <p>월별 데이터 분석 중...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default Chapter7;
