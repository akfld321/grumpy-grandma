"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, ChevronRight } from "lucide-react";
import { calculateSaju, SajuResult } from "@/lib/saju";
import { convertSajuToPaidResult } from "@/lib/saju/transform";
import { PaidSajuResult } from "@/types/PaidResultTypes";
import { useChatReducer, Stage, UserData } from "./useChatReducer";
import { sendGTMEvent } from "@/lib/gtm";

const TIME_OPTIONS = [
    { label: "시간모름", value: "UNKNOWN" },
    { label: "조자시 (00:00 ~ 01:30)", value: "0030" },
    { label: "축시 (01:30 ~ 03:30)", value: "0230" },
    { label: "인시 (03:30 ~ 05:30)", value: "0430" },
    { label: "묘시 (05:30 ~ 07:30)", value: "0630" },
    { label: "진시 (07:30 ~ 09:30)", value: "0830" },
    { label: "사시 (09:30 ~ 11:30)", value: "1030" },
    { label: "오시 (11:30 ~ 13:30)", value: "1230" },
    { label: "미시 (13:30 ~ 15:30)", value: "1430" },
    { label: "신시 (15:30 ~ 17:30)", value: "1630" },
    { label: "유시 (17:30 ~ 19:30)", value: "1830" },
    { label: "술시 (19:30 ~ 21:30)", value: "2030" },
    { label: "해시 (21:30 ~ 23:30)", value: "2230" },
    { label: "야자시 (23:30 ~ 24:00)", value: "2330" },
];

const MBTI_OPTIONS = [
    { label: "ISTJ", desc: "청렴결백" }, { label: "ISFJ", desc: "용감한 수호자" }, { label: "INFJ", desc: "선의의 옹호자" }, { label: "INTJ", desc: "용의주도" },
    { label: "ISTP", desc: "만능 재주꾼" }, { label: "ISFP", desc: "호기심 예술가" }, { label: "INFP", desc: "열정 중재자" }, { label: "INTP", desc: "논리 사색가" },
    { label: "ESTP", desc: "모험사업가" }, { label: "ESFP", desc: "자유영혼" }, { label: "ENFP", desc: "재기발랄" }, { label: "ENTP", desc: "뜨거운 논쟁" },
    { label: "ESTJ", desc: "엄격관리자" }, { label: "ESFJ", desc: "사교외교관" }, { label: "ENFJ", desc: "정의사회" }, { label: "ENTJ", desc: "담대한 통솔" }
];

const PRELOAD_IMAGES = [
    "/grandma_curious_v2.png",
    "/grandma_stern_v2.png",
    "/grandma_intense_v2.png",
    "/grandma_smoking_v2.png",
    "/grandma_scene_v3.png"
];

