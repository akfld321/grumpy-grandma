'use client';

import React, { useState } from 'react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter8AIResponse } from '@/types/GeminiSchema';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import Image from 'next/image';

interface Chapter8Props {
    content: ChapterContent;
    forceExpanded?: boolean;
    resultId?: string; // New: For server persistence
    onUpdate?: (data: any) => void; // New: For state bubbling
}

const SP_IMAGES: Record<string, string> = {
    // Men (for Female Users)
    'dino_m': '/images/spouse/dino_m.png?v=refresh2',
    'dog_m': '/images/spouse/dog_m.png?v=refresh2',
    'fox_m': '/images/spouse/fox_m.png?v=refresh2',
    'bear_m': '/images/spouse/bear_m.jpg?v=refresh2',
    'rabbit_m': '/images/spouse/rabbit_m.png?v=refresh2',
    'tiger_m': '/images/spouse/tiger_m.png?v=refresh2',

    // Women (for Male Users)
    'cat_f': '/images/spouse/cat_f.png?v=refresh2',
    'deer_f': '/images/spouse/deer_f.png?v=refresh2',
    'dog_f': '/images/spouse/dog_f.jpg?v=refresh2',
    'fox_f': '/images/spouse/fox_f.png?v=refresh2',
    'rabbit_f': '/images/spouse/rabbit_f.png?v=refresh2',
};

const SP_TITLES: Record<string, string> = {
    // Men
    'dino_m': '듬직하고 강인한 공룡상',
    'dog_m': '순둥순둥 대형견상',
    'fox_m': '치명적인 매력의 사막여우상',
    'bear_m': '기대고 싶은 곰돌이상',
    'rabbit_m': '섬세하고 다정한 토끼상',
    'tiger_m': '리더십 넘치는 호랑이상',

    // Women
    'cat_f': '새침하고 도도한 고양이상',
    'deer_f': '보호본능 자극하는 사슴상',
    'dog_f': '애교 많은 강아지상',
    'fox_f': '앙큼한 매력의 여우상',
    'rabbit_f': '사랑스러운 토끼상',
};

