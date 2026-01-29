"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { sendGTMEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function HeroSection({ onStart }: { onStart: () => void }) {

    const handleStart = () => {
        sendGTMEvent(ANALYTICS_EVENTS.BEGIN_CHAT);
        onStart();
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-end text-center bg-black">
            {/* Unified Full-Screen Background Layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                {/* Main Scene Image - Restored Visibility */}
                <motion.div
                    className="relative w-full h-full"
                    animate={{
                        scale: [1.1, 1.15, 1.1],
                        x: [0, -10, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Image
                        src="/grandma_scene_v3.png"
                        alt="Grandma Scene"
                        fill
                        className="object-cover object-[35%_20%]" // Fixed focal point for all screens
                        priority
                    />
                </motion.div>

                {/* Cinematic Vignette Overlay to make text pop */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/10" />

                {/* Smoke Emitter */}
                <div className="absolute right-[20%] top-[50%] md:right-[30%] md:top-[50%] w-10 h-10 z-10 opacity-70">
                    <SmokeParticles />
                </div>
            </div>

            {/* Title - Moved to Top RIGHT Corner */}
            <motion.div
                initial={{ opacity: 0, x: 30 }} // Animated from Right
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-8 right-6 md:top-24 md:right-20 z-10" // Top Right Corner
            >
                <h1 className="text-5xl md:text-8xl font-bold text-white leading-tight font-serif drop-shadow-2xl opacity-95"
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        letterSpacing: '0.1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                    조선의<br />욕쟁이<br />할머니
                </h1>
            </motion.div>

            {/* Bottom Content - Minimalist */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="z-20 flex flex-col items-center gap-8 mb-16 md:mb-24 w-full px-6"
            >
                {/* Catchphrase - Elegant Text Shadow */}
                <p className="text-xl md:text-3xl text-amber-50/90 font-medium font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide bg-black/30 p-2 rounded-lg backdrop-blur-[2px]">
                    "인생이 왜 이 모양인지 궁금하냐?<br />니 <span className="text-red-500 font-bold">사주팔자(四柱八字)</span>, 내가 아주 뼈 때리게 풀어주마!"
                </p>

                {/* Seal / Start Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleStart}
                    className="relative group cursor-pointer"
                >
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-red-900 bg-[#9c2727] shadow-[0_0_20px_rgba(150,30,30,0.6)] flex flex-col items-center justify-center rotate-45 group-hover:bg-[#7f1d1d] transition-colors">
                        <span className="text-white font-serif font-bold text-lg md:text-xl -rotate-45 block leading-tight">
                            내 팔자<br />확인하기
                        </span>
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 border-4 border-red-800/50 rounded-2xl rotate-45 animate-ping -z-10"></div>
                </motion.button>

                <p className="text-sm text-white/50 font-serif -mt-4 animate-bounce">
                    터치하여 시작
                </p>
            </motion.div>
        </section>
    );
}

function SmokeParticles() {
    const particles = Array.from({ length: 6 });
    return (
        <>
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 w-32 h-32 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.5, 2, 3],
                        x: [0, 30 + Math.random() * 40],
                        y: [0, -80 - Math.random() * 50],
                        rotate: [0, Math.random() * 120 - 60]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 1.5,
                        ease: "easeOut"
                    }}
                >
                    <Image
                        src="/smoke_puff.png"
                        alt=""
                        width={128}
                        height={128}
                        className="object-contain mix-blend-screen opacity-50 blur-[1px]"
                    />
                </motion.div>
            ))}
        </>
    );
}
