
import React from 'react';
import { motion } from 'framer-motion';
import { Chapter14AIResponse } from '@/types/GeminiSchema';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import { Palette, Hash, MapPin, Gift, Sparkles, Share2, Download } from 'lucide-react';

interface Chapter14Props {
    content: {
        aiResponse?: Chapter14AIResponse;
    };
    onRestart?: () => void;
    onShare?: () => void;
}

export default function Chapter14({ content, onRestart, onShare }: Chapter14Props) {
    const data = content.aiResponse;

    if (!data) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-pulse text-stone-400 font-bold">할머니가 보따리를 싸는 중...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8 px-4 font-sans text-stone-800 pb-20">

            {/* 1. Header Area */}
            <div className="text-center pt-8 pb-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="inline-block bg-stone-900 text-white px-4 py-1 rounded-full text-xs font-bold mb-3"
                >
                    EPILOGUE
                </motion.div>
                <h2 className="text-3xl font-black font-aggro text-stone-900 mb-2">
                    할머니의<br />마지막 당부
                </h2>
                <p className="text-stone-500 text-sm">
                    "가기 전에 이것만은 꼭 챙겨가라."
                </p>
            </div>

            {/* 2. Core Message Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="bg-white border-2 border-stone-200 p-8 rounded-xl shadow-lg relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 font-serif">"명심해라"</h3>
                    <p className="text-lg leading-normal whitespace-pre-wrap break-keep font-medium text-stone-700">
                        {formatWithSentenceBreaks(data.coreMessage)}
                    </p>
                </div>
                {/* Stamp */}
                <div className="absolute -bottom-4 -right-4 opacity-10">
                    <div className="w-32 h-32 border-4 border-black rounded-full flex items-center justify-center rotate-[-15deg]">
                        <span className="font-aggro text-xs">필승</span>
                    </div>
                </div>
            </motion.div>

            {/* 3. Lucky Charms (The Amulet) */}
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-stone-300"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-stone-50 px-3 text-sm font-bold text-stone-500">너를 지켜줄 개운템</span>
                </div>
            </div>

            <motion.div
                initial={{ rotate: -1, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#fcf8e3] border-4 border-[#d4af37] p-6 rounded-lg shadow-xl relative"
            >
                {/* Amulet Title */}
                <div className="text-center mb-6">
                    <span className="inline-block border-2 border-[#d4af37] text-[#d4af37] px-3 py-1 font-bold text-xs rounded mb-1">
                        SECRET AMULET
                    </span>
                    <h3 className="font-serif font-black text-xl text-stone-800">
                        2026년 행운의 부적
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Item 1: Color */}
                    <div className="bg-white/50 p-3 rounded border border-[#d4af37]/30 text-center">
                        <Palette className="w-6 h-6 mx-auto mb-2 text-[#d4af37]" />
                        <div className="text-xs text-stone-500 font-bold mb-1">행운의 색</div>
                        <div className="font-black text-lg text-stone-800">{data?.luckyCharms?.color || "황금색"}</div>
                    </div>

                    {/* Item 2: Number */}
                    <div className="bg-white/50 p-3 rounded border border-[#d4af37]/30 text-center">
                        <Hash className="w-6 h-6 mx-auto mb-2 text-[#d4af37]" />
                        <div className="text-xs text-stone-500 font-bold mb-1">행운의 숫자</div>
                        <div className="font-black text-lg text-stone-800">{data?.luckyCharms?.number || "7"}</div>
                    </div>

                    {/* Item 3: Direction */}
                    <div className="bg-white/50 p-3 rounded border border-[#d4af37]/30 text-center">
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-[#d4af37]" />
                        <div className="text-xs text-stone-500 font-bold mb-1">행운의 방향</div>
                        <div className="font-black text-lg text-stone-800">{data?.luckyCharms?.direction || "동쪽"}</div>
                    </div>

                    {/* Item 4: Object */}
                    <div className="bg-white/50 p-3 rounded border border-[#d4af37]/30 text-center">
                        <Gift className="w-6 h-6 mx-auto mb-2 text-[#d4af37]" />
                        <div className="text-xs text-stone-500 font-bold mb-1">행운의 물건</div>
                        <div className="font-bold text-base text-stone-800 break-keep">{data?.luckyCharms?.item || "붉은 속옷"}</div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-[#d4af37] font-bold">
                        ※ 이 부적을 마음속에 캡처해두거라.
                    </p>
                </div>
            </motion.div>

            {/* 4. Final Words */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-stone-900 text-stone-200 p-8 rounded-2xl text-center space-y-4"
            >
                <Sparkles className="w-8 h-8 mx-auto text-yellow-400 mb-2" />

                {/* Core Message if available */}
                {data.coreMessage && (
                    <div className="text-xl font-bold text-white mb-6 bg-stone-800 p-4 rounded-xl border border-stone-700 whitespace-pre-wrap break-keep">
                        "{formatWithSentenceBreaks(data.coreMessage)}"
                    </div>
                )}

                <div className="font-serif text-lg leading-normal text-stone-300 whitespace-pre-wrap break-keep">
                    {formatWithSentenceBreaks(data.closingRemark)}
                </div>
                <div className="w-16 h-1 bg-stone-700 mx-auto rounded-full mt-6"></div>
                <p className="text-xs text-stone-500 pt-2">
                    - 조선의 욕쟁이 할머니 -
                </p>
            </motion.div>

            {/* 5. Closing Buttons */}
            <div className="pt-8 pb-12 flex flex-col items-center gap-3">
                {/* Share Button (Primary) */}
                {onShare && (
                    <button
                        onClick={onShare}
                        className="w-full max-w-xs px-8 py-4 bg-[#FEE500] text-stone-900 font-bold rounded-xl shadow-lg hover:bg-[#FDD835] transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">💬</span>
                        친구에게 결과 공유하기
                    </button>
                )}



                {/* Restart Button */}
                <button
                    onClick={onRestart}
                    className="w-full max-w-xs px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Sparkles size={18} />
                    처음부터 다시 보기
                </button>
            </div>

        </div>
    );
}
