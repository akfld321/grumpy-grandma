import React, { useEffect, useRef, useState } from 'react';
import { Lock, Sparkles, Heart, DollarSign, ArrowRight, ShieldCheck, Star, Users, TrendingUp, Activity, Calendar, Award, MessageCircle } from 'lucide-react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { sendGTMEvent } from '@/lib/gtm';

interface SalesPageProps {
    onPaymentStart: () => Promise<string | null>;
    userName: string;
    graphData?: { age: string; score: number }[]; // Optional Real Data
}

export default function SalesPage({ onPaymentStart, userName, graphData }: SalesPageProps) {
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<any>(null);
    const [price] = useState(29800);
    const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        // Analytics: View Sales Page
        sendGTMEvent('sales_page_view');

        return () => clearInterval(timer);
    }, []);

    // Load Payment Widget
    useEffect(() => {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        const customerKey = "USER_" + Math.random().toString(36).substring(2, 12).toUpperCase(); // Anonymous user key

        if (!clientKey) {
            console.error("Toss Client Key is missing");
            return;
        }

        (async () => {
            try {
                const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

                // Render Payment Methods
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    '#payment-widget',
                    { value: price },
                    { variantKey: 'DEFAULT' } // Use default UI setting from admin console
                );

                // Render Agreement
                paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

                paymentWidgetRef.current = paymentWidget;
                paymentMethodsWidgetRef.current = paymentMethodsWidget;
                setIsWidgetLoaded(true);
            } catch (error) {
                console.error("Failed to load payment widget", error);
            }
        })();
    }, [price]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const reviews = [
        { name: "김*지 (28세)", text: "소름... 저 진짜 작년에 남친이랑 헤어진 시기랑 그래프 하락세랑 똑같아서 놀랐어요.", rating: 5 },
        { name: "이*훈 (34세)", text: "그냥 재미로 봤는데 뼈 맞았습니다. 사업 준비 중이었는데 조언 보고 방향 바꿨습니다.", rating: 5 },
        { name: "박*영 (41세)", text: "남편 몰래 봤는데 남편 성격이랑 너무 똑같이 나와서 소름돋네요 ㅋㅋㅋ", rating: 5 },
        { name: "최*식 (52세)", text: "내년 삼재라 걱정했는데 할머니가 시원하게 욕해주니 속이 다 풀립니다.", rating: 5 },
        { name: "정*우 (25세)", text: "미래 배우자 얼굴 블러 처리된 거... 신기하게 제 이상형이랑 분위기가 비슷해요.", rating: 5 },
    ];

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast factor
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handlePayment = async () => {
        try {
            const paymentWidget = paymentWidgetRef.current;
            if (!paymentWidget) {
                alert('결제 모듈이 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.');
                return;
            }

            // Analytics: Begin Checkout
            sendGTMEvent('initiate_checkout', {
                currency: 'KRW',
                value: price,
                items: [{
                    item_id: 'full_report_v1',
                    item_name: '욕쟁이 할머니 사주 프리미엄 리포트',
                    price: price
                }]
            });

            // 1. Get Result ID (Save Data if needed)
            const orderId = await onPaymentStart();
            if (!orderId) {
                alert('결제 정보를 생성하는 중 오류가 발생했습니다.');
                return;
            }

            // 2. Request Payment via Widget
            await paymentWidget.requestPayment({
                orderId: orderId,
                orderName: '욕쟁이 할머니 사주 프리미엄 리포트',
                customerName: userName,
                customerEmail: 'customer@example.com', // Optional, can be collected if needed
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });

        } catch (error) {
            console.error('Payment Error', error);
            // alert('결제 요청에 실패했습니다.'); // Widget handles internal errors mostly
        }
    };

    // Scroll to widget function
    const scrollToPayment = () => {
        const element = document.getElementById('payment-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const chapters = [
        {
            id: 4,
            title: "Chapter 4: 인생 에너지 그래프",
            desc: "나의 전성기는 언제일까? 80세까지의 운세 흐름",
            icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
            color: "blue",
            blurType: "graph",
            image: "/preview_ch4.png"
        },
        {
            id: 7,
            title: "Chapter 5: 돈 그릇 & 대박 달력", // Display as Ch 5
            desc: "2026년, 언제 돈이 들어올까? 월별 재물운 공개",
            icon: <DollarSign className="w-5 h-5 text-amber-400" />,
            color: "amber",
            blurType: "image",
            image: "/preview_ch7.png"
        },
        {
            id: 9,
            title: "Chapter 6: 천직과 적성",
            desc: "나는 월급쟁이 팔자인가, 사장님 팔자인가?",
            icon: <Award className="w-5 h-5 text-indigo-400" />,
            color: "indigo",
            blurType: "image",
            image: "/preview_ch9.png"
        },
        {
            id: 11,
            title: "Chapter 7: 10년 대운 분석",
            desc: "인생의 큰 계절이 바뀌는 시기, 대운을 잡아라",
            icon: <Calendar className="w-5 h-5 text-sky-400" />,
            color: "sky",
            blurType: "image",
            image: "/preview_ch11.png"
        },
        {
            id: 12,
            title: "Chapter 8: 향후 5년 & 삼재",
            desc: "앞으로 5년, 이것만은 절대 조심해라",
            icon: <ShieldCheck className="w-5 h-5 text-stone-400" />,
            color: "stone",
            blurType: "image",
            image: "/preview_ch12.png"
        },
        {
            id: 5,
            title: "Chapter 9: 내 안의 신과 살",
            desc: "나를 지켜주는 귀신과 나를 해치는 악귀 (신살)",
            icon: <Activity className="w-5 h-5 text-purple-400" />,
            color: "purple",
            blurType: "image",
            image: "/preview_ch5.png"
        },
        {
            id: 10,
            title: "Chapter 10: 신체 사용설명서",
            desc: "타고난 약점과 조심해야 할 질병 (건강운)",
            icon: <Activity className="w-5 h-5 text-red-400" />,
            color: "red",
            blurType: "image",
            image: "/preview_ch10.png"
        },
        {
            id: 6,
            title: "Chapter 11: 나를 돕는 귀인",
            desc: "인생에서 꼭 잡아야 할 귀인은 누구인가?",
            icon: <Users className="w-5 h-5 text-green-400" />,
            color: "green",
            blurType: "image",
            image: "/preview_ch6.png"
        },
        {
            id: 8,
            title: "Chapter 12: 미래 배우자 얼굴",
            desc: "내가 결혼할 사람의 얼굴과 성격 특징 (AI 관상)",
            icon: <Heart className="w-5 h-5 text-pink-400" />,
            color: "pink",
            blurType: "image",
            image: "/preview_ch8.png"
        },
        {
            id: 13,
            title: "Chapter 13: 할머니의 직설",
            desc: "피가 되고 살이 되는 조선 욕쟁이 할머니의 조언",
            icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
            color: "yellow",
            blurType: "image",
            image: "/preview_ch13.png"
        },
        {
            id: 14,
            title: "Chapter 14: 마지막 당부",
            desc: "운명을 바꾸는 개운법 (부적 아님)",
            icon: <Lock className="w-5 h-5 text-stone-400" />,
            color: "stone",
            blurType: "image",
            image: "/preview_ch14.png"
        },
    ];

    return (
        <div className="w-full min-h-[80vh] bg-stone-950 text-stone-100 flex flex-col items-center justify-start py-12 px-4 animate-fadeIn">

            {/* Header / Hook with Countdown */}
            <div className="text-center mb-10 w-full max-w-lg">
                <div className="w-20 h-20 bg-stone-900 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    <Lock className="w-10 h-10 text-red-600 animate-pulse" />
                </div>
                <div className="inline-block bg-red-950/50 text-red-400 text-sm font-black px-4 py-1.5 rounded-full mb-6 border border-red-900 shadow-lg animate-bounce">
                    🚨 할인 종료까지 {formatTime(timeLeft)} 남음
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white tracking-tight leading-loose drop-shadow-xl">
                    <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent inline-block transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                        천기누설(天機漏洩)
                    </span><br />
                    <span>금지구역!</span>
                </h2>
                <p className="text-stone-400 text-lg leading-relaxed max-w-sm mx-auto">
                    "{userName}야, 복채도 안 내고<br />
                    내 비싼 입을 열게 하려고 했느냐?"
                </p>
            </div>

            {/* Swipeable Chapter List (Horizontal Scroll) */}
            <div className="w-full max-w-md mb-12 relative">
                <div className="text-left px-4 mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-red-600 block"></span>
                        프리미엄 리포트 미리보기
                        <span className="text-[10px] text-stone-500 font-normal ml-auto animate-pulse"> 옆으로 넘겨보세요 👉 </span>
                    </h3>
                </div>

                <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex overflow-x-auto gap-4 px-4 pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing select-none"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth', // SMOOTH SCROLLING
                        overscrollBehaviorX: 'contain'
                    }}
                >
                    {chapters.map((chapter) => (
                        <div
                            key={chapter.id}
                            onClick={scrollToPayment}
                            className={`
                                flex-shrink-0 w-[85%] md:w-[320px] h-[520px] snap-center
                                relative overflow-hidden rounded-3xl border bg-stone-900 cursor-pointer group transition-all duration-300
                                ${chapter.id === 8 ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'border-stone-800'}
                            `}
                        >
                            {/* Full Height Image Background */}
                            {chapter.image && (
                                <>
                                    <img
                                        src={chapter.image}
                                        alt={chapter.title}
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    />
                                    {/* Selective Blur Layers */}
                                    {(chapter.id === 5 || chapter.id === 8) && (
                                        <div className="absolute inset-0 w-full h-full backdrop-blur-[4px]"
                                            style={{
                                                maskImage: chapter.id === 5
                                                    ? 'linear-gradient(to bottom, transparent 40%, black 80%)'
                                                    : 'radial-gradient(circle at center, black 30%, transparent 70%)'
                                            }}
                                        ></div>
                                    )}
                                </>
                            )}

                            {/* Fallback for Ch 4 Graph if no image (though we mapped one) */}
                            {!chapter.image && chapter.blurType === 'graph' && (
                                <div className="absolute inset-0 bg-stone-900 flex items-end px-6 pb-20">
                                    <div className="h-40 w-full flex items-end gap-1">
                                        {graphData && graphData.length > 0 ? (
                                            graphData.map((d, i) => (
                                                <div key={i} className="flex-1 bg-blue-500/70 rounded-t" style={{ height: `${d.score}%` }}></div>
                                            ))
                                        ) : (
                                            Array.from({ length: 12 }).map((_, i) => (
                                                <div key={i} className={`flex-1 rounded-t opacity-80 ${i % 2 === 0 ? 'bg-stone-500' : 'bg-stone-600'}`} style={{ height: `${30 + Math.random() * 60}%` }}></div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Dark Gradient Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>

                            {/* TOP MASK: Reduced Height to 12 (3rem / 48px) - Just enough for text */}
                            <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-stone-950 via-stone-950 to-transparent z-0"></div>

                            {/* Header Content (Top) */}
                            <div className="absolute top-0 left-0 w-full p-6 flex items-start justify-between z-10">
                                <div>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${chapter.color}-500/20 border border-${chapter.color}-500/50 mb-3 backdrop-blur-md`}>
                                        {chapter.icon}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] border border-[#d4af37]/50 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                                        {/* Dynamic Display Logic: Map ID to Display Number */}
                                        {(() => {
                                            const displayMap: Record<number, string> = {
                                                4: 'Chapter 4',
                                                7: 'Chapter 5', 9: 'Chapter 6', 11: 'Chapter 7', 12: 'Chapter 8',
                                                5: 'Chapter 9', 10: 'Chapter 10', 6: 'Chapter 11', 8: 'Chapter 12',
                                                13: 'Chapter 13', 14: 'Chapter 14'
                                            };
                                            return displayMap[chapter.id] || `Chapter ${chapter.id}`;
                                        })()}
                                    </span>
                                </div>
                                {chapter.id === 8 && (
                                    <div className="bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                                        인기 1위 🔥
                                    </div>
                                )}
                            </div>

                            {/* Main Text Content (Bottom) */}
                            <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                                <h3 className={`text-2xl font-black mb-2 leading-tight ${chapter.id === 8 ? 'text-pink-400' : 'text-white'}`}>
                                    {chapter.title.split(': ')[1] || chapter.title}
                                </h3>
                                <p className="text-stone-300 text-sm leading-relaxed mb-4 opacity-90">
                                    {chapter.desc}
                                </p>

                                <div className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-sm group-hover:bg-white/20 transition-colors">
                                    <Lock size={14} /> 확인하기
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Killer Hook: Repeater Chapter 8 (Standalone) */}
            <div className="w-full max-w-md px-4 mb-20">
                <div className="relative overflow-hidden rounded-3xl border-2 border-pink-500 bg-stone-900 cursor-pointer group shadow-[0_0_50px_rgba(236,72,153,0.3)] transition-transform hover:scale-[1.02]" onClick={scrollToPayment}>

                    {/* Header Tag */}
                    <div className="absolute top-0 w-full bg-pink-600 text-white text-center text-xs font-bold py-2 z-20 uppercase tracking-wider shadow-md">
                        🔥 가장 많이 찾는 챕터
                    </div>

                    <div className="relative h-[600px]"> {/* Increased Height */}
                        <img
                            src="/preview_ch8.png"
                            alt="Future Spouse"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Ch 8 Custom Blur (Center) */}
                        <div className="absolute inset-0 w-full h-full backdrop-blur-[4px]"
                            style={{
                                maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                            }}
                        ></div>
                        {/* Stronger Gradient for text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                        {/* TOP MASK: Hide burnt-in 'Chapter 08' text */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-stone-900 via-stone-900/90 to-transparent pointer-events-none"></div>

                        <div className="absolute bottom-0 w-full p-8 text-center z-20 pb-12">
                            <h3 className="text-pink-300 font-bold text-sm tracking-widest uppercase mb-3 text-shadow">Special Report</h3>
                            <h2 className="text-4xl font-black text-white leading-tight mb-6 drop-shadow-xl">
                                미래 배우자 얼굴<br />
                                <span className="text-pink-500">지금 공개합니다</span>
                            </h2>
                            <button className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-transform group-hover:scale-105 flex items-center justify-center gap-2 mx-auto ring-2 ring-pink-400/30">
                                <Heart fill="currentColor" size={20} />
                                <span className="text-lg">내 남편/아내 얼굴 보기</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="w-full max-w-lg mb-12 px-4">
                <h3 className="text-center text-stone-500 text-sm font-bold mb-6 uppercase tracking-widest">Real Reviews</h3>
                <div className="space-y-4">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-stone-300 text-sm">{review.name}</span>
                                <div className="flex text-yellow-500">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                            </div>
                            <p className="text-stone-400 text-sm leading-snug">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Widget Section */}
            <div id="payment-section" className="w-full max-w-lg mb-20 px-4 scroll-mt-20">
                <h2 className="text-xl font-bold mb-4 text-center text-stone-100">결제 수단 선택</h2>
                <div className="bg-white rounded-2xl p-4 shadow-2xl">
                    <div id="payment-widget" className="w-full" />
                    <div id="agreement" className="w-full mt-2" />
                </div>
            </div>

            {/* Pricing Action Floating / Bottom */}
            <div className="w-full max-w-lg sticky bottom-6 z-50 px-4">
                <div className="bg-stone-900/95 backdrop-blur-xl border border-[#d4af37] rounded-2xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-[#d4af37]/50">
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[#d4af37] text-xs font-bold tracking-wider mb-0.5">PREMIUM FULL REPORT</p>
                            <p className="text-stone-400 text-[10px] line-through">₩50,000</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white">₩29,800</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={!isWidgetLoaded}
                        className={`w-full py-4 text-stone-950 text-xl font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group
                            ${isWidgetLoaded
                                ? 'bg-gradient-to-r from-[#d4af37] to-[#b5952f] hover:brightness-110 active:scale-95'
                                : 'bg-stone-600 cursor-not-allowed'}
                        `}
                    >
                        {!isWidgetLoaded ? (
                            <span>결제 로딩 중...</span>
                        ) : (
                            <>
                                <Lock size={20} className="group-hover:hidden" />
                                <span className="group-hover:hidden">결과 전체 잠금해제</span>
                                <span className="hidden group-hover:inline-block">지금 내 운명 확인하기 👉</span>
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-stone-500 mt-3">
                        * 결제 후 30일간 열람 가능 | 100% 익명 보장
                    </p>
                </div>
            </div>

            {/* Refund Policy & Trust Footer (PG Requirement) */}
            <div className="mt-8 text-center max-w-sm mx-auto pb-20 border-t border-stone-800 pt-8">
                <div className="flex flex-col gap-1 text-[10px] text-stone-500 mb-4">
                    <p className="font-bold text-stone-400 mb-1">주식회사 텐이어즈 (Ten Years Inc.)</p>
                    <p>대표자: 장세미 | 사업자등록번호: 397-86-03749</p>
                    <p>통신판매업신고: 준비중</p>
                    <p>주소: 대구광역시 중구 동성로 25, 961호</p>
                    <div className="flex items-center justify-center gap-2">
                        <p>고객센터: 070-8824-6240 | 이메일: ten_yearz@naver.com</p>
                        <a href="http://pf.kakao.com/_xeuGhX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-[#FAE100] text-[#3B1E1E] px-2 py-0.5 rounded font-bold hover:brightness-95 transition-all text-[10px]">
                            <MessageCircle size={12} fill="currentColor" /> 할마카세 문의
                        </a>
                    </div>
                    <p>서비스 이용 가능 기간: 구매일로부터 30일 (이후 데이터 삭제)</p>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400 underline decoration-stone-600 underline-offset-2 mb-6">
                    <a href="/terms" target="_blank" className="hover:text-stone-300">이용약관</a>
                    <a href="/privacy" target="_blank" className="hover:text-stone-300">개인정보처리방침</a>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-3 rounded text-[10px] text-stone-600 leading-tight text-left">
                    <p className="item-center flex gap-1 mb-1 font-bold text-stone-500">
                        <ShieldCheck className="w-3 h-3" /> 구매 안전(에스크로) 서비스 가입 사실 확인
                    </p>
                    * 디지털 콘텐츠 특성상 결제 후 '사주 풀이'가 시작되면 환불이 불가능합니다.<br />
                    * 단, 시스템 오류로 분석이 실패한 경우 100% 환불해 드립니다.
                </div>
            </div>

        </div>
    );
}
