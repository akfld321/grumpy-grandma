'use client';

import React from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ELEMENT_COLORS } from '@/lib/saju';
import { Sparkles, Map, Lock, Unlock, Fingerprint } from 'lucide-react';

interface Chapter1Props {
    data: PaidSajuResult;
}

const Chapter1: React.FC<Chapter1Props> = ({ data }) => {
    // Access enhanced pillars data directly
    const pillarsData = data.pillars || {
        year: { gan: { char: '?', sound: '?', trait: '?', color: 'wood' }, ji: { char: '?', sound: '?', animal: '?', color: 'wood' }, tenGod: '?', relation: '?' },
        month: { gan: { char: '?', sound: '?', trait: '?', color: 'fire' }, ji: { char: '?', sound: '?', animal: '?', color: 'fire' }, tenGod: '?', relation: '?' },
        day: { gan: { char: '?', sound: '?', trait: '?', color: 'earth' }, ji: { char: '?', sound: '?', animal: '?', color: 'earth' }, tenGod: '?', relation: '?' },
        time: { gan: { char: '?', sound: '?', trait: '?', color: 'metal' }, ji: { char: '?', sound: '?', animal: '?', color: 'metal' }, tenGod: '?', relation: '?' }
    };

    const columns = [
        { label: "년주(Year)", sub: "초년운/조상", data: pillarsData.year, delay: 0.1 },
        { label: "월주(Month)", sub: "청년운/사회", data: pillarsData.month, delay: 0.2 },
        { label: "일주(Day)", sub: "나/배우자", data: pillarsData.day, highlight: true, delay: 0.3 },
        { label: "시주(Time)", sub: "말년운/자식", data: pillarsData.time, delay: 0.4 }
    ];

    return (
        <div className="w-full max-w-md mx-auto bg-stone-950 text-stone-100 relative font-sans min-h-screen py-20 px-4 overflow-hidden">

            {/* Background Texture Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
            </div>

            {/* --- Title Section --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 relative z-10"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] text-xs font-bold rounded-full mb-4 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                    <Map size={12} />
                    DESTINY BLUEPRINT
                </motion.div>
                <h2 className="text-4xl font-black text-white px-2 leading-tight tracking-tight drop-shadow-2xl">
                    너의 <span className="text-[#d4af37]">운명 설계도</span>
                </h2>
                <p className="text-stone-500 text-sm mt-3 font-serif">
                    태어난 순간 정해진 고유한 바코드
                </p>
            </motion.div>

            {/* --- The Saju Grid (Mandala Concept) --- */}
            <div className="relative z-10 mb-16">
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {columns.map((col, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50, rotateX: 90 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: col.delay, duration: 0.6, type: "spring" }}
                            viewport={{ once: true }}
                            className={`flex flex-col relative group ${col.highlight ? 'z-20' : 'z-10'}`}
                        >
                            {/* Connector Line (Design Element) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-stone-700 to-transparent -z-10"></div>

                            {/* Label */}
                            <div className="text-center mb-2">
                                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">{col.label.split('(')[1].replace(')', '')}</span>
                            </div>

                            {/* The Pillar Card */}
                            <div className={`
                                relative flex flex-col items-center p-1 sm:p-2 rounded-xl border-2 transition-all duration-300
                                ${col.highlight
                                    ? 'bg-stone-900 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)] scale-105'
                                    : 'bg-stone-900/50 border-stone-800 hover:border-stone-600'}
                            `}>
                                {col.highlight && (
                                    <div className="absolute -top-3 px-2 py-0.5 bg-[#d4af37] text-stone-950 text-[10px] font-black rounded shadow-lg flex items-center gap-1">
                                        <Fingerprint size={10} /> ME
                                    </div>
                                )}

                                {/* Sky (Cheongan) */}
                                <div className={`
                                    w-full aspect-square rounded-lg mb-1 flex flex-col items-center justify-center relative overflow-hidden
                                    ${ELEMENT_COLORS[col.data.gan.color] || 'bg-stone-800'}
                                    bg-opacity-80 backdrop-blur-sm border border-white/10 shadow-inner
                                `}>
                                    <span className="text-[9px] absolute top-1 left-1.5 opacity-60 font-medium">{col.data.gan.trait}</span>
                                    <span className="text-3xl sm:text-4xl font-serif text-white drop-shadow-md">{col.data.gan.char}</span>
                                    <span className="text-[9px] absolute bottom-1 right-1.5 opacity-60 font-bold">{col.data.gan.sound}</span>
                                </div>

                                {/* Earth (Jiji) */}
                                <div className={`
                                    w-full aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden
                                    ${ELEMENT_COLORS[col.data.ji.color] || 'bg-stone-800'}
                                    bg-opacity-80 backdrop-blur-sm border border-white/10 shadow-inner
                                `}>
                                    <span className="text-[9px] absolute top-1 left-1.5 opacity-60 font-medium">{col.data.ji.animal}</span>
                                    <span className="text-3xl sm:text-4xl font-serif text-white drop-shadow-md">{col.data.ji.char}</span>
                                    <span className="text-[9px] absolute bottom-1 right-1.5 opacity-60 font-bold">{col.data.ji.sound}</span>
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="text-center mt-3">
                                <span className={`text-[10px] sm:text-xs font-medium ${col.highlight ? 'text-[#d4af37]' : 'text-stone-500'}`}>
                                    {col.sub}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- Interpretation Section --- */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative z-10"
            >
                {/* Grandma's Comment */}
                <div className="bg-[#f5f5f4] text-stone-900 rounded-2xl rounded-tl-none p-6 shadow-xl relative mx-2 mb-8 border-2 border-stone-200">
                    <div className="absolute -top-12 left-0 w-20 h-20 rounded-full border-4 border-[#f5f5f4] overflow-hidden bg-stone-300 shadow-lg">
                        <Image src="/grandma_webtoon_style.png" alt="Grandma" fill className="object-cover" />
                    </div>

                    <div className="ml-4 mt-2">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            "네 놈의 바코드다!"
                        </h3>
                        <p className="text-sm leading-7 text-stone-700">
                            "저기 금테 두른 <span className="bg-[#d4af37] text-white px-1 font-bold rounded-sm">일주(Day)</span>가 바로 너다.
                            나머지 글자들은 네가 살아갈 세상이고 환경이지.<br />
                            사주팔자라는게 별거 아니다. 그냥 네가 태어날 때 우주가 찍어준 <span className="underline decoration-wavy decoration-red-500 underline-offset-4">디지털 지문</span> 같은 거야.
                            바꿀 순 없지만, 어떻게 쓸지는 네 맘이다."
                        </p>
                    </div>
                </div>

                {/* Deep Dive Cards */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-2 mb-2">
                        <Sparkles size={16} className="text-[#d4af37]" />
                        <span className="text-sm font-bold text-stone-400">BLUEPRINT DETAILS</span>
                    </div>

                    {[
                        {
                            id: 'year', icon: '🌱', title: '년주 (The Root)', desc: '초년운과 조상의 기운. 네 인생의 뿌리.',
                            link: '5장 [배경/신살]', color: 'border-stone-700'
                        },
                        {
                            id: 'month', icon: '🏢', title: '월주 (The Society)', desc: '사회생활, 직업, 그리고 부모님. 청년기의 무대.',
                            link: '9장 [직업/적성]', color: 'border-stone-700'
                        },
                        {
                            id: 'day', icon: '👤', title: '일주 (The Self)', desc: '가장 중요한 "나" 자신. 그리고 배우자의 자리.',
                            link: '2장 [성격/자아]', color: 'border-[#d4af37]', highlight: true
                        },
                        {
                            id: 'time', icon: '🍎', title: '시주 (The Fruit)', desc: '말년의 결실과 자식 농사. 인생의 마무리.',
                            link: '11장 [대운/미래]', color: 'border-stone-700'
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            viewport={{ once: true }}
                            className={`
                                flex items-start gap-4 p-4 rounded-xl bg-stone-900 border ${item.color}
                                ${item.highlight ? 'bg-gradient-to-r from-stone-900 to-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : ''}
                            `}
                        >
                            <div className="text-2xl mt-1 grayscale opacity-80">{item.icon}</div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold mb-1 ${item.highlight ? 'text-[#d4af37]' : 'text-stone-300'}`}>
                                    {item.title}
                                </h4>
                                <p className="text-xs text-stone-500 leading-relaxed mb-2">
                                    {item.desc}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-stone-600">
                                    <Unlock size={10} />
                                    <span>{item.link}에서 공개</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center px-8">
                    <p className="text-[10px] text-stone-600">
                        * 태어난 시간을 정확히 모르면 시주 분석은 달라질 수 있습니다.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Chapter1;
