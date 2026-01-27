"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SajuResult } from "@/lib/saju";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Share2, Lock, Sparkles, ChevronDown, Check, Clock, ShieldAlert, Calendar, Coins, UserX, ScrollText } from "lucide-react";

interface WebtoonResultProps {
    result: SajuResult;
    onReset: () => void;
}

// 20 Archetypes with Groups
const ARCHETYPES = {
    A: [
        { id: 'emperor', name: '절대 군주', img: '/pl_emperor.png', desc: '모든 이를 발아래 두었던...' },
        { id: 'queen', name: '왕비/귀비', img: '/pl_emperor.png', desc: '우아함 속에 감춰진 권력...' },
        { id: 'merchant', name: '천하의 거상', img: '/past_life_merchant.png', desc: '황금 위에 앉아 호령하던...' },
        { id: 'official', name: '고위 관료', img: '/pl_emperor.png', desc: '나라의 근간을 흔들던...' },
    ],
    B: [
        { id: 'artist', name: '천재 화가', img: '/past_life_artist.png', desc: '붓 하나로 세상을 그렸던...' },
        { id: 'gisaeng', name: '전설의 기생', img: '/past_life_artist.png', desc: '한 곡조로 심금을 울리던...' },
        { id: 'scholar', name: '초야의 선비', img: '/past_life_artist.png', desc: '세상을 등지고 도를 닦던...' },
        { id: 'doctor', name: '신의(神醫)', img: '/past_life_artist.png', desc: '죽은 사람도 살려내던...' },
    ],
    C: [
        { id: 'general', name: '전장의 장군', img: '/past_life_general.png', desc: '붉은 갑옷을 입고 적진을 누비던...' },
        { id: 'guard', name: '호위 무사', img: '/past_life_general.png', desc: '그림자처럼 주군을 지키던...' },
        { id: 'rogue', name: '의로운 협객', img: '/past_life_general.png', desc: '바람처럼 나타나 사라지던...' },
        { id: 'hunter', name: '전설의 사냥꾼', img: '/past_life_general.png', desc: '호랑이를 맨손으로 잡던...' },
    ],
    D: [
        { id: 'gumiho', name: '구미호', img: '/past_life_gumiho.png', desc: '아홉 꼬리로 사람을 홀리던...' },
        { id: 'shaman', name: '신비한 무당', img: '/past_life_gumiho.png', desc: '신과 인간을 이어주던...' },
        { id: 'goblin', name: '도깨비', img: '/past_life_gumiho.png', desc: '장난기 가득한 신비한 존재...' },
        { id: 'executioner', name: '망나니', img: '/past_life_gumiho.png', desc: '업보를 짊어지고 살아가던...' },
    ],
    E: [
        { id: 'blacksmith', name: '대장장이', img: '/past_life_merchant.png', desc: '불꽃 속에서 철을 두드리던...' },
        { id: 'innkeeper', name: '주막 주인', img: '/past_life_merchant.png', desc: '오가는 사람들의 말동무...' },
        { id: 'peddler', name: '보부상', img: '/past_life_merchant.png', desc: '팔도를 유랑하며 소식을 전하던...' },
        { id: 'farmer', name: '대농(大農)', img: '/past_life_merchant.png', desc: '황금 들녘을 일구던...' },
    ]
};

const GRANDMA_ROASTS = {
    wood: { msg: "나무(木)가 없어서 시작을 못해!", sub: "맨날 생각만 하고 실천을 안 하니 원..." },
    fire: { msg: "불(火)이 없어서 추진력이 꽝이야!", sub: "열정이 식어빠진 국밥 같구나. 쯧쯧." },
    earth: { msg: "흙(土)이 없어서 끈기가 부족해!", sub: "조금만 힘들어도 포기하지? 다 보인다." },
    metal: { msg: "쇠(金)가 없어서 맺고 끊질 못해!", sub: "우유부단하게 이리저리 휘둘리는구만." },
    water: { msg: "물(水)이 없어서 융통성이 없어!", sub: "앞뒤가 꽉 막혀서 답답해 죽겠네." },
    balanced: { msg: "오행은 멀쩡한데... 니가 문제네!", sub: "사주 핑계 댈 생각 말고 정신 차려!" }
};

