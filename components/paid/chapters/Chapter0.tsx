'use client';

import React, { useRef } from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Chapter0Props {
    data: PaidSajuResult;
}

const Chapter0: React.FC<Chapter0Props> = ({ data }) => {
    const containerRef = useRef(null);

    // Parse Day Master
    const dayMasterChar = data.sajuKey.day.charAt(0);

    const getElementalVibe = (char: string) => {
        if (['갑', '을'].includes(char)) return { name: '나무(木)', desc: '곧게 뻗으려는 고집', color: 'text-green-500' };
        if (['병', '정'].includes(char)) return { name: '불(火)', desc: '활활 타오르는 욕망', color: 'text-red-500' };
        if (['무', '기'].includes(char)) return { name: '땅(土)', desc: '속을 알 수 없는 깊이', color: 'text-yellow-500' };
        if (['경', '신'].includes(char)) return { name: '쇠(金)', desc: '차가운 결단력', color: 'text-stone-300' };
        if (['임', '계'].includes(char)) return { name: '물(水)', desc: '어디로 튈지 모르는 꾀', color: 'text-blue-500' };
        return { name: '땅(土)', desc: '무거운 존재감', color: 'text-yellow-500' };
    };

    const myVibe = getElementalVibe(dayMasterChar);

    return (
        <div ref={containerRef} className="w-full max-w-md mx-auto bg-stone-950 text-stone-100 overflow-hidden relative font-sans min-h-screen">

            {/* --- Scene 1: The Gate --- */}
            <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center">
                <div className="absolute inset-0">
                    <Image
                        src="/shaman_house_entrance.png"
                        alt="Shaman House"
                        fill
                        className="object-cover opacity-50 grayscale contrast-125"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-stone-950" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    className="z-10 text-center space-y-6 p-6"
                >
                    <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                        조선의<br />
                        <span className="text-red-600">욕쟁이</span><br />
                        할머니
                    </h1>
                    <p className="text-stone-400 text-sm font-medium tracking-widest uppercase border-t border-stone-800 pt-6 inline-block">
                        The Shaman of Joseon
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-[25%] flex flex-col items-center gap-2 z-20 pointer-events-none"
                >
                    <p className="text-stone-300 text-sm font-bold tracking-widest drop-shadow-md bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        아래로 내려주세요
                    </p>
                    <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <span className="text-white text-xl">↓</span>
                    </div>
                </motion.div>
            </section>

            {/* --- Scene 2: The Eerie Silence --- */}
            <section className="relative min-h-[30vh] flex items-center justify-center px-8 py-10 bg-stone-950">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-lg text-center leading-loose font-serif text-stone-300"
                >
                    "문지방 닳겠다.<br />
                    뭘 그리 망설이고 서 있나?"
                </motion.p>
            </section>

            {/* --- Scene 3: The Encounter --- */}
            <section className="relative w-full py-20 px-6 flex flex-col items-center bg-stone-900 border-t border-stone-800">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-48 h-48 relative rounded-full border-4 border-stone-700 shadow-[0_0_30px_rgba(255,0,0,0.1)] mb-12 grayscale-[0.3]"
                >
                    <Image src="/grandma_webtoon_style.png" alt="Grandma" fill className="object-cover rounded-full" />
                </motion.div>

                <div className="space-y-12 w-full max-w-sm">
                    {/* Dialogue 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-black/40 p-6 rounded-2xl rounded-tl-none border-l-4 border-stone-500 backdrop-blur-md shadow-lg"
                    >
                        <p className="text-xl leading-relaxed text-stone-200 font-medium">
                            "쯧쯧... 미간(眉間)에 <br />
                            <span className="text-stone-400 font-bold border-b border-stone-500 pb-1">먹구름</span>이 아주 꽉 끼었구나."
                        </p>
                    </motion.div>

                    {/* Dialogue 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-black/40 p-6 rounded-2xl rounded-tr-none border-r-4 border-red-800 text-right backdrop-blur-md shadow-lg mt-8"
                    >
                        <p className="text-xl leading-relaxed text-stone-200 font-medium">
                            "아등바등 살아봐야...<br />
                            다 <span className="text-red-500 font-bold">내 팔자(八字)</span> 소관이니라."
                        </p>
                    </motion.div>

                    {/* The Reveal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-20 pt-12 border-t border-stone-800 text-center"
                    >
                        <p className="text-stone-500 text-sm mb-4">할머니가 빤히 쳐다봅니다</p>
                        <h3 className="text-2xl font-black text-white mb-2">
                            "너는... <span className={`${myVibe.color}`}>{myVibe.name}</span>의 기운이야."
                        </h3>
                        <p className="text-stone-400 font-medium">
                            {myVibe.desc}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Scene 4: The Scroll --- */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center bg-stone-950 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/grandma_scroll_open.png"
                        alt="Scroll"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
                </div>

                <div className="z-10 text-center px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <p className="text-stone-400 text-sm">"내 기분이니라."</p>
                        <h2 className="text-3xl font-black text-white leading-tight">
                            "네 놈의 <span className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">본성(本性)</span>과<br />
                            <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">숨겨진 가면</span>까진...<br />
                            <span className="text-stone-400 text-2xl">돈 안 받고 그냥 보여주마."</span>
                        </h2>
                        <p className="text-stone-500 text-xs mt-6 leading-relaxed">
                            허나, 네 진짜 <span className="text-red-500 font-bold">운명의 그릇</span>을 보고 싶다면<br />
                            그땐 복채를 내놓거라. 세상에 공짜는 없는 법이다.
                        </p>
                        <div className="w-1 h-20 bg-gradient-to-b from-red-600 to-transparent mx-auto mt-8 opacity-50"></div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Chapter0;
