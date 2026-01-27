import React from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter3AIResponse } from '@/types/GeminiSchema';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';

interface Chapter3Props {
    content: ChapterContent;
}

const Chapter3: React.FC<Chapter3Props> = ({ content }) => {
    // Local data (Ten Gods) would be passed here in content.data.value
    // For now we rely mostly on AI response for the narrative
    const aiData = content.aiResponse as Chapter3AIResponse | undefined;

    return (
        <div className="w-full max-w-md mx-auto bg-stone-50 min-h-screen font-serif relative overflow-hidden shadow-2xl">
            {/* --- SCENE 1: THE SOCIAL MASK (Intro) --- */}
            <section className="relative h-[60vh] w-full flex flex-col justify-center items-center overflow-hidden bg-stone-900 border-b-4 border-black">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>

                <motion.div
                    className="relative z-10 text-center space-y-6 px-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-stone-500 tracking-[0.5em] text-xs font-bold mb-2">CHAPTER.03</p>
                    <h1 className="text-4xl font-black text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        사회적<br />
                        <span className="text-stone-300">가면</span>
                    </h1>
                    <div className="w-16 h-1 bg-red-600 mx-auto mt-4 mb-4"></div>
                    <p className="text-stone-400 text-sm font-medium leading-loose">
                        "남들 앞에서는 웃고 있지만,<br />
                        속으로는 딴생각하고 있지?"
                    </p>
                </motion.div>

                {/* Scroll Indicator (Added) */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-stone-500 text-xs animate-bounce z-10 flex flex-col items-center gap-1">
                    <span>아래로 내려보거라</span>
                    <span>↓</span>
                </div>
            </section>


            {/* --- SCENE 2: TEN GODS ANALYSIS (The Reveal) --- */}
            <section className="relative bg-white py-12 px-6 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[20px] border-stone-100 opacity-50"></div>

                <div className="relative z-10 space-y-12">
                    <motion.div
                        className="text-center"
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                    >
                        <h2 className="text-2xl font-black text-stone-800 mb-2">
                            너를 지배하는 기운
                        </h2>
                        <span className="inline-block bg-black text-white px-4 py-1 text-xs font-bold rounded-full mb-6">
                            TEN GODS ANALYSIS
                        </span>

                        <div className="bg-stone-100 p-8 rounded-2xl border-2 border-stone-200 shadow-inner">
                            <p className="text-4xl font-black text-red-600 mb-4">
                                {aiData?.tenGodsAnalysis?.dominant || "불명"}
                            </p>
                            <p className="text-stone-600 font-medium leading-relaxed whitespace-pre-wrap break-keep">
                                {formatWithSentenceBreaks(aiData?.tenGodsAnalysis?.explanation || "아직 분석 중...")}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* --- SCENE 3: MASK vs REAL (Contrast) --- */}
            <section className="relative w-full">
                {/* 1. SOCIAL MASK (Bright/Upper) */}
                <motion.div
                    className="bg-[#f0f4f8] p-10 pb-20 clip-path-slant-bottom relative z-10"
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* ... (Animation logic is inherited from parent in actual DOM, but here just updating the text class) */}
                    <div className="absolute top-4 right-4 text-[4rem] opacity-10">🎭</div>
                    <h3 className="text-sm font-bold text-blue-900 tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        남들이 보는 너
                    </h3>
                    <p className="text-3xl font-black text-stone-800 mb-4 leading-tight">
                        "{aiData?.socialMask?.title || "분석 중..."}"
                    </p>
                    <p className="text-stone-600 font-medium leading-relaxed text-left whitespace-pre-wrap break-keep">
                        {formatWithSentenceBreaks(aiData?.socialMask?.description || "할머니가 네 사회성을 꿰뚫어보고 있다...")}
                    </p>

                    {/* Gauge Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-xs font-bold text-stone-400 mb-1">
                            <span>사회성 레벨</span>
                            <span>{aiData?.socialMask?.score || 0}%</span>
                        </div>
                        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${aiData?.socialMask?.score || 50}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. REAL SELF (Dark/Lower) */}
                <motion.div
                    className="bg-stone-900 text-white p-10 pt-20 -mt-10 relative z-0"
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                >
                    <div className="absolute bottom-4 right-4 text-[4rem] opacity-10">🦁</div>
                    <h3 className="text-sm font-bold text-red-400 tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        진짜 속마음
                    </h3>
                    <p className="text-3xl font-black text-white mb-4 leading-tight">
                        "{aiData?.realSelf?.title || "..."}"
                    </p>
                    <p className="text-stone-300 font-medium leading-relaxed text-justify opacity-90 whitespace-pre-wrap break-keep">
                        {formatWithSentenceBreaks(aiData?.realSelf?.description || "네 속마음은 AI도 놀랄 만큼 깊구나.")}
                    </p>
                </motion.div>
            </section>


            {/* --- SCENE 4: CAREER ADVICE (Action) --- */}
            <section className="bg-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-stone-300"></div>

                <motion.div
                    className="bg-[#fdfbf7] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-sm mx-auto relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 font-bold tracking-widest transform -rotate-2">
                        할미의 쓴소리
                    </div>

                    <div className="text-center pt-6 space-y-6">
                        <div>
                            <p className="text-xs font-bold text-stone-400 mb-1">RECOMMENDATION</p>
                            <p className="text-xl font-black text-black underline decoration-red-500 decoration-4 underline-offset-4">
                                {aiData?.career?.recommendation || "할머니 생각 정리 중..."}
                            </p>
                        </div>

                        <div className="w-full h-px bg-stone-200"></div>

                        <p className="text-stone-700 font-medium leading-relaxed italic whitespace-pre-wrap break-keep">
                            "{aiData?.career?.scolding || "정신 똑바로 차려!"}"
                        </p>
                    </div>
                </motion.div>


            </section>
        </div>
    );
};

export default Chapter3;