// Element Colors matching the specific reference image
const ELEMENT_COLORS = {
    wood: { bg: '#2A9D8F', label: '목(木)', text: 'text-[#2A9D8F]' }, // Teal
    fire: { bg: '#E76F51', label: '화(火)', text: 'text-[#E76F51]' }, // Red/Orange
    earth: { bg: '#E9C46A', label: '토(土)', text: 'text-[#E9C46A]' }, // Mustard
    metal: { bg: '#8A8A8E', label: '금(金)', text: 'text-[#8A8A8E]' }, // Grey
    water: { bg: '#264653', label: '수(水)', text: 'text-[#264653]' }  // Dark Charcoal
};

const BarChartSection = ({ data }: { data: { id: string, label: string, val: number }[] }) => {
    // Calculate total for percentages
    const total = data.reduce((acc, cur) => acc + cur.val, 0) || 1;

    // Helper to get status text
    const getStatus = (percent: number) => {
        if (percent === 0) return { text: "결핍", color: "text-red-500" };
        if (percent < 15) return { text: "부족", color: "text-orange-400" };
        if (percent > 35) return { text: "과다", color: "text-purple-600" };
        return { text: "적정", color: "text-slate-500" };
    };

    // Calculate Percentages
    const processedData = data.map(d => {
        const percent = (d.val / total) * 100;
        return { ...d, percent, ...getStatus(percent) };
    });

    // Determine Yongsin (Weakest) and Gisin (Strongest) for visual mock
    const sorted = [...processedData].sort((a, b) => a.val - b.val);
    const yongsin = sorted[0].val === 0 ? sorted.find(d => d.val > 0) || sorted[0] : sorted[0]; // Simplistic logic: Weakest needed
    const gisin = sorted[sorted.length - 1]; // Strongest is excess

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <h2 className="text-lg font-bold text-slate-800">오행비율: 실제 내 사주 속 오행의 강약</h2>
            </div>

            {/* Bar Chart Container */}
            <div className="relative h-64 flex items-end justify-between gap-4 px-4 mb-10">
                {/* Tooltip Badge */}
                <div className="absolute -top-4 left-0 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg after:content-[''] after:absolute after:top-full after:left-4 after:border-[6px] after:border-transparent after:border-t-black">
                    나의 오행
                </div>

                {processedData.map((d) => (
                    <div key={d.id} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                        {/* Status Badge on Hover */}
                        <div className="absolute -top-8 px-2 py-1 bg-stone-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {d.percent.toFixed(1)}%
                        </div>

                        {/* Bar */}
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${Math.max(d.percent, 5)}%` }} // Min height 5% for visibility
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-full rounded-t-lg relative hover:brightness-110 transition-all shadow-sm"
                            style={{ backgroundColor: ELEMENT_COLORS[d.id as keyof typeof ELEMENT_COLORS].bg }}
                        />

                        {/* Label */}
                        <div className={`font-serif font-bold mt-3 ${ELEMENT_COLORS[d.id as keyof typeof ELEMENT_COLORS].text}`}>
                            {d.label.split('(')[1].replace(')', '')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed List */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-8">
                {processedData.map((d, i) => (
                    <div key={d.id} className="flex items-center justify-between p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded" style={{ backgroundColor: ELEMENT_COLORS[d.id as keyof typeof ELEMENT_COLORS].bg }} />
                            <span className={`font-bold ${ELEMENT_COLORS[d.id as keyof typeof ELEMENT_COLORS].text}`}>{d.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <span className="text-slate-800">{d.percent.toFixed(1)}%</span>
                            <span className="text-stone-300">|</span>
                            <span className={`${d.color}`}>{d.text}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Yongsin/Heesin/Gisin Logic (Visual Mock) */}
            <div className="grid grid-cols-3 gap-4 text-center">
                {/* Yongsin */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-xs text-stone-500 font-bold block mb-2">용신 (필요)</span>
                    <div className="w-12 h-12 rounded-full border-2 mx-auto flex items-center justify-center font-black text-lg mb-1" style={{ borderColor: ELEMENT_COLORS[yongsin.id as keyof typeof ELEMENT_COLORS].bg, color: ELEMENT_COLORS[yongsin.id as keyof typeof ELEMENT_COLORS].bg }}>
                        {yongsin.label.split('(')[1].replace(')', '')}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{yongsin.label}</span>
                </div>

                {/* Heesin - Just pick the second weakest for mock */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-xs text-stone-500 font-bold block mb-2">희신 (도움)</span>
                    <div className="w-12 h-12 rounded-full border-2 border-stone-300 mx-auto flex items-center justify-center font-black text-lg mb-1 text-stone-400">
                        ?
                    </div>
                    <span className="text-[10px] text-stone-400">유료 확인</span>
                </div>

                {/* Gisin */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-xs text-stone-500 font-bold block mb-2">기신 (방해)</span>
                    <div className="w-12 h-12 rounded-full border-2 mx-auto flex items-center justify-center font-black text-lg mb-1 grayscale opacity-70" style={{ borderColor: ELEMENT_COLORS[gisin.id as keyof typeof ELEMENT_COLORS].bg, color: ELEMENT_COLORS[gisin.id as keyof typeof ELEMENT_COLORS].bg }}>
                        {gisin.label.split('(')[1].replace(')', '')}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{gisin.label}</span>
                </div>
            </div>

            <p className="text-[10px] text-center text-stone-400 mt-4">* 억부용신 및 조후용신을 고려한 결과입니다.</p>
        </div>
    );
};

import { sendGTMEvent } from "@/lib/gtm";

export default function WebtoonResult({ result, onReset }: WebtoonResultProps) {
    useEffect(() => {
        sendGTMEvent('free_result_view');
    }, []);

    const [price, setPrice] = useState(34800);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
    const [purchaseCount, setPurchaseCount] = useState(12842);
    const [socialProofVisible, setSocialProofVisible] = useState(true);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Social Proof Ticker Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setSocialProofVisible(false);
            setTimeout(() => {
                setPurchaseCount(prev => prev + Math.floor(Math.random() * 3) + 1);
                setSocialProofVisible(true);
            }, 500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}시간 ${m}분 ${s}초`;
    };

    // Dynamic Logic
    const roast = useMemo(() => {
        const el = result.fiveElements || { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };
        if (el.fire === 0) return GRANDMA_ROASTS.fire;
        if (el.wood === 0) return GRANDMA_ROASTS.wood;
        if (el.earth === 0) return GRANDMA_ROASTS.earth;
        if (el.metal === 0) return GRANDMA_ROASTS.metal;
        if (el.water === 0) return GRANDMA_ROASTS.water;
        return GRANDMA_ROASTS.balanced;
    }, [result]);

    const pastLife = useMemo(() => {
        const el = result.fiveElements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const scores = {
            A: el.metal + el.fire,
            B: el.wood + el.fire,
            C: el.metal + el.wood,
            D: el.water,
            E: el.earth
        };
        let bestGroup: keyof typeof ARCHETYPES = 'E';
        let maxScore = -1;
        (Object.keys(scores) as Array<keyof typeof scores>).forEach(group => {
            if (scores[group] > maxScore) {
                maxScore = scores[group];
                bestGroup = group;
            }
        });
        const groupItems = ARCHETYPES[bestGroup];
        const hash = result.text.length + (result.text.charCodeAt(0) || 0);
        return groupItems[hash % groupItems.length];
    }, [result]);

    const handleShare = () => {
        if (!discountApplied) {
            setDiscountApplied(true);
            setPrice(31320);
        }
    };

    const elementsData = result.fiveElements ? [
        { id: 'wood', label: '목(木)', val: result.fiveElements.wood },
        { id: 'fire', label: '화(火)', val: result.fiveElements.fire },
        { id: 'earth', label: '토(土)', val: result.fiveElements.earth },
        { id: 'metal', label: '금(金)', val: result.fiveElements.metal },
        { id: 'water', label: '수(水)', val: result.fiveElements.water }
    ] : [];

    return (
        <div className="w-full h-full bg-[#f4e4bc] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] overflow-y-auto pb-40 font-sans text-slate-900 scroll-smooth">

            {/* 1. HEADER */}
            <motion.section
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="relative w-full aspect-[4/5] md:aspect-[3/4] border-b-4 border-black bg-stone-800 overflow-hidden"
            >
                <Image src="/grandma_result_1.png" alt="Grandma" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-8 left-4 right-4 bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_#000]"
                >
                    <p className="font-extrabold text-xl font-aggro break-keep">
                        "{roast.msg}"
                    </p>
                    <p className="text-sm mt-2 text-stone-600 font-bold">
                        {roast.sub}
                    </p>
                    <div className="absolute -top-3 right-6 w-6 h-6 bg-white border-t-4 border-r-4 border-black rotate-45 transform origin-center"></div>
                </motion.div>
            </motion.section>

            {/* 2. BAR CHART ANLYSIS */}
            <motion.section
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-8 border-b-4 border-black bg-white relative"
            >
                <BarChartSection data={elementsData} />

                <div className="bg-stone-100 p-4 border-2 border-stone-300 rounded-lg text-center mt-8">
                    <p className="text-stone-500 font-bold mb-1">당신의 MBTI 유형</p>
                    <p className="text-2xl font-black font-aggro text-indigo-600">"자유로운 영혼"</p>
                </div>
            </motion.section>

            {/* 3. PAST LIFE TEASER */}
            <section className="relative w-full aspect-[4/5] bg-slate-900 border-b-4 border-black overflow-hidden">
                <Image src={pastLife.img} alt="Past Life" fill className="object-cover opacity-50 blur-xl scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative">
                            <Lock className="text-yellow-400 mx-auto mb-4 drop-shadow-lg" size={40} />
                            <h3 className="text-white text-lg font-medium mb-2 opacity-80">당신의 전생은...</h3>
                            <div className="text-3xl font-black text-white mb-4 font-aggro">{pastLife.name}</div>
                            <p className="text-white/70 text-sm mb-6">{pastLife.desc}</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- PREMIUM CONTENT START --- */}

            {/* 4. SNEAK PEEK (Genuine Webtoon Style) */}
            <section className="bg-stone-200 py-12 px-4 border-b-4 border-black">
                {/* Responsive Constraint: Max Width 600px */}
                <div className="max-w-[600px] mx-auto space-y-6">

                    {/* CUT 1: GRANDMA SHOUTING (WEBTOON FLEX LAYOUT) */}
                    <div className="bg-white border-4 border-black relative overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.2)] h-[650px] flex flex-col">
                        {/* Panel Header */}
                        <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-black text-xs z-30 border-b-2 border-r-2 border-white">
                            EP.01 팩트폭력
                        </div>

                        {/* Dramatic Background Lines (Absolute, behind flex items) */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle,white_20%,transparent_20%),radial-gradient(circle,transparent_20%,#ff0000_20%)] bg-[length:20px_20px] opacity-10 animate-pulse pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_170deg,black_180deg,transparent_190deg)] opacity-10 pointer-events-none"></div>

                        {/* SECTION 1: TOP - SPEECH BUBBLE AREA (45%) */}
                        <div className="relative h-[45%] flex items-end justify-center pb-4 z-20">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-xl relative w-[90%] max-w-[320px]"
                            >
                                <h3 className="font-black text-2xl text-center leading-tight mb-2 font-aggro break-keep">
                                    "야! <span className="text-red-600 underline decoration-4 decoration-yellow-400">{result.userName || '네 놈'}</span>!"
                                </h3>
                                <p className="text-center font-bold text-slate-800 text-sm leading-relaxed break-keep">
                                    {(() => {
                                        const mbti = (result.mbti || "??").toUpperCase();
                                        // MBTI Traits Mapping for Cut 1
                                        const MBTI_TRAITS: Record<string, string> = {
                                            'ISTJ': '꽉 막힌', 'ISFJ': '답답해터진', 'INFJ': '속을 모를', 'INTJ': '재수없는',
                                            'ISTP': '게으른', 'ISFP': '우유부단한', 'INFP': '망상쟁이', 'INTP': '사회성 없는',
                                            'ESTP': '사고뭉치', 'ESFP': '철 없는', 'ENFP': '시끄러운', 'ENTP': '말만 많은',
                                            'ESTJ': '꼰대같은', 'ESFJ': '오지랖인', 'ENFJ': '착한척하는', 'ENTJ': '독재자같은'
                                        };
                                        const trait = MBTI_TRAITS[mbti] || '특이한';
                                        return `니 놈의 그 [${trait}] 성격 때문에 다 망치고 있는 거 안 보이냐?!`;
                                    })()}
                                </p>
                                {/* Bubble Tail - Pointing Down */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-black rotate-45 transform"></div>
                            </motion.div>
                        </div>

                        {/* SECTION 2: BOTTOM - GRANDMA IMAGE AREA (55%) */}
                        <div className="relative h-[55%] w-full">
                            <Image
                                src="/grandma_shocked.png"
                                alt="Grandma Shouting"
                                fill
                                className="object-cover object-top"
                                quality={100}
                                priority
                            />
                        </div>

                        {/* Sound Effect Text (Overlay) */}
                        <div className="absolute top-4 right-4 text-4xl font-black text-red-600 rotate-12 drop-shadow-[2px_2px_0px_#000] z-30 font-aggro pointer-events-none">
                            쿠쿵!!
                        </div>
                    </div>

                    {/* CUT 2: SECRET DOCUMENT (POV) */}
                    <div className="bg-stone-800 border-4 border-black p-4 relative shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
                        <div className="absolute -top-3 left-4 bg-yellow-400 border-2 border-black px-4 py-1 font-bold text-xs shadow-[2px_2px_0px_#000] z-20">
                            할머니의 비밀 문서
                        </div>

                        {/* The Document Visual */}
                        <div className="bg-[#fffdf5] p-6 rotate-1 border border-stone-400 min-h-[200px] relative">
                            {/* Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-red-600/50 -rotate-2"></div>

                            <h4 className="font-black text-lg mb-4 text-center border-b-2 border-stone-800 pb-2">
                                [ 2026년 대운 비책 ]
                            </h4>

                            <div className="space-y-3 blur-sm opacity-60 select-none grayscale(50%)">
                                <p className="font-bold text-sm text-center">
                                    {(() => {
                                        const el = result.fiveElements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
                                        let deficiency = "불(Fire)";
                                        if (el.wood === 0) deficiency = "나무(Tree)";
                                        else if (el.fire === 0) deficiency = "불(Fire)";
                                        else if (el.earth === 0) deficiency = "흙(Earth)";
                                        else if (el.metal === 0) deficiency = "쇠(Metal)";
                                        else if (el.water === 0) deficiency = "물(Water)";
                                        return `니 사주에 ${deficiency} 기운이 없어서 맨날...`;
                                    })()}
                                </p>
                                <div className="h-2 bg-stone-200 rounded w-full"></div>
                                <div className="h-2 bg-stone-200 rounded w-full"></div>
                                <div className="h-2 bg-stone-200 rounded w-3/4 mx-auto"></div>
                                <div className="h-20 bg-stone-100 border border-stone-200 rounded mt-4"></div>
                            </div>

                            {/* LOCK OVERLAY */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px] z-10">
                                <button className="bg-red-600 text-white px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all border-2 border-black animate-bounce">
                                    <Lock size={16} /> 복채 내고 뒷내용 보기
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. VALUE PROPOSITION (Benefits) */}
            <section className="bg-slate-900 text-white py-12 px-6 border-b-4 border-black">
                <div className="text-center mb-8">
                    <span className="text-yellow-400 font-bold tracking-widest text-xs">PREMIUM REPORT</span>
                    <h2 className="text-2xl font-aggro mt-2">총 20페이지 분량<br />인생 비책 구성</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: Calendar, title: "12개월 운세 달력", desc: "황금일과 지뢰일 완벽 정리" },
                        { icon: UserX, title: "인연 블랙리스트", desc: "돈과 운을 갉아먹는 사람 특징" },
                        { icon: Coins, title: "재물운 트리거", desc: "부자가 되는 투자 타이밍" },
                        { icon: ScrollText, title: "AI 커스텀 부적", desc: "부족한 오행을 채우는 디지털 부적" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center"
                        >
                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-yellow-400 border border-slate-600">
                                <item.icon size={20} />
                            </div>
                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. COMPARISON TABLE */}
            <section className="bg-white py-12 px-6 border-b-4 border-black">
                <h3 className="text-center font-black text-xl mb-8">왜 '평생 비책'인가?</h3>
                <div className="border-2 border-stone-900 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 bg-stone-100 font-bold border-b-2 border-stone-900 text-center text-xs py-3">
                        <div className="text-stone-500">구분</div>
                        <div className="text-stone-500">일반 사주</div>
                        <div className="text-slate-900 bg-yellow-100">평생 비책</div>
                    </div>
                    {[
                        { label: "전문 용어 해설", free: "X", paid: "O" },
                        { label: "1년 월별 운세", free: "X", paid: "O" },
                        { label: "전생 얼굴 공개", free: "X", paid: "O" },
                        { label: "개인 맞춤 부적", free: "X", paid: "O" },
                        { label: "분석 깊이", free: "기본", paid: "심층 (20p)" }
                    ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-3 text-center text-sm py-3 border-b border-stone-200 last:border-0">
                            <div className="font-bold text-stone-700 bg-stone-50">{row.label}</div>
                            <div className="text-stone-400">{row.free}</div>
                            <div className="font-bold text-red-600 bg-yellow-50/50">{row.paid}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. GRANDMA'S LAST HOOK (FOMO - Webtoon Style) */}
            <section className="bg-stone-200 py-12 px-4 border-b-4 border-black">
                <div className="max-w-md mx-auto">
                    {/* CUT 2: GRANDMA WARNING (Webtoon Panel) */}
                    <div className="bg-white border-4 border-black relative overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.2)] h-[560px]">
                        {/* Panel Header */}
                        <div className="absolute top-0 left-0 bg-red-600 text-white px-3 py-1 font-black text-xs z-30 border-b-2 border-r-2 border-black">
                            EP.02 마지막 경고
                        </div>

                        {/* Mood Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80 z-0"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

                        {/* Grandma Image - Shadowy & Serious */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 z-10 filter grayscale contrast-125 brightness-75">
                            <Image src="/grandma_smoking_v2.png" alt="Grandma Warning" fill className="object-cover object-top" />
                        </div>
                        {/* Red Eyes Effect */}
                        <div className="absolute bottom-[160px] left-[calc(50%-15px)] w-2 h-2 bg-red-600 rounded-full blur-[2px] animate-pulse z-20"></div>
                        <div className="absolute bottom-[160px] left-[calc(50%+15px)] w-2 h-2 bg-red-600 rounded-full blur-[2px] animate-pulse z-20"></div>


                        {/* Speech Bubble (Jagged/Shout style) */}
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90%] z-30">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-black border-4 border-white p-6 shadow-xl relative"
                                style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 55% 85%, 50% 100%, 45% 85%, 0% 85%)" }}
                            >
                                <h2 className="text-2xl font-aggro text-red-500 mb-4 animate-pulse text-center">
                                    "이거 안 보면 너만 손해야!"
                                </h2>
                                <p className="text-sm text-white leading-relaxed font-bold text-center break-keep">
                                    내가 네 팔자 훑어보니까 올해가 진짜 중요한데...<br />
                                    여기서 멈추면 내년엔 손가락만 빨고 있을 게 뻔해.<br /><br />
                                    <span className="text-yellow-400 bg-red-900 px-1">너는 운이 들어올 때 오히려 조심해야 할 '이것'이 있어.</span>
                                </p>
                            </motion.div>
                        </div>

                        {/* Narrative Box at Bottom */}
                        <div className="absolute bottom-4 left-4 right-4 z-30">
                            <div className="bg-white border-2 border-black p-3 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <p className="font-black text-xs text-slate-900">
                                    ※ 할머니가 정리한 비책은 유료본에만 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. DISCOUNT SHARE */}
            <section className="bg-yellow-50 py-12 px-6 pb-4">
                <div className="bg-white border-4 border-black p-6 rounded-xl shadow-[8px_8px_0px_rgba(0,0,0,0.1)] text-center">
                    <h3 className="text-xl font-black mb-2">마지막 할인 찬스!</h3>
                    <p className="text-stone-500 mb-6 text-sm">친구에게 공유하면 <span className="text-red-500 font-bold">즉시 10% 할인</span></p>
                    <button onClick={handleShare} className="w-full bg-[#FAE100] text-[#371D1E] py-4 rounded-lg font-black text-lg flex items-center justify-center gap-2 border-2 border-[#371D1E] active:scale-95 transition-transform">
                        <Share2 size={20} /> 카카오톡 공유하기
                    </button>
                    {discountApplied && <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-bold"><Check size={16} /> 할인 적용 완료!</div>}
                </div>
            </section>

            {/* 9. FIXED FOOTER with TICKER */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 bg-white border-t-4 border-black px-4 pt-3 pb-8 safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
                {/* Countdown Timer */}
                <div className="flex justify-between items-center mb-3 text-xs font-bold text-red-600 px-1">
                    <div className="flex items-center gap-1 animate-pulse">
                        <Clock size={12} />
                        할인 마감까지 {formatTime(timeLeft)}
                    </div>
                    {/* Social Proof Ticker */}
                    <AnimatePresence mode='wait'>
                        {socialProofVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-stone-600 flex items-center gap-1"
                            >
                                <Sparkles size={10} className="text-yellow-500" />
                                <span>방금 {purchaseCount.toLocaleString()}번째 비책 전송 완료</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex gap-2 h-14">
                    <div className="flex-[1] flex flex-col justify-center items-center bg-stone-100 rounded-lg border-2 border-stone-200">
                        <span className="text-[10px] text-stone-400 line-through">50,000원</span>
                        <span className="font-black text-slate-900">{price.toLocaleString()}원</span>
                    </div>
                    <button className="flex-[3] bg-red-600 text-white border-b-4 border-r-4 border-red-800 active:border-0 active:translate-y-1 rounded-xl font-black text-xl shadow-xl flex items-center justify-center gap-2 transition-all">
                        평생 비책 확인하기 <ChevronDown className="-rotate-90" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