const Chapter8: React.FC<Chapter8Props> = ({ content, forceExpanded = false, resultId, onUpdate }) => {
    const aiData = content.aiResponse as Chapter8AIResponse | undefined;
    const [isFlipped, setIsFlipped] = useState(forceExpanded);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [imgError, setImgError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Dynamic Image Generation Effect with Persistence
    React.useEffect(() => {
        const generateImage = async () => {
            const spouseData = aiData?.spouse as any;
            const prompt = spouseData?.imagePrompt;
            // 0. CHECK SERVER PERSISTENCE FIRST
            // If the JSON already has a saved image URL (from DB), use it!
            if (spouseData?.imageUrl) {
                if (spouseData.imageUrl !== generatedImageUrl) {
                    console.log("✅ Using Server-Persisted Image");
                    setGeneratedImageUrl(spouseData.imageUrl);
                }
                return;
            }

            if (prompt && !generatedImageUrl && !isGenerating && !imgError) {
                // 1. Check LocalStorage Cache (Fallback)
                // V3: Use hash of FULL prompt to avoid prefix collision
                // Simple hash function for string
                const hash = prompt.split('').reduce((a: number, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
                const cacheKey = `saju_img_v3_${hash}`;
                const cachedImage = localStorage.getItem(cacheKey);

                if (cachedImage) {
                    console.log("Using cached spouse image");
                    setGeneratedImageUrl(cachedImage);
                    // Sync up to parent just in case
                    if (onUpdate) onUpdate({ spouse: { ...spouseData, imageUrl: cachedImage } });
                    return;
                }

                // 2. Fetch if not cached
                setIsGenerating(true);
                setErrorMsg(null);
                try {
                    const res = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });

                    if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(errData.details || res.statusText);
                    }

                    const data = await res.json();
                    if (data.imageUrl) {
                        setGeneratedImageUrl(data.imageUrl);

                        // A. Save to Local Cache
                        try {
                            const hash = prompt.split('').reduce((a: number, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
                            const cacheKey = `saju_img_v3_${hash}`;
                            localStorage.setItem(cacheKey, data.imageUrl);
                        } catch (storageErr) {
                            console.warn("Failed to cache image locally", storageErr);
                        }

                        // B. UPDATE PARENT STATE (Crucial for saving later)
                        if (onUpdate) {
                            onUpdate({ spouse: { ...spouseData, imageUrl: data.imageUrl } });
                        }

                        // C. PERSIST TO SERVER (If viewing a shared link)
                        if (resultId) {
                            console.log("💾 Persisting image to Server DB...");
                            fetch('/api/save-image', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ resultId, imageUrl: data.imageUrl })
                            }).then(r => r.json()).then(d => {
                                if (d.success) console.log("✅ Image Persisted to DB");
                                else console.warn("Failed to persist image to DB", d);
                            });
                        }
                    }
                } catch (e: any) {
                    console.error("Image Gen Error:", e);
                    setImgError(true);
                    setErrorMsg(e.message || "알 수 없는 오류");
                } finally {
                    setIsGenerating(false);
                }
            }
        };

        if (forceExpanded || isFlipped) {
            generateImage();
        }
    }, [aiData, isFlipped, forceExpanded, generatedImageUrl, isGenerating, imgError, resultId, onUpdate]);

    const spouseType = aiData?.spouse?.type || 'dino_m';
    const fallbackImage = SP_IMAGES[spouseType] || SP_IMAGES['dino_m'];
    const title = SP_TITLES[spouseType] || aiData?.spouse?.appearance || '운명의 짝꿍';

    // Helper to remove internal IDs like (fox_f) from text
    const cleanDescription = (text?: string) => {
        if (!text) return "";
        // Remove patterns like (fox_f), [fox_f], or just "fox_f" in the text
        // Also remove "cat_f", "dog_m" etc.
        let cleaned = text.replace(/[\(\[\{]?\s*(cat|dog|fox|deer|rabbit|tiger|dino|bear|wolf|monkey|horse|sheep|dragon|snake)_[fm]\s*[\)\]\}]?/gi, "");
        // Remove leftover double spaces
        return cleaned.replace(/\s+/g, " ").trim();
    };

    const cleanDescText = cleanDescription(aiData?.spouse?.desc);

    // Final Image Source: Generated -> Fallback
    const displayImage = generatedImageUrl || fallbackImage;

    return (
        <div className="w-full flex-1 bg-stone-900 font-serif text-stone-100 relative flex flex-col items-center">

            {/* Intro */}
            <div className="pt-12 px-6 text-center z-10 w-full mb-8">
                <p className="text-xs font-bold tracking-[0.3em] text-pink-500 mb-2">CHAPTER 08</p>
                <h2 className="text-3xl font-black mb-2 leading-tight">
                    니 <span className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]">운명의 짝꿍</span>은<br />
                    누굴까?
                </h2>
                <p className="text-stone-400 text-sm">
                    관상학적으로 풀어본<br />미래의 배우자 얼굴을 공개한다.
                </p>
            </div>

            {/* The Card */}
            {forceExpanded ? (
                // PDF/Print Mode: Just show the result card flat
                <div className="w-full max-w-xs h-[450px] relative mb-10 bg-stone-900 rounded-2xl overflow-hidden border-2 border-pink-500/50">
                    <div className="w-full h-full relative">
                        {/* Final Image */}
                        <Image
                            src={displayImage}
                            alt="Future Spouse"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                        {/* Text Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                    MATCH {aiData?.matchScore || 85}%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 leading-none drop-shadow-md">
                                {title}
                            </h3>
                            <p className="text-stone-300 text-sm line-clamp-2 leading-normal">
                                {formatWithSentenceBreaks(cleanDescText)}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Interactive Mode: Flip Card
                <div className="w-full max-w-xs h-[450px] relative perspective-1000 mb-10 cursor-pointer group" onClick={() => setIsFlipped(true)}>
                    <motion.div
                        className="w-full h-full relative transition-transform duration-700"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                        {/* Front (Mystery) */}
                        <div
                            className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)] bg-stone-800 flex flex-col items-center justify-center"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="text-6xl mb-4 animate-bounce">❓</div>
                            <p className="text-pink-300 font-bold tracking-widest text-lg">터치해서 확인</p>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        </div>

                        {/* Back (Reveal) */}
                        <div
                            className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.4)] bg-stone-900"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            {/* Short Circuit: Check for Prompt */}
                            {!(aiData?.spouse as any)?.imagePrompt && !isGenerating && (
                                <div className="absolute top-2 left-2 z-50 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                                    ⚠️ 프롬프트 없음
                                </div>
                            )}

                            {/* Image Container */}
                            <div className="w-full h-full relative flex items-center justify-center bg-black">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-pink-400 text-sm font-bold animate-pulse">할머니가 그림 그리는 중...</p>
                                    </div>
                                ) : imgError ? (
                                    <div className="flex flex-col items-center gap-2 p-4 text-center w-full relative">
                                        <span className="text-3xl">❌</span>
                                        <p className="text-red-500 font-bold text-sm">이미지 생성 실패</p>
                                        <p className="text-yellow-300 text-xs break-all leading-tight px-2 font-mono bg-black/50 p-1 rounded">
                                            {errorMsg || "서버 응답 없음 (Code check)"}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImgError(false);
                                                setErrorMsg(null);
                                            }}
                                            className="mt-2 px-3 py-1 bg-stone-800 rounded text-xs text-stone-300 border border-stone-700 hover:bg-stone-700"
                                        >
                                            다시 시도
                                        </button>
                                        <span className="absolute bottom-[-20px] text-[10px] text-stone-600">v21</span>
                                    </div>
                                ) : (
                                    <Image
                                        src={displayImage}
                                        alt="Future Spouse"
                                        fill
                                        className="object-cover transition-opacity duration-1000"
                                        unoptimized
                                        onError={(e) => {
                                            console.error("Image Load Error, falling back");
                                            setImgError(true);
                                            setErrorMsg("이미지 로드 실패");
                                        }}
                                    />
                                )}

                                {/* Gradient Overlay for Text */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                                {/* Text Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            MATCH {aiData?.matchScore || 85}%
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-none drop-shadow-md">
                                        {title}
                                    </h3>
                                    <p className="text-stone-300 text-sm line-clamp-2 leading-normal">
                                        {formatWithSentenceBreaks(aiData?.spouse?.desc)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Revealed Details */}
            {isFlipped && (
                <motion.div
                    className="w-full px-6 pb-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-stone-800/50 rounded-xl p-5 border border-white/10 backdrop-blur-sm">

                        {/* Timing */}
                        <div className="flex gap-4 mb-4 pb-4 border-b border-white/5">
                            <div className="text-pink-400 text-2xl">⏳</div>
                            <div>
                                <h4 className="text-stone-400 text-xs font-bold uppercase">When & Where</h4>
                                <p className="text-stone-200 text-sm font-medium mt-1">{aiData?.timing?.when || '분석 중...'}</p>
                                <p className="text-stone-400 text-xs">{aiData?.timing?.where || '위치 정보 분석 중...'}</p>
                            </div>
                        </div>

                        {/* Personality */}
                        <div className="flex gap-4">
                            <div className="text-pink-400 text-2xl">💖</div>
                            <div>
                                <h4 className="text-stone-400 text-xs font-bold uppercase">Personality</h4>
                                <p className="text-stone-300 text-sm mt-1 leading-normal whitespace-pre-wrap">
                                    {formatWithSentenceBreaks(cleanDescText || '성격 분석 중...')}
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default Chapter8;
