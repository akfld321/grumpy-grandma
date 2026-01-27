import React from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter2AIResponse } from '@/types/GeminiSchema';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';

interface Chapter2Props {
    content: ChapterContent;
}

const Chapter2: React.FC<Chapter2Props> = ({ content }) => {
    const localData = content.data?.type === 'pastLife' ? content.data.value : {};
    const { identity } = localData;
    const aiData = content.aiResponse as Chapter2AIResponse | undefined;

    return (
        <div className="w-full max-w-md mx-auto bg-stone-50 min-h-screen font-serif relative overflow-hidden shadow-2xl">
            {/* --- SCENE 1: ATMOSPHERE (Full Screen Intro) --- */}
            <section className="relative h-[60vh] w-full flex flex-col justify-end pb-12 overflow-hidden">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/grandma_smoking_v2.png"
                        alt="Intro"
                        fill
                        className="object-cover object-center grayscale contrast-125 brightness-75 scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                </div>

                {/* Text Layer - Floating */}
                <motion.div
                    className="relative z-10 px-6 text-center space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <p className="text-stone-300 text-xs tracking-[0.5em] font-light border-b border-stone-600 pb-2 inline-block mb-2">
                        CHAPTER.02
                    </p>
                    <h1 className="text-3xl font-black text-white leading-tight drop-shadow-lg">
                        전생의<br />
                        <span className="text-red-600">업보</span>를 찾아서
                    </h1>
                    <p className="text-stone-400 text-xs font-medium animate-pulse">
                        스크롤을 내려서 확인하세요
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
                    ↓
                </div>
            </section>


            {/* --- SCENE 2: NARRATION (White Space Transition) --- */}
            <section className="relative bg-white py-12 px-8 text-center space-y-6 z-10 -mt-6 rounded-t-[2rem] shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                <p className="text-base leading-snug font-medium text-stone-600">
                    "쯧쯧... 그래, 왔구나."<br />
                    "어디 보자... 네놈 사주를 보니..."
                </p>
                <div className="w-full h-px bg-stone-200 my-6"></div>
                <p className="text-xl font-bold text-black leading-snug word-break-keep-all">
                    "{aiData?.pastLife?.theme || '...기가 막히는구만...'}"
                </p>
            </section>


            {/* --- SCENE 3: THE REVEAL (Impact) --- */}
            <section className="relative py-20 bg-stone-900 overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                <div className="relative z-10 flex flex-col items-center space-y-12">
                    <motion.div
                        className="relative w-64 h-64"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                    >
                        {/* Glowing Aura Effect behind image */}
                        <div className="absolute inset-0 bg-red-500 blur-[50px] opacity-30 animate-pulse"></div>

                        <div className="relative w-full h-full rounded-full border-4 border-stone-700 overflow-hidden bg-stone-800 shadow-2xl">
                            <Image
                                src={identity?.img || "/grandma_curious_v2.png"}
                                alt="Identity"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-4 bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-lg tracking-widest text-sm border border-red-500">
                            전생의 정체
                        </div>
                    </motion.div>

                    <div className="px-8 text-center">
                        <p className="text-stone-400 text-sm mb-4 tracking-widest">KARMA ANALYSIS</p>
                        <p className="text-white text-lg leading-snug font-light opacity-90 text-center whitespace-pre-wrap break-keep">
                            {formatWithSentenceBreaks(aiData?.pastLife?.karmaAnalysis)}
                        </p>
                    </div>
                </div>
            </section>


            {/* --- SCENE 4: ADVICE (Dialogue) --- */}
            <section className="bg-white py-20 px-6 relative">
                {/* Decorative Line connecting from to top */}
                <div className="absolute top-0 left-1/2 w-px h-20 bg-gradient-to-b from-stone-900 to-transparent transform -translate-x-1/2"></div>

                <div className="flex flex-col gap-6 max-w-sm mx-auto">
                    {/* Speech Bubble 1 - Left */}
                    <motion.div
                        className="self-start bg-stone-100 rounded-2xl rounded-tl-none p-5 max-w-[85%] shadow-sm border border-stone-200"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                    >
                        <p className="text-sm font-bold text-stone-500 mb-1">🔥 타고난 기질</p>
                        <p className="text-stone-800 whitespace-pre-wrap break-keep leading-snug block">
                            {formatWithSentenceBreaks(aiData?.dayMasterAnalysis.coreNature.description)}
                        </p>
                    </motion.div>

                    {/* Speech Bubble 2 - Right */}
                    <motion.div
                        className="self-end bg-blue-50 rounded-2xl rounded-tr-none p-5 max-w-[85%] shadow-sm border border-blue-100 text-right"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                    >
                        <p className="text-sm font-bold text-blue-500 mb-1">💧 속마음</p>
                        <p className="text-stone-800 whitespace-pre-wrap break-keep leading-snug block">
                            {formatWithSentenceBreaks(aiData?.dayMasterAnalysis.innerHeart.description)}
                        </p>
                    </motion.div>
                </div>
            </section>


            {/* --- SCENE 5: FINAL PRESCRIPTION (Footer) --- */}
            <section className="bg-[#f5f5f0] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]"></div>

                <div className="relative z-10">
                    <h3 className="text-xl font-black text-stone-800 mb-6 mt-8">"그래서 어떻게 살아야 하냐고?"</h3>

                    <div className="bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-stone-200 mx-2">
                        <p className="text-lg leading-snug text-stone-700 font-medium whitespace-pre-wrap break-keep">
                            {formatWithSentenceBreaks(aiData?.elementalBalance.advice)}
                        </p>
                        <div className="mt-6 flex justify-center">
                            <span className="inline-block w-12 h-1 bg-red-500 rounded-full"></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Chapter2;
