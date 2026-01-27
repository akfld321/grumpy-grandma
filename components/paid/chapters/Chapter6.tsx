'use client';

import React, { useState } from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter6AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import Image from 'next/image';

interface Chapter6Props {
    content: ChapterContent;
    forceExpanded?: boolean;
}

const Chapter6: React.FC<Chapter6Props> = ({ content, forceExpanded = false }) => {
    const aiData = content.aiResponse as Chapter6AIResponse | undefined;
    const [isRevealed, setIsRevealed] = useState(forceExpanded);

    // Default to "Not Found" UI if data is missing, but ideally AI provides this.
    // However, the component visuals depend heavily on `hasNobleman`.
    // We can fallback to `false` (Self-made) for safety.
    const hasNobleman = aiData?.hasNobleman ?? false;

    return (
        <div className="w-full flex-1 bg-stone-900 font-serif text-stone-100 relative flex flex-col">

            {/* Background Atmosphere */}
            {/* Background Atmosphere - Simplified (No side/top gradients) */}
            {/* Background Atmosphere - Pure Black now, no noise */}
            {/* <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div> */}

            {/* Subtle central spotlight instead of heavy gradients */}
            {/* Subtle central spotlight removed for pure black clarity */}

            {/* --- INTRO SECTION --- */}
            <motion.div
                className="pt-12 px-6 text-center z-10 w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <p className="text-xs font-bold tracking-[0.3em] text-stone-500 mb-4">CHAPTER 06</p>
                <h2 className="text-3xl font-black mb-4 leading-tight">
                    {hasNobleman ? (
                        <>
                            어둠 속의 <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">등불</span>
                        </>
                    ) : (
                        <>
                            홀로 비추는 <span className="text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]">별</span>
                        </>
                    )}
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {hasNobleman
                        ? "네 인생이 힘들 때마다\n어디선가 나타나는 손길이 있어."
                        : "누군가의 도움을 기다리지 마라.\n너는 스스로 빛을 내는 놈이야."}
                </p>
            </motion.div>

            {/* --- INTERACTIVE VISUAL --- */}
            <div className="flex-1 w-full flex items-center justify-center relative my-10 min-h-[400px]">
                {/* The Object (Lantern or Mirror/Star) */}
                <motion.div
                    onClick={() => setIsRevealed(true)}
                    className="relative cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Glow Effect - Always Visible now */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[60px] animate-pulse ${hasNobleman ? 'bg-amber-500/30' : 'bg-slate-200/20'
                        }`}></div>

                    {/* Image Container */}
                    <div className="w-64 h-64 relative">
                        {hasNobleman ? (
                            // Lantern Image -> Talisman (Light/Help)
                            <Image
                                src="/prop_talisman.png"
                                alt="Nobleman Talisman"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            />
                        ) : (
                            // Lone Wolf / Sword -> Intense Grandma (Self-made strength)
                            <Image
                                src="/grandma_intense_v2.png"
                                alt="Self-made Strength"
                                fill
                                className="object-contain drop-shadow-2xl grayscale contrast-125"
                            />
                        )}

                        {/* 'Touch' hint */}
                        {!isRevealed && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-stone-400 animate-bounce whitespace-nowrap">
                                결과 풀이 보기 👇
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* --- REVEAL CONTENT --- */}
            {isRevealed && aiData && (
                <motion.div
                    className="w-full px-6 pb-24 z-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl ${hasNobleman
                        ? 'bg-amber-950/40 border-amber-500/30'
                        : 'bg-slate-900/40 border-slate-500/30'
                        }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{hasNobleman ? '🧚‍♂️' : '🐺'}</span>
                            <h3 className={`font-bold text-lg ${hasNobleman ? 'text-amber-400' : 'text-slate-300'
                                }`}>
                                {aiData.noblemanDescription.title}
                            </h3>
                        </div>

                        <p className="text-stone-300 text-sm leading-normal mb-6 whitespace-pre-wrap">
                            {formatWithSentenceBreaks(aiData.noblemanDescription.description)}
                        </p>

                        <div className="space-y-4">
                            <div className="bg-black/30 p-4 rounded-lg">
                                <p className="text-xs font-bold text-stone-500 mb-1">나타나는 시기 (Timing)</p>
                                <p className="text-stone-200 text-sm">{aiData.timing}</p>
                            </div>

                            <div className="bg-black/30 p-4 rounded-lg">
                                <p className="text-xs font-bold text-stone-500 mb-1">
                                    {hasNobleman ? '귀인을 얻는 법' : '스스로 일어서는 법'}
                                </p>
                                <p className="text-stone-200 text-sm italic whitespace-pre-wrap">{formatWithSentenceBreaks(aiData.advice)}</p>
                            </div>
                        </div>

                        {/* List of Nobleman Characters (if any) */}
                        {hasNobleman && aiData.noblemanList.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-xs text-stone-400 mb-4 font-bold tracking-wider uppercase">Your Nobleman Guardians</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {aiData.noblemanList.map((char, i) => {
                                        // Robust Mapping Logic
                                        let cleanChar = "";

                                        // 1. Priority: Extract Hanja (Most accurate)
                                        const hanjaMatch = char.match(/[子丑寅卯辰巳午未申酉戌亥甲乙丙丁戊己庚辛壬癸]/);
                                        if (hanjaMatch) {
                                            cleanChar = hanjaMatch[0];
                                        } else {
                                            // 2. Extract Hangul inside parentheses: "천을귀인(자)" -> "자"
                                            const parenMatch = char.match(/\((.)\)/);
                                            if (parenMatch) {
                                                cleanChar = parenMatch[1];
                                            } else {
                                                // 3. Fallback: Remove known prefixes "천을", "천덕", "월덕", "귀인" to avoid '을', '인' false matches
                                                // "천을귀인 자" -> " 자"
                                                const safeString = char.replace(/천을|천덕|월덕|귀인/g, "");
                                                const hangulMatch = safeString.match(/[자축인묘진사오미신유술해갑을병정무기경신임계]/);
                                                cleanChar = hangulMatch ? hangulMatch[0] : char.charAt(0);
                                            }
                                        }

                                        const mapping: Record<string, { animal: string, emoji: string }> = {
                                            // Earthly Branches (Animals)
                                            "자": { animal: "쥐 (자)", emoji: "🐭" }, "子": { animal: "쥐 (자)", emoji: "🐭" },
                                            "축": { animal: "소 (축)", emoji: "🐮" }, "丑": { animal: "소 (축)", emoji: "🐮" },
                                            "인": { animal: "호랑이 (인)", emoji: "🐯" }, "寅": { animal: "호랑이 (인)", emoji: "🐯" },
                                            "묘": { animal: "토끼 (묘)", emoji: "🐰" }, "卯": { animal: "토끼 (묘)", emoji: "🐰" },
                                            "진": { animal: "용 (진)", emoji: "🐲" }, "辰": { animal: "용 (진)", emoji: "🐲" },
                                            "사": { animal: "뱀 (사)", emoji: "🐍" }, "巳": { animal: "뱀 (사)", emoji: "🐍" },
                                            "오": { animal: "말 (오)", emoji: "🐴" }, "午": { animal: "말 (오)", emoji: "🐴" },
                                            "미": { animal: "양 (미)", emoji: "🐑" }, "未": { animal: "양 (미)", emoji: "🐑" },
                                            "신": { animal: "원숭이 (신)", emoji: "🐵" }, "申": { animal: "원숭이 (신)", emoji: "🐵" },
                                            "유": { animal: "닭 (유)", emoji: "🐔" }, "酉": { animal: "닭 (유)", emoji: "🐔" },
                                            "술": { animal: "개 (술)", emoji: "🐶" }, "戌": { animal: "개 (술)", emoji: "🐶" },
                                            "해": { animal: "돼지 (해)", emoji: "🐷" }, "亥": { animal: "돼지 (해)", emoji: "🐷" },

                                            // Heavenly Stems
                                            "갑": { animal: "거목 (갑)", emoji: "🌳" }, "甲": { animal: "거목 (갑)", emoji: "🌳" },
                                            "을": { animal: "화초 (을)", emoji: "🌿" }, "乙": { animal: "화초 (을)", emoji: "🌿" },
                                            "병": { animal: "태양 (병)", emoji: "☀️" }, "丙": { animal: "태양 (병)", emoji: "☀️" },
                                            "정": { animal: "촛불 (정)", emoji: "🕯️" }, "丁": { animal: "촛불 (정)", emoji: "🕯️" },
                                            "무": { animal: "태산 (무)", emoji: "⛰️" }, "戊": { animal: "태산 (무)", emoji: "⛰️" },
                                            "기": { animal: "옥토 (기)", emoji: "🏜️" }, "己": { animal: "옥토 (기)", emoji: "🏜️" },
                                            "경": { animal: "별 (경)", emoji: "⭐" }, "庚": { animal: "별 (경)", emoji: "⭐" },
                                            // Handle duplication for '신' (Monkey vs Jewel) below manually or use Hanja keys
                                            "신_STEM": { animal: "보석 (신)", emoji: "💎" }, "辛": { animal: "보석 (신)", emoji: "💎" },

                                            "임": { animal: "바다 (임)", emoji: "🌊" }, "壬": { animal: "바다 (임)", emoji: "🌊" },
                                            "계": { animal: "빗물 (계)", emoji: "🌧️" }, "癸": { animal: "빗물 (계)", emoji: "🌧️" }
                                        };

                                        // Disambiguate '신' (Monkey) vs '신' (Jewel/Needle)
                                        // If cleanChar is '신', it's ambiguous in Hangul.
                                        // Usually 'Monkey' (申) is Earthly Branch, 'Jewel' (辛) is Heavenly Stem.
                                        // Nobleman can be either.
                                        // Heuristic: If it came from "천을귀인", it's usually Branch (Monkey).
                                        // If "천덕/월덕", can be Stem (Jewel).
                                        // Defaulting to Monkey as it fits the "Animal" theme more visually, unless context implies otherwise.

                                        let info = mapping[cleanChar];
                                        if (cleanChar === '신') {
                                            // Check context if possible, otherwise default to Monkey
                                            // If text had "천덕" (Cheon-Deok) -> likely Stem (Jewel) for some permutations? 
                                            // Actually, Cheon-eul uses Branches. Cheon-deok uses Stems/Branches.
                                            // Let's just default to Monkey for consistency with Zodiac unless user complains.
                                            // Or show both? "원숭이/보석 (신)"
                                            info = { animal: "원숭이 (신)", emoji: "🐵" };
                                        } else if (cleanChar === '辛') { // Explicitly check for Hanja for Jewel
                                            info = mapping['신_STEM'];
                                        }


                                        if (!info) info = { animal: "귀인", emoji: "✨" };

                                        return (
                                            <div key={i} className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 p-[2px] shadow-lg shadow-amber-500/20">
                                                    <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-3xl">
                                                        {info.emoji}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-amber-400 font-bold text-sm">{info.animal}</span>
                                                    <span className="block text-stone-500 text-xs">{char}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Chapter6;
