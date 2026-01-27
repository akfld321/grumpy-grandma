'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Quote } from 'lucide-react';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter13AIResponse } from '@/types/GeminiSchema';

interface Chapter13Props {
    content: ChapterContent;
    userQuestion?: string;
}

export default function Chapter13({ content, userQuestion }: Chapter13Props) {
    const aiData = content.aiResponse as Chapter13AIResponse | undefined;

    const isLoading = !aiData;

    // Loading Skeleton
    if (isLoading) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-pulse">
                <div className="w-16 h-16 bg-stone-800 rounded-full"></div>
                <div className="space-y-3 w-full max-w-md">
                    <div className="h-4 bg-stone-800 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-stone-800 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="text-stone-500 text-sm">할머니가 질문을 곰곰이 생각 중이시다...</p>
            </div>
        );
    }

    // Main Content
    return (
        <div className="w-full flex-1 bg-stone-900 font-serif text-stone-100 flex flex-col p-6 space-y-8">

            {/* Header */}
            <div className="text-center space-y-2">
                <p className="text-xs font-bold tracking-[0.3em] text-purple-500">CHAPTER 13</p>
                <h2 className="text-2xl font-black leading-tight">할머니의 직설</h2>
                <div className="w-full h-px bg-stone-800 my-4"></div>
            </div>

            {/* User Question Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-stone-800/50 p-6 rounded-2xl border border-stone-700 relative"
            >
                <div className="absolute -top-3 -left-2 bg-stone-700 text-stone-300 p-1.5 rounded-lg shadow-lg">
                    <MessageCircle size={16} />
                </div>
                <p className="text-stone-400 text-xs font-bold mb-2">손주의 고민</p>
                <p className="text-lg font-bold text-white leading-relaxed">
                    "{userQuestion || content.data.value || '...'}"
                </p>
            </motion.div>

            {/* Grandma's Answer Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-900/40 to-stone-900 p-1 rounded-2xl relative"
            >
                <div className="bg-stone-900 rounded-xl p-6 relative overflow-hidden">
                    <Quote className="absolute top-4 right-4 text-purple-900/30" size={64} />

                    <p className="text-purple-400 text-xs font-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                        할머니의 처방전
                    </p>

                    <div className="space-y-4">
                        <p className="text-xl font-bold leading-normal text-stone-100 break-keep whitespace-pre-wrap">
                            {formatWithSentenceBreaks(aiData.answer)}
                        </p>
                    </div>


                </div>
            </motion.div >

        </div >
    );
}
