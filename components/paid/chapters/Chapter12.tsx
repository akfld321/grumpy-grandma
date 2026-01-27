import React from 'react';
import { motion } from 'framer-motion';
import { formatWithSentenceBreaks } from '@/utils/textFormatting';
import { Calendar, AlertTriangle, ShieldAlert, BadgeAlert } from 'lucide-react';
import { ChapterContent } from '@/types/PaidResultTypes';
import { Chapter12AIResponse } from '@/types/GeminiSchema';

interface Chapter12Props {
    content: ChapterContent;
}

export default function Chapter12({ content }: Chapter12Props) {
    const aiData = content.aiResponse as Chapter12AIResponse | undefined;

    // Defensive check
    if (!aiData || !aiData.samsae || !aiData.fiveYearFlow) {
        return (
            <div className="text-center p-6 bg-red-50 rounded-xl text-red-600">
                <p className="font-bold">데이터를 불러오는 데 문제가 생겼습니다.</p>
                <p className="text-sm">(Samsae or Flow Missing)</p>
            </div>
        );
    }

    const { fiveYearFlow, samsae, accidentCaution } = aiData;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-900 font-aggro">
                    향후 5년, <span className="text-dancheong-red relative inline-block">
                        운세 신호등
                        <div className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-200 -z-10 opacity-70"></div>
                    </span>
                </h2>
                <p className="text-stone-500 font-medium whitespace-pre-line">
                    "앞으로 5년, 언제 치고 나가고 언제 엎드릴지 알려주마."
                </p>
            </div>

            {/* 1. Samsae Analysis (Conditional) */}
            {samsae.isSamsae && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-50 border-4 border-red-500 rounded-2xl p-6 relative overflow-hidden shadow-lg"
                >
                    <div className="absolute -right-6 -top-6 text-red-100 opacity-50 rotate-12">
                        <BadgeAlert size={140} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center gap-3">
                        <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-black animate-pulse">
                            ⚠️ 경고: 삼재(三災) 진입
                        </div>
                        <h3 className="text-2xl font-black text-red-900">
                            지금은 '{samsae.yearType === 'entering' ? '들삼재' : samsae.yearType === 'staying' ? '눌삼재' : '날삼재'}' 기간이다!
                        </h3>
                        <p className="text-red-800 font-bold leading-normal whitespace-pre-wrap break-keep">
                            "{formatWithSentenceBreaks(samsae.description)}"
                        </p>
                        <ul className="text-xs text-red-700 bg-white/50 p-3 rounded-lg w-full text-left space-y-1 mt-2 font-medium">
                            <li>• 들삼재: 삼재가 들어오는 해. 가족이나 본인 건강 조심해라.</li>
                            <li>• 눌삼재: 삼재가 머무는 해. 사업 확장이나 이사는 금물이다.</li>
                            <li>• 날삼재: 삼재가 나가는 해. 마지막까지 긴장 늦추지 마라.</li>
                        </ul>
                    </div>
                </motion.div>
            )}

            {!samsae.isSamsae && (
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-black text-green-800 mb-2">🎉 삼재 탈출! 걱정 마라!</h3>
                    <p className="text-green-700 font-bold">
                        "다행히 당분간 삼재 걱정은 없구나. 이럴 때 부지런히 움직여야 돈을 번다!"
                    </p>
                </div>
            )}

            {/* 2. 5-Year Timeline Flow */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-slate-900" />
                    <h3 className="font-bold text-lg">연도별 운세 흐름</h3>
                </div>

                <div className="relative border-l-4 border-stone-200 ml-4 space-y-8 py-2">
                    {fiveYearFlow.map((yearData, idx) => (
                        <motion.div
                            key={yearData.year}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-8"
                        >
                            {/* Dot */}
                            <div className={`absolute -left-[10px] top-6 w-5 h-5 rounded-full border-4 border-white shadow-sm ${yearData.score >= 80 ? 'bg-red-500' : yearData.score >= 50 ? 'bg-green-500' : 'bg-stone-400'
                                }`}></div>

                            <div className="bg-white border-2 border-stone-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2 border-b border-stone-100 pb-2">
                                    <div>
                                        <span className="text-2xl font-black font-aggro text-slate-800 mr-2">{yearData.year}년</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded text-white ${yearData.score >= 80 ? 'bg-red-500' : yearData.score >= 50 ? 'bg-green-600' : 'bg-stone-400'
                                            }`}>
                                            {yearData.score}점
                                        </span>
                                    </div>
                                    <span className="font-bold text-slate-600 text-sm">{yearData.keyword}</span>
                                </div>

                                <p className="text-slate-700 font-medium leading-normal mb-3 whitespace-pre-wrap">
                                    "{formatWithSentenceBreaks(yearData.advice)}"
                                </p>

                                {yearData.warning && (
                                    <div className="bg-orange-50 text-orange-800 text-xs font-bold p-2 rounded flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        <span>주의: {yearData.warning}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 3. Accident Caution */}
            <div className="bg-stone-800 text-stone-200 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldAlert size={100} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <ShieldAlert className="text-yellow-400" />
                    할머니의 특별 경고 (사고수)
                </h3>
                <p className="text-sm font-medium leading-normal bg-stone-900/50 p-4 rounded-xl border border-stone-700 whitespace-pre-wrap break-keep">
                    {formatWithSentenceBreaks(accidentCaution)}
                </p>
                <p className="text-xs text-stone-400 mt-3 text-right">
                    * 미리 알고 조심하면 피해갈 수 있는 법이다.
                </p>
            </div>
        </div>
    );
}
