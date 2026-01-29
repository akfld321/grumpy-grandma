import React, { useEffect, useState } from 'react';

const LoadingView: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("할머니가 돋보기를 끼고...");

    useEffect(() => {
        // Simulate progress over ~30 seconds (100% / 30s approx 3.3% per sec)
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + (Math.random() * 2 + 1); // 1~3% increment
                if (next >= 99) {
                    clearInterval(interval);
                    return 99;
                }
                return next;
            });
        }, 800); // Update every 0.8s

        // Message updates based on progress
        const msgInterval = setInterval(() => {
            setProgress(currentProgress => {
                if (currentProgress < 20) setMessage("할머니가 돋보기를 끼고...");
                else if (currentProgress < 40) setMessage("네 사주팔자를 꼼꼼히 뜯어보는 중이다...");
                else if (currentProgress < 60) setMessage("어허... 이것 참... 흐음...");
                else if (currentProgress < 80) setMessage("할머니가 무릎을 탁! 치셨다!");
                else setMessage("거의 다 됐다. 기다려라!");
                return currentProgress;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-fadeIn pt-20">
            <div className="w-32 h-32 relative mb-8">
                {/* Static Outer Ring */}
                <div className="absolute inset-0 border-4 border-stone-700/50 rounded-full"></div>

                {/* Dynamic Spinner Ring */}
                <div className="absolute inset-0 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

                {/* Image */}
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-stone-500 grayscale opacity-80">
                    <img src="/grandma_webtoon_style.png" alt="Loading" className="w-full h-full object-cover" />
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-2 animate-pulse text-center">"어디 보자..."</h2>

            <div className="w-64 h-2 bg-stone-800 rounded-full overflow-hidden mb-4 relative">
                <div
                    className="h-full bg-red-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="text-stone-400 text-sm font-medium text-center leading-relaxed h-12 flex items-center justify-center transition-opacity duration-300">
                {message}
                <br />
                <span className="text-xs text-stone-600 mt-1 block">({Math.floor(progress)}%)</span>
                {progress >= 99 && (
                    <span className="text-xs text-amber-600 mt-2 block animate-pulse font-bold">
                        분석할 내용이 많아 시간이 조금 걸립니다...<br />
                        새로고침 하지 말고 잠시만 기다려주세요!
                    </span>
                )}
            </p>
        </div>
    );
};

export default LoadingView;
