'use client';

import React from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter11AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';

interface Chapter11Props {
    content: ChapterContent;
    forceExpanded?: boolean;
}

const Chapter11: React.FC<Chapter11Props> = ({ content, forceExpanded = false }) => {
    const aiData = content.aiResponse as Chapter11AIResponse | undefined;

    // Handle case where aiData might be partial or old format
    const graphData = aiData?.graph || [];
    const details = aiData?.daewoonDetails || [];
    const curveType = aiData?.overallCurve || "분석 완료 (데이터 없음)";

    // Debugging: Check if we have data
    console.log("Ch11 AI Data:", aiData);
    console.log("Ch11 Details:", details);

    const isLoading = !aiData;

    // If rendered but no graph data (and not waiting for global loader), show skeleton
    if (isLoading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-stone-900 text-stone-500 space-y-4">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse">인생 그래프 그리는 중...</p>
            </div>
        );
    }

    if (!aiData.graph || aiData.graph.length === 0) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-stone-800 rounded-xl text-red-400 p-6 text-center">
                <p className="font-bold mb-2">😭 그래프 데이터 누락</p>
                <p className="text-sm">"할머니가 그래프 그리다가 깜빡하셨다.<br />다시 시도해봐라."</p>
            </div>
        );
    }

    // Simple Graph Logic
    // X axis: index (0 to length-1)
    // Y axis: score (0 to 100)
    const width = 300;
    const height = 150;
    const padding = 20;

    const getX = (index: number) => {
        if (graphData.length <= 1) return padding;
        return padding + (index / (graphData.length - 1)) * (width - padding * 2);
    };

    const getY = (score: number) => {
        return height - padding - (score / 100) * (height - padding * 2);
    };

    // Construct path d string
    const pathD = graphData.reduce((acc: string, point: { score: number }, i: number) => {
        const x = getX(i);
        const y = getY(point.score);
        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");

    return (
        <div className="w-full flex-1 bg-stone-900 font-serif text-stone-100 relative flex flex-col items-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}></div>

            {/* Header */}
            <div className="pt-12 px-6 text-center w-full mb-8 relative z-10">
                <p className="text-xs font-bold tracking-[0.3em] text-purple-500 mb-2">CHAPTER 11</p>
                <h2 className="text-3xl font-black mb-2 leading-tight">
                    인생의 계절<br />
                    <span className="text-purple-400">10년 대운 그래프</span>
                </h2>
                <p className="text-stone-400 text-sm">
                    {curveType}
                </p>
            </div>

            {/* Graph Card */}
            <div className="w-full max-w-sm px-4 pb-8 relative z-10">
                <motion.div
                    className="bg-stone-800/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-bold text-white">📈 운세 흐름</h3>
                        <span className="text-xs text-stone-500">높을수록 호황기</span>
                    </div>

                    <div className="relative w-full overflow-visible">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                            {/* Grid Lines */}
                            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#555" strokeWidth="1" />
                            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />

                            {/* Path */}
                            <motion.path
                                d={pathD}
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="3"
                                initial={{ pathLength: forceExpanded ? 1 : 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            {/* Area under curve (Optional, complicated with simple simple path) */}

                            {/* Points */}
                            {graphData.map((point: { age: number, score: number }, i: number) => (
                                <g key={i}>
                                    <circle cx={getX(i)} cy={getY(point.score)} r="4" fill="#1c1917" stroke="#fbbf24" strokeWidth="2" />
                                    {/* Age Label */}
                                    <text x={getX(i)} y={height + 5} fontSize="10" fill="#aeaeae" textAnchor="middle">{point.age}세</text>
                                    {/* Score Label (Only for peaks/valleys/current?) */}
                                </g>
                            ))}
                        </svg>
                    </div>
                </motion.div>
            </div>

            {/* Detailed List */}
            <div className="w-full max-w-sm px-6 pb-20 relative z-10 space-y-4">
                <h4 className="text-sm font-bold text-stone-500 mb-2 ml-1">상세 대운 풀이</h4>

                {details.map((daewoon: { ganji: string, startAge: number, endAge: number, meaning: string, advice: string }, index: number) => {
                    const isFocus = (index === 2 || index === 3); // Just highlighting middle ones for demo, logic should compare age
                    // Simple distinct style for "Good" meaning keywords? AI provides meaning.

                    return (
                        <div key={index} className={`relative p-6 rounded-xl border ${isFocus ? 'bg-purple-900/20 border-purple-500/50' : 'bg-stone-800 border-stone-700'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex flex-col items-start gap-1">
                                        {/* Name (Ganji) - Prevent Wrapping */}
                                        <span className="text-3xl font-serif font-black text-white whitespace-nowrap leading-none">
                                            {daewoon.ganji}
                                        </span>
                                        {/* Age Period - Aligned Below */}
                                        <span className="text-xs font-mono text-stone-400 border border-stone-700 px-1.5 py-0.5 rounded bg-stone-900/50 mt-1">
                                            {daewoon.startAge}~{daewoon.endAge}세
                                        </span>
                                    </div>
                                </div>
                                {/* Keyword Badge */}
                                {graphData[index] && (
                                    <span className={`text-sm font-bold px-3 py-1 rounded whitespace-nowrap ${graphData[index].score >= 80 ? 'bg-red-500 text-white' : 'bg-stone-700 text-stone-300'}`}>
                                        {graphData[index].keyword}
                                    </span>
                                )}
                            </div>

                            <p className="text-stone-200 font-bold text-base mb-3 leading-snug">
                                "{daewoon.meaning}"
                            </p>
                            <div className="bg-black/30 p-4 rounded-lg text-sm text-stone-400 leading-relaxed text-left font-medium whitespace-pre-wrap">
                                💡 {formatWithSentenceBreaks(daewoon.advice)}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Chapter11;
