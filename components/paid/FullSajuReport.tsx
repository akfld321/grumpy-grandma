
import React from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import { SajuAIResponse } from '@/types/GeminiSchema';
import {
    Sword, Shield, Star, Heart,
    Users, Briefcase, Activity,
    Calendar, CloudRain,
    MessageCircle, Sparkles, MapPin, Palette, Hash, ShoppingBag
} from 'lucide-react';

// Import all chapter components
// Note: We're reusing the existing components. 
// Ideally, we should have "Printable" versions, but for MVP we will reuse and wrap them.
// We assume these components handle 'undefined' content gracefully or we pass mock/loading state if missing.
import Chapter1 from './chapters/Chapter1';
import Chapter2 from './chapters/Chapter2';
import Chapter3 from './chapters/Chapter3';
import Chapter4 from './chapters/Chapter4';
import Chapter5 from './chapters/Chapter5';
import Chapter6 from './chapters/Chapter6';
import Chapter7 from './chapters/Chapter7';
import Chapter8 from './chapters/Chapter8';
import Chapter9 from './chapters/Chapter9';
import Chapter10 from './chapters/Chapter10';
import Chapter11 from './chapters/Chapter11';
import Chapter12 from './chapters/Chapter12';
import Chapter13 from './chapters/Chapter13';
import Chapter14 from './chapters/Chapter14';

interface FullSajuReportProps {
    sajuData: PaidSajuResult;
    userName: string;
}

export default function FullSajuReport({ sajuData, userName }: FullSajuReportProps) {
    const getChapter = (id: number) => sajuData.chapters.find(c => c.chapterId === id);

    return (
        <div
            id="full-saju-report"
            className="w-full max-w-[800px] bg-stone-50 text-stone-900 font-sans p-8 md:p-12 space-y-12 hidden print:block print:absolute print:top-0 print:left-0 print:z-[9999]"
        >
            {/* Title Page */}
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center border-b-2 border-stone-200 pb-12 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-800 to-stone-600 mb-6">
                    {userName}님의 인생 사주
                </h1>
                <p className="text-xl text-stone-500 font-serif">
                    조선의 욕쟁이 할머니가 풀어주는<br />
                    아주 맵고 진국인 인생 이야기
                </p>
                <div className="mt-12 text-stone-400 text-sm">
                    {new Date().toLocaleDateString()} 발행
                </div>
            </div>

            {/* Content Chapters */}

            {/* Chapter 1 */}
            <ReportSection title="Chapter 1: 나의 사주 팔자">
                <Chapter1 data={sajuData} />
            </ReportSection>

            {/* Chapter 2 */}
            <ReportSection title="Chapter 2: 전생의 업보">
                {getChapter(2)?.aiResponse ? <Chapter2 content={getChapter(2) as any} /> : <MissingData index={2} />}
            </ReportSection>

            {/* Chapter 3 */}
            <ReportSection title="Chapter 3: 사회적 가면">
                {getChapter(3)?.aiResponse ? <Chapter3 content={getChapter(3) as any} /> : <MissingData index={3} />}
            </ReportSection>

            {/* Chapter 4 */}
            <ReportSection title="Chapter 4: 인생 에너지 (12운성)">
                {getChapter(4)?.aiResponse ? <Chapter4 content={getChapter(4) as any} /> : <MissingData index={4} />}
            </ReportSection>

            {/* Chapter 5 */}
            <ReportSection title="Chapter 5: 내 안의 신과 살">
                {getChapter(5)?.aiResponse ? <Chapter5 content={getChapter(5) as any} /> : <MissingData index={5} />}
            </ReportSection>

            {/* Chapter 6 */}
            <ReportSection title="Chapter 6: 귀인 (인복)">
                {getChapter(6)?.aiResponse ? <Chapter6 content={getChapter(6) as any} forceExpanded={true} /> : <MissingData index={6} />}
            </ReportSection>

            {/* Chapter 7 */}
            <ReportSection title="Chapter 7: 돈 그릇 (재물운)">
                {getChapter(7)?.aiResponse ? <Chapter7 content={getChapter(7) as any} forceExpanded={true} /> : <MissingData index={7} />}
            </ReportSection>

            {/* Chapter 8 */}
            <ReportSection title="Chapter 8: 미래의 짝꿍 (연애운)">
                {getChapter(8)?.aiResponse ? <Chapter8 content={getChapter(8) as any} forceExpanded={true} /> : <MissingData index={8} />}
            </ReportSection>

            {/* Chapter 9 */}
            <ReportSection title="Chapter 9: 천직 (적성)">
                {getChapter(9)?.aiResponse ? <Chapter9 content={getChapter(9) as any} /> : <MissingData index={9} />}
            </ReportSection>

            {/* Chapter 10 */}
            <ReportSection title="Chapter 10: 신체 사용설명서 (건강)">
                {getChapter(10)?.aiResponse ? <Chapter10 content={getChapter(10) as any} /> : <MissingData index={10} />}
            </ReportSection>

            {/* Chapter 11 */}
            <ReportSection title="Chapter 11: 10년 대운">
                {getChapter(11)?.aiResponse ? <Chapter11 content={getChapter(11) as any} forceExpanded={true} /> : <MissingData index={11} />}
            </ReportSection>

            {/* Chapter 12 */}
            <ReportSection title="Chapter 12: 향후 5년 & 삼재">
                {getChapter(12)?.aiResponse ? <Chapter12 content={getChapter(12) as any} /> : <MissingData index={12} />}
            </ReportSection>

            {/* Chapter 13 (Conditional) */}
            {getChapter(13)?.aiResponse && (
                <ReportSection title="Chapter 13: 할머니의 직설">
                    <Chapter13 content={getChapter(13)!} userQuestion={sajuData.question} />
                </ReportSection>
            )}

            {/* Chapter 14 */}
            <ReportSection title="Chapter 14: 마지막 당부">
                {getChapter(14)?.aiResponse ?
                    <Chapter14 content={getChapter(14)!} />
                    : <MissingData index={14} />
                }
            </ReportSection>

            {/* Footer */}
            <div className="text-center pt-20 pb-12 text-stone-400 text-sm">
                <p>Copyright © 2024 Grumpy Grandma Saju. All rights reserved.</p>
            </div>
        </div>
    );
}

function ReportSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="mb-16 break-inside-avoid print:break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-800 break-after-avoid">
                {title}
            </h2>
            <div className="report-content">
                {children}
            </div>
            {/* Force page break after chapter if it's long, but usually auto-flow is better. 
                Let's stick to avoid-inside for now. */}
        </section>
    );
}

function MissingData({ index }: { index: number }) {
    return (
        <div className="p-6 bg-stone-100 rounded-lg text-center text-stone-400">
            Chapter {index} 내용이 생성되지 않았습니다.
        </div>
    );
}