export default function GrandmaChat({ onBack }: { onBack: () => void }) {
    const router = useRouter();

    // Preload Images
    useEffect(() => {
        PRELOAD_IMAGES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
        // Analytics: Track Input Start
        sendGTMEvent('saju_input_start');
    }, []);

    const {
        state,
        setInput,
        submitName,
        selectGender,
        submitBirthDate,
        setIsSolar,
        selectBirthTime,
        submitBirthTime,
        selectMbti,
        submitQuestion,
        finishAnalysis,
        reset
    } = useChatReducer();

    const { stage, userData, input, error } = state;
    const [grandmaText, setGrandmaText] = useState("");
    const [loadingText, setLoadingText] = useState("");
    const [sajuResult, setSajuResult] = useState<PaidSajuResult | null>(null);

    // Update Grandma's Text based on Stage (Side Effect -> View Only)
    useEffect(() => {
        switch (stage) {
            case "name":
                setGrandmaText("여기까지 들어오다니 제법이구나.\n자, 이름이 뭐냐?");
                break;
            case "gender":
                setGrandmaText("계집이냐 사내냐?\n그것부터 확실히 해야 팔자를 제대로 보지.");
                break;
            case "birthDate":
                setGrandmaText("언제 세상 빛을 봤는지 말해봐라.\n숨기지 말고 정확하게!");
                break;
            case "birthTime":
                setGrandmaText("몇 시에 태어났냐?\n팔자 고치려면 시간도 귀하게 따져야 해.");
                break;
            case "mbti":
                setGrandmaText("요즘 것들은 네 글자로 성격을 따진다며?\n너는 뭐냐? 솔직하게 불어봐라.");
                break;
            case "question":
                setGrandmaText("마지막으로 물어볼 거 있냐? (선택사항)");
                break;
            case "analyzing":
                setGrandmaText("흐음...");
                startAnalysis();
                break;
            case "result":
                setGrandmaText("자, 여기 니 팔자다. 똑바로 봐라!");
                break;

        }
    }, [stage]);

    // Error Feedback
    useEffect(() => {
        if (error) {
            setGrandmaText(error); // Grandmaa shouts the error
        }
    }, [error]);

    const startAnalysis = () => {
        const steps = [
            "할머니가 곰방대를 물고 사주팔자를 훑어보는 중...",
            "태어난 날의 [일간(日干)] 분석 중...",
            "[용신(用神)] 파악 중...",
            "오행의 균형을 맞추는 중...",
            "결과가 나왔다!"
        ];

        let stepIdx = 0;
        setLoadingText(steps[0]);

        const interval = setInterval(() => {
            stepIdx++;
            if (stepIdx >= steps.length) {
                clearInterval(interval);
                performSajuCalculation();
            } else {
                setLoadingText(steps[stepIdx]);
            }
        }, 1500);
    };

    const performSajuCalculation = () => {
        // 1. Calculate Saju Locally
        const prefix = parseInt(userData.birthDate.substring(0, 2)) < 30 ? "20" : "19";
        const fullYear = parseInt(prefix + userData.birthDate.substring(0, 2));
        const month = parseInt(userData.birthDate.substring(2, 4));
        const day = parseInt(userData.birthDate.substring(4, 6));

        // Handle Time
        let hour = 12;
        if (userData.birthTime && userData.birthTime !== "UNKNOWN") {
            hour = parseInt(userData.birthTime.substring(0, 2));
        }

        const rawResult = calculateSaju(fullYear, month, day, hour, userData.gender || 'male'); // Fallback to 'male' if null (shouldn't happen due to form validation)
        if (userData.birthTime === "UNKNOWN") {
            rawResult.hour = "모름";
        }

        const enrichedRaw = { ...rawResult, mbti: userData.mbti || undefined, userName: userData.name };

        // 2. Convert to Paid Format (for Teaser View) - SKIPPED (Direct Redirect)
        console.log("📝 Redirecting to Result Page...");

        const params = new URLSearchParams({
            name: userData.name,
            gender: userData.gender as string,
            birthDate: userData.birthDate,
            birthTime: userData.birthTime || "UNKNOWN",
            mbti: userData.mbti || "",
            question: userData.question || ""
        });

        // 3. Direct Redirect to Result Page (Free Hook Flow)
        router.push(`/result?${params.toString()}`);
        // setSajuResult(finalResult); // Removed
        // finishAnalysis(); // Removed
    };

    const getCharacterImage = (currentStage: Stage) => {
        switch (currentStage) {
            case "name": return "/grandma_curious_v2.png";
            case "gender": return "/grandma_stern_v2.png"; // Stern for gender check
            case "birthDate":
            case "birthTime": return "/grandma_intense_v2.png"; // Intense for data accuracy
            case "mbti": return "/grandma_curious_v2.png";
            case "question": return "/grandma_curious_v2.png";
            case "analyzing": return "/grandma_smoking_v2.png";
            case "result": return "/grandma_scene_v3.png";
            default: return "/grandma_scene_v3.png";
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (stage === "name") submitName();
        if (stage === "birthDate") submitBirthDate();
        if (stage === "birthTime") submitBirthTime();
        if (stage === "question") submitQuestion();
    };



    // --- DARK MODE UI ---
    return (
        <section className="h-screen w-full flex flex-col font-sans overflow-hidden bg-stone-950 text-stone-200">
            {/* Top Panel: Scene (Dark Atmosphere) */}
            <div className="flex-[6.5] relative overflow-hidden bg-stone-900 border-b border-stone-800">
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={stage}
                            src={getCharacterImage(stage)}
                            alt="Grumpy Grandma Scene"
                            className="w-full h-full object-cover object-center scale-110 translate-y-6 absolute inset-0 opacity-60 grayscale-[0.3] contrast-125"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }} // Lower opacity for dark mood
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </AnimatePresence>
                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/90 mix-blend-multiply pointer-events-none"></div>
                </div>

                {/* Header Controls */}
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-50">
                    <button onClick={onBack} className="p-2 bg-stone-900/80 border border-stone-700 rounded-full text-stone-300 hover:bg-stone-800 active:scale-95 transition-transform"><ArrowLeft /></button>
                    <button onClick={reset} className="p-2 bg-stone-900/80 border border-stone-700 rounded-full text-stone-300 hover:bg-stone-800 active:scale-95 transition-transform"><RefreshCw /></button>
                </div>

                <div className="w-full h-full relative flex flex-col items-center justify-center pt-8 z-10 pointer-events-none">
                    {/* Speech Bubble (Dark Version) */}
                    <motion.div
                        key={grandmaText}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute top-[8%] md:top-[15%] right-2 md:right-[5%] z-40 max-w-[60%] md:max-w-[40%]"
                    >
                        <div className="bg-stone-900 border-2 border-stone-600 p-5 md:p-6 rounded-[2rem] rounded-br-none shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative">
                            <p className="text-lg md:text-2xl font-bold leading-relaxed text-stone-200 text-center whitespace-pre-wrap word-break-keep-all font-serif drop-shadow-md">
                                {loadingText || grandmaText}
                            </p>
                            {/* Tail */}
                            <div className="absolute -bottom-3 -right-2 w-6 h-6 bg-stone-900 border-b-2 border-r-2 border-stone-600 transform skew-y-12 rotate-[10deg]"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Panel: Input Area (Interrogation Desk) */}
            <div className="flex-[3.5] bg-stone-950 relative z-30 rounded-t-[2.5rem] -mt-8 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] flex flex-col p-6 border-t border-stone-800">
                <div className="max-w-md mx-auto w-full h-full flex flex-col">
                    {/* Progress Bar (Dark) */}
                    <div className="w-full h-1 bg-stone-800 rounded-full mb-8 overflow-hidden">
                        <motion.div
                            className="h-full bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(Object.keys(userData).filter(Boolean).length / 6) * 100}%` }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                        {stage === "analyzing" ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <div className="w-12 h-12 border-4 border-stone-800 border-t-red-600 rounded-full animate-spin"></div>
                                <p className="text-stone-500 animate-pulse font-medium text-lg font-serif">천기를 읽는 중...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-stone-500 mb-3 pl-1">
                                        {stage === "name" && "이름 (Name)"}
                                        {stage === "gender" && "성별 (Gender)"}
                                        {stage === "birthDate" && "생년월일 (Birth Date)"}
                                        {stage === "birthTime" && "태어난 시간 (Birth Time)"}
                                        {stage === "mbti" && "MBTI"}
                                        {stage === "question" && "질문 (Question)"}
                                    </label>

                                    {stage === "question" && (
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="예: 언제쯤 돈을 많이 벌 수 있을까요?"
                                            className="w-full p-4 text-lg font-medium bg-stone-900 rounded-xl border border-stone-700 focus:border-red-900 focus:bg-stone-900 transition-all outline-none resize-none h-32 placeholder:text-stone-600 text-stone-200"
                                            autoFocus
                                        />
                                    )}

                                    {stage === "name" && (
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="홍길동"
                                            className="w-full p-4 text-2xl font-bold bg-stone-900 rounded-xl border border-stone-700 focus:border-stone-500 transition-all outline-none text-center placeholder:text-stone-700 text-white placeholder:font-normal"
                                            autoFocus
                                        />
                                    )}

                                    {stage === "gender" && (
                                        <div className="grid grid-cols-2 gap-4 h-28">
                                            <button
                                                type="button"
                                                onClick={() => selectGender("male")}
                                                className={`h-full rounded-2xl border-2 text-xl transition-all ${userData.gender === 'male' ? 'bg-stone-800 border-blue-900 text-blue-400 font-bold shadow-[0_0_15px_rgba(30,58,138,0.3)]' : 'bg-stone-900 border-stone-800 text-stone-600 hover:border-stone-700'}`}
                                            >
                                                남성
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => selectGender("female")}
                                                className={`h-full rounded-2xl border-2 text-xl transition-all ${userData.gender === 'female' ? 'bg-stone-800 border-red-900 text-red-400 font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-stone-900 border-stone-800 text-stone-600 hover:border-stone-700'}`}
                                            >
                                                여성
                                            </button>
                                        </div>
                                    )}

                                    {stage === "birthDate" && (
                                        <div className="flex flex-col gap-4">
                                            <input
                                                type="tel"
                                                maxLength={6}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="960505"
                                                className="w-full p-4 text-3xl font-black bg-stone-900 rounded-xl border border-stone-700 focus:border-stone-500 transition-all outline-none tracking-[0.5em] text-center placeholder:text-stone-700 text-white placeholder:tracking-normal placeholder:font-normal"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <div
                                                    onClick={() => setIsSolar(true)}
                                                    className={`flex-1 p-3 rounded-lg border cursor-pointer text-center text-sm font-bold transition-all ${userData.isSolar ? 'bg-stone-800 text-white border-stone-600' : 'bg-stone-950 text-stone-600 border-stone-800'}`}
                                                >
                                                    양력
                                                </div>
                                                <div
                                                    onClick={() => setIsSolar(false)}
                                                    className={`flex-1 p-3 rounded-lg border cursor-pointer text-center text-sm font-bold transition-all ${!userData.isSolar ? 'bg-stone-800 text-white border-stone-600' : 'bg-stone-950 text-stone-600 border-stone-800'}`}
                                                >
                                                    음력
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {stage === "birthTime" && (
                                        <select
                                            value={userData.birthTime || ""}
                                            onChange={(e) => selectBirthTime(e.target.value)}
                                            className={`w-full p-4 text-xl font-bold bg-stone-900 rounded-xl border border-stone-700 focus:border-stone-500 transition-all outline-none text-center appearance-none ${userData.birthTime ? 'text-white' : 'text-stone-600'}`}
                                        >
                                            <option value="" disabled>시간을 선택해주세요</option>
                                            {TIME_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-stone-900 text-white">{opt.label}</option>
                                            ))}
                                        </select>
                                    )}

                                    {stage === "mbti" && (
                                        <div className="grid grid-cols-4 gap-2 h-56 overflow-y-auto pr-1 custom-scrollbar">
                                            {MBTI_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.label}
                                                    type="button"
                                                    onClick={() => selectMbti(opt.label)}
                                                    className={`p-2 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 min-h-[60px] ${userData.mbti === opt.label ? 'bg-stone-800 text-white border-stone-500 shadow-md' : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-stone-700'}`}
                                                >
                                                    <span className="font-bold text-xs">{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Common Next Button */}
                                <button
                                    type="submit"
                                    disabled={
                                        (stage === "name" && !input.trim()) ||
                                        (stage === "gender" && !userData.gender) ||
                                        (stage === "birthDate" && input.length !== 6) ||
                                        (stage === "birthTime" && !userData.birthTime) ||
                                        (stage === "mbti" && !userData.mbti)
                                    }
                                    className="w-full py-4 bg-[#7f1d1d] hover:bg-[#991b1b] text-white text-lg font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(127,29,29,0.3)] disabled:shadow-none"
                                >
                                    {stage === "mbti" ? "다음으로" : stage === "question" ? "결과 확인하기" : "다음"} <ChevronRight size={20} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
