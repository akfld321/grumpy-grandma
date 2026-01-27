'use client';

import React from 'react';
import { PaidSajuResult } from '@/types/PaidResultTypes';
import Chapter0 from './chapters/Chapter0';
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
import Chapter12 from './chapters/Chapter12'; // Import Ch12
import Chapter13 from './chapters/Chapter13'; // Import Ch13
import Chapter14 from './chapters/Chapter14'; // Enable Ch14
import { calculateSaju } from '@/lib/saju'; // Import calculateSaju
import { MOCK_PAID_RESULT } from '@/mocks/mockPaidResult'; // For fallback
import { Chapter11AIResponse, Chapter12AIResponse, Chapter13AIResponse, Chapter14AIResponse, SajuAIResponse } from '@/types/GeminiSchema';
import SalesPage from './SalesPage';
import LoadingView from './LoadingView';


interface PaidResultProps {
    data: PaidSajuResult;
    resultId?: string; // Optional: If viewing a saved result, we have an ID
    initialChapter?: number;
}

const PaidResult: React.FC<PaidResultProps> = ({ data, resultId, initialChapter = 0 }) => {
    // REORDERING LOGIC: Define the flow of chapters here
    // Original: 0->1->2->3->4->5->6->7->8->9->10->11->12->13->14
    // New (Money First): 0->1->2->3->4(Bridge/Graph)->7(Wealth)->9(Career)->11(Daewoon)->12(Yearly)->5(Shinsal)->10(Health)->6(Nobleman)->8(Spouse)->13->14
    const CHAPTER_SEQUENCE = [0, 1, 2, 3, 4, 7, 9, 11, 12, 5, 10, 6, 8, 13, 14];

    // Find initial step based on requested initialChapter ID
    const initialStep = CHAPTER_SEQUENCE.indexOf(initialChapter) !== -1 ? CHAPTER_SEQUENCE.indexOf(initialChapter) : 0;

    const [currentStep, setCurrentStep] = React.useState(initialStep);
    const currentChapterId = CHAPTER_SEQUENCE[currentStep];

    // Local state to store enriched data with AI responses
    const [sajuData, setSajuData] = React.useState<PaidSajuResult>(data);
    const sajuDataRef = React.useRef(sajuData); // Ref to access fresh state in async callbacks

    // Sync ref
    React.useEffect(() => {
        sajuDataRef.current = sajuData;
    }, [sajuData]);

    // Callback for children to update parent state (e.g. Chapter 8 saving image)
    const handleChapterUpdate = (chapterId: number, newData: any) => {
        console.log(`🔄 Chapter ${chapterId} Updated via Callback`);
        setSajuData(prev => {
            const newChapters = [...prev.chapters];
            const idx = newChapters.findIndex(c => c.chapterId === chapterId);
            if (idx !== -1) {
                newChapters[idx] = {
                    ...newChapters[idx],
                    aiResponse: { ...newChapters[idx].aiResponse, ...newData }
                };
            }
            return { ...prev, chapters: newChapters };
        });
    };

    const [loadingAI, setLoadingAI] = React.useState(false);

    const [isSharing, setIsSharing] = React.useState(false);
    const [shareUrl, setShareUrl] = React.useState<string | null>(null);
    const [allAIResponses, setAllAIResponses] = React.useState<Record<number, SajuAIResponse | null>>({});
    // FIX: Per-chapter error state to prevent race conditions
    const [errors, setErrors] = React.useState<Record<number, string>>({});

    // Phone Number Input State
    const [showPhoneInput, setShowPhoneInput] = React.useState(false);
    const [phoneNumber, setPhoneNumber] = React.useState('');

    // Hoisted Refs & Functions to avoid TDZ
    // START FIX: Ref-based tracking for fetching
    const fetchingRef = React.useRef<Set<string>>(new Set());



    const applyBatchData = (batchId: string, result: any) => {
        setSajuData(prev => {
            const newChapters = [...prev.chapters];
            let usageMetadata = prev.usage || [];

            // Merge Usage Data (Admin Stats)
            if (result._meta) {
                usageMetadata = [...usageMetadata, { ...result._meta, batchId, timestamp: new Date().toISOString() }];
            }

            const updateChapter = (id: number, content: any) => {
                const idx = newChapters.findIndex(c => c.chapterId === id);
                if (idx !== -1 && content) {
                    // Merge if existing data present (e.g. image URL)
                    const existing = newChapters[idx].aiResponse || {};
                    newChapters[idx] = { ...newChapters[idx], aiResponse: { ...existing, ...content } };
                }
            };

            if (batchId === 'BATCH_1_CORE') {
                // Legacy support or fallback logic
                updateChapter(2, result.ch2); updateChapter(3, result.ch3);
                updateChapter(4, result.ch4); updateChapter(5, result.ch5); updateChapter(6, result.ch6);
            } else if (batchId === 'BATCH_1_TEASER') {
                updateChapter(2, result.ch2);
                updateChapter(3, result.ch3);
            } else if (batchId === 'BATCH_1_PAID') {
                updateChapter(4, result.ch4);
                updateChapter(5, result.ch5);
                updateChapter(6, result.ch6);
            } else if (batchId === 'BATCH_2_WEALTH') {
                updateChapter(7, result.ch7);
                updateChapter(9, result.ch9);
                updateChapter(10, result.ch10);
                // Gap Filling Logic for Ch11 (Daewoon)
                let enhancedCh11 = result.ch11;
                if (result.ch11 && prev.daewoon && Array.isArray(result.ch11.daewoonDetails)) {
                    // Ensure AI response matches the length of calculated daewoon (Up to Age 80)
                    const calculatedDaewoon = prev.daewoon.filter((d: any) => d.age <= 80);
                    const aiDaewoon = result.ch11.daewoonDetails;

                    const filledDaewoon = calculatedDaewoon.map((realData: any, index: number) => {
                        const aiItem = aiDaewoon[index];
                        if (aiItem) return { ...aiItem, ...realData }; // Merge if exists

                        // Fallback if AI missed this item
                        return {
                            ganji: realData.ganji,
                            startAge: realData.age,
                            endAge: realData.age + 9,
                            meaning: `${realData.ganji} 대운`,
                            advice: "이 시기는 무난하게 흘러가는 평이한 운세다. 큰 욕심보다는 안정이 최고다."
                        };
                    });

                    enhancedCh11 = { ...result.ch11, daewoonDetails: filledDaewoon };
                }

                updateChapter(11, enhancedCh11);
                updateChapter(12, result.ch12);
            } else if (batchId === 'BATCH_3_FUTURE') {
                updateChapter(8, result.ch8);
                updateChapter(13, result.ch13);
                updateChapter(14, result.ch14);
            }
            return { ...prev, chapters: newChapters, usage: usageMetadata };
        });
    };

    const fetchBatch = async (batchId: 'BATCH_1_TEASER' | 'BATCH_1_PAID' | 'BATCH_2_WEALTH' | 'BATCH_3_FUTURE') => {
        // 0. GUARD: Check if data already exists to avoid redundant fetch
        let isBatchComplete = false;

        if (batchId === 'BATCH_1_TEASER') {
            if ([2, 3].every(id => sajuDataRef.current.chapters.find(c => c.chapterId === id)?.aiResponse)) isBatchComplete = true;
        } else if (batchId === 'BATCH_1_PAID') {
            if ([4, 5, 6].every(id => sajuDataRef.current.chapters.find(c => c.chapterId === id)?.aiResponse)) isBatchComplete = true;
        } else if (batchId === 'BATCH_2_WEALTH') {
            if ([7, 9, 10, 11, 12].every(id => sajuDataRef.current.chapters.find(c => c.chapterId === id)?.aiResponse)) isBatchComplete = true;
        } else if (batchId === 'BATCH_3_FUTURE') {
            if ([8, 13, 14].every(id => sajuDataRef.current.chapters.find(c => c.chapterId === id)?.aiResponse)) isBatchComplete = true;
        }

        if (isBatchComplete) return;

        // 1. Check in-memory Ref (deduplication)
        if (fetchingRef.current.has(batchId)) return;

        // 2. LocalStorage Cache Check
        // CHANGED: Added userName to key to distinguish users with same birth date, and bumped to v7
        const storageKey = `saju_batch_${data.userName}_${data.sajuKey.year}_${data.sajuKey.month}_${data.sajuKey.day}_${data.sajuKey.time}_${batchId}_v8`;
        const cached = localStorage.getItem(storageKey);

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                console.log(`[Cache Hit] ${batchId} loaded.`);
                applyBatchData(batchId, parsed);
                return;
            } catch (e) {
                localStorage.removeItem(storageKey);
            }
        }

        fetchingRef.current.add(batchId);
        console.log(`Triggering AI Analysis for ${batchId}...`);

        try {
            // Manual API Call
            const response = await fetch('/api/consult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sajuContext: data,
                    batchId: batchId
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error ${response.status}: ${errorText}`);
            }

            const aiResult = await response.json();

            if (aiResult) {
                // Save to Cache (Local)
                localStorage.setItem(storageKey, JSON.stringify(aiResult));

                // Apply to State (This will trigger the auto-save effect)
                applyBatchData(batchId, aiResult);

                // Clear Errors ONLY for chapters that were successfully returned
                setErrors(prev => {
                    const next = { ...prev };
                    const processValidation = (ids: number[], prefix: string) => {
                        ids.forEach(id => {
                            const key = `ch${id}`;
                            if (aiResult[key]) {
                                delete next[id]; // Success!
                            } else {
                                console.warn(`Missing data for Ch${id} in ${batchId}`);
                                next[id] = "분석 결과가 누락되었습니다. 다시 시도해주세요.";
                            }
                        });
                    };

                    if (batchId === 'BATCH_1_TEASER') processValidation([2, 3], 'ch');
                    if (batchId === 'BATCH_1_PAID') processValidation([4, 5, 6], 'ch');
                    if (batchId === 'BATCH_2_WEALTH') processValidation([7, 9, 10, 11, 12], 'ch');
                    if (batchId === 'BATCH_3_FUTURE') processValidation([8, 13, 14], 'ch');

                    return next;
                });
            }

        } catch (err) {
            console.error(`Batch Fetch Failed ${batchId}`, err);
            const errorMsg = "할머니가 잠시 마실 나갔다. 다시 불러봐라.";
            setErrors(prev => {
                const next = { ...prev };
                if (batchId === 'BATCH_1_TEASER') [2, 3].forEach(id => next[id] = errorMsg);
                if (batchId === 'BATCH_1_PAID') [4, 5, 6].forEach(id => next[id] = errorMsg);
                if (batchId === 'BATCH_2_WEALTH') [7, 9, 10, 11, 12].forEach(id => next[id] = errorMsg);
                if (batchId === 'BATCH_3_FUTURE') [8, 13, 14].forEach(id => next[id] = errorMsg);
                return next;
            });
        } finally {
            fetchingRef.current.delete(batchId);
        }
    };

    // --- AUTO-SAVE LOGIC (Reliable Persistence) ---
    React.useEffect(() => {
        if (!resultId) return; // Only save if we have a DB ID

        // Debounce save to avoid hammering server
        const timer = setTimeout(() => {
            // Check if we actually have data to save
            const hasAI = sajuData.chapters.some(c => c.aiResponse);
            if (!hasAI && !sajuData.isPaidResult) return;

            console.log("💾 Triggering Auto-Save to DB...");
            fetch('/api/update-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resultId: resultId,
                    aiResult: sajuData
                })
            }).then(r => r.json()).then(d => {
                if (d.success) console.log("✅ Auto-Save Complete");
                else console.warn("❌ Auto-Save Failed", d);
            }).catch(e => console.error("Auto-Save Error", e));

        }, 3000); // 3 seconds debounce

        return () => clearTimeout(timer);
    }, [sajuData, resultId]);

    const ensureAllChaptersLoaded = async () => {
        // Fetch ALL Paid batches
        await fetchBatch('BATCH_1_TEASER'); // Usually already done
        await fetchBatch('BATCH_1_PAID');
        await new Promise(r => setTimeout(r, 500));
        await fetchBatch('BATCH_2_WEALTH');
        await new Promise(r => setTimeout(r, 500));
        await fetchBatch('BATCH_3_FUTURE');
    };

    // IMMEDIATE FETCH: If data is missing for current chapter, fetch immediately.
    // This effect runs on chapter change OR data update, but does NOT trigger scroll.
    React.useEffect(() => {
        // Skip check for static chapters (0, 1)
        if (currentChapterId >= 2 && currentChapterId <= 14) {
            const currentData = sajuData.chapters.find(c => c.chapterId === currentChapterId);

            // Only trigger if data is missing AND no error is present
            if (!currentData?.aiResponse && !errors[currentChapterId]) {
                console.log(`⚡ Immediate Fetch Triggered for Ch${currentChapterId}`);

                // Map Chapter to Batch
                if ([2, 3].includes(currentChapterId)) fetchBatch('BATCH_1_TEASER');
                else if ([4, 5, 6].includes(currentChapterId)) {
                    if (sajuData.isPaidResult) fetchBatch('BATCH_1_PAID');
                }
                else if ([7, 9, 10, 11, 12].includes(currentChapterId) && sajuData.isPaidResult) fetchBatch('BATCH_2_WEALTH');
                else if ([8, 13, 14].includes(currentChapterId) && sajuData.isPaidResult) fetchBatch('BATCH_3_FUTURE');
            }
        }
    }, [currentChapterId, sajuData.chapters, sajuData.isPaidResult]);

    // ... (rendering logic)






    const handleShare = async () => {
        // Show saving indicator (using modal for now, or maybe just block interaction?)
        // For better UX, let's show the modal with spinner first.
        setIsSharing(true);
        setShareUrl(null);

        try {
            // 1. Ensure Data Completeness
            await ensureAllChaptersLoaded();

            // Wait for Ref update
            await new Promise(r => setTimeout(r, 500));
            const freshData = sajuDataRef.current; // access latest

            // 2. Save
            const { saveSajuResult } = await import('@/lib/api');
            const result = await saveSajuResult(freshData);

            if (result.success && result.id) {
                // Generate Link
                const link = `${window.location.protocol}//${window.location.host}/share/${result.id}`;
                setShareUrl(link);

                // 3. Try Native Share (Mobile)
                if (navigator.share) {
                    try {
                        // Close modal briefly to show native sheet or keep it behind?
                        // If we close it, and user cancels, we might need to reopen.
                        // But native share usually covers screen. 
                        // Let's keep modal open but updated with link.

                        await navigator.share({
                            title: '조선의 욕쟁이 할머니 사주',
                            text: '내 사주 결과 좀 봐라... 팩폭 미쳤다.',
                            url: link
                        });

                        // If shared successfully, maybe close modal?
                        setIsSharing(false);
                    } catch (err) {
                        console.log('Native share cancelled/failed', err);
                        // Make sure modal is visible (fallback)
                        setIsSharing(true);
                    }
                }
            } else {
                alert("저장에 실패했습니다: " + result.error);
                setIsSharing(false);
            }

        } catch (e) {
            console.error("Share Failed", e);
            alert("공유 중 오류가 발생했습니다.");
            setIsSharing(false);
        }
    };

    // Aggressive Pre-fetching Strategy
    React.useEffect(() => {
        const prefetch = async () => {
            console.log("🚀 Starting Batched Pre-fetching (Teaser Only)...");
            await fetchBatch('BATCH_1_TEASER'); // Only Ch 2, 3

            // If user already paid (restoring session), fetch the rest
            if (data.isPaidResult) {
                console.log("💎 Paid User Detected - Fetching remaining batches...");
                await fetchBatch('BATCH_1_PAID');
                await new Promise(r => setTimeout(r, 500));
                await fetchBatch('BATCH_2_WEALTH');
                await new Promise(r => setTimeout(r, 500));
                await fetchBatch('BATCH_3_FUTURE');
            }
        };
        prefetch();
    }, []); // Run ONCE on mount

    const [showToc, setShowToc] = React.useState(false);


    // 0~14 Full Range
    const totalSteps = CHAPTER_SEQUENCE.length;
    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Scroll to top whenever chapter changes
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [currentStep]);

    // IMMEDIATE FETCH: If data is missing for current chapter, fetch immediately.
    React.useEffect(() => {
        // Skip check for static chapters (0, 1)
        if (currentChapterId >= 2 && currentChapterId <= 14) {
            const currentData = sajuData.chapters.find(c => c.chapterId === currentChapterId);
            if (!currentData?.aiResponse && !errors[currentChapterId]) {
                console.log(`⚡ Immediate Fetch Triggered for Ch${currentChapterId}`);

                if ([2, 3].includes(currentChapterId)) fetchBatch('BATCH_1_TEASER');
                else if ([4, 5, 6].includes(currentChapterId)) {
                    if (sajuData.isPaidResult) fetchBatch('BATCH_1_PAID');
                }
                else if ([7, 9, 10, 11, 12].includes(currentChapterId) && sajuData.isPaidResult) fetchBatch('BATCH_2_WEALTH');
                else if ([8, 13, 14].includes(currentChapterId) && sajuData.isPaidResult) fetchBatch('BATCH_3_FUTURE');
            }
        }
    }, [currentChapterId, sajuData.chapters, sajuData.isPaidResult]);

    const jumpToChapter = (index: number) => {
        setCurrentStep(CHAPTER_SEQUENCE.indexOf(index));
        setShowToc(false);
    };

    const isDarkMode = [4, 5, 6, 7, 8, 10, 11].includes(currentChapterId);

    // Helper to get current chapter data
    const currentChapterData = sajuData.chapters.find(c => c.chapterId === currentChapterId);

    // Loading View handled by external component
    // const LoadingView = ... (Removed)

    const renderLoadError = () => (
        <div className="w-full max-w-md">
            {errors[currentChapterId] && (
                <div className="bg-red-100 text-red-800 p-2 text-center text-sm font-bold mb-4 rounded-lg">
                    ⚠️ {errors[currentChapterId]}
                </div>
            )}
        </div>
    );

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            alert('올바른 전화번호를 입력해주세요.');
            return;
        }

        // Save Phone Number to DB (Fire and Forget)
        if (resultId) {
            fetch('/api/update-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resultId: resultId,
                    phone: phoneNumber
                })
            });
        }

        setShowPhoneInput(false);
        alert('알림 신청이 완료되었습니다! 결과가 완성되면 카톡/문자로 링크를 보내드릴게요.');
    };

    if (showPhoneInput) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-white text-stone-900 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-fadeIn">
                    <h3 className="text-xl font-bold mb-2">📞 결과 알림 받기</h3>
                    <p className="text-sm text-stone-600 mb-4">
                        분석에 시간이 조금 걸립니다 (약 1~2분).<br />
                        완성되면 <strong>카톡/문자</strong>로 링크를 보내드릴까요?
                    </p>
                    <form onSubmit={handlePhoneSubmit} className="space-y-3">
                        <input
                            type="tel"
                            placeholder="010-1234-5678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full p-3 border border-stone-300 rounded-lg text-lg font-bold outline-none focus:border-amber-500"
                            autoFocus
                        />
                        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition">
                            알림 받기
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPhoneInput(false)}
                            className="w-full py-2 text-stone-400 text-sm hover:text-stone-600"
                        >
                            괜찮아요, 그냥 기다릴게요
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        if (currentChapterId === 0) return <Chapter0 data={data} />;
        if (currentChapterId === 1) return <Chapter1 data={data} />;

        // PAYWALL: Intercept Chapter 4 if not paid
        if (currentChapterId === 4 && !sajuData.isPaidResult) {
            // Try to extract Graph Data from pre-fetched Chapter 4 (if available)
            const ch4Data = sajuData.chapters.find(c => c.chapterId === 4);
            const graphData = ch4Data?.aiResponse?.lifeGraph;

            return (
                <SalesPage
                    userName={data.userName}
                    graphData={graphData} // Pass Real (or undefined) Data
                    onPaymentStart={async () => {
                        try {
                            if (resultId) return resultId; // Already saved

                            // Save First
                            const { saveSajuResult } = await import('@/lib/api');
                            const result = await saveSajuResult(sajuDataRef.current);

                            if (result.success && result.id) {
                                return result.id;
                            } else {
                                alert("결제 전 데이터 저장에 실패했습니다.");
                                return null;
                            }
                        } catch (e) {
                            console.error("Save failed", e);
                            return null;
                        }
                    }}
                />
            );
        }

        // For dynamic chapters, check if data exists.
        if (currentChapterId >= 2) {
            if (!currentChapterData?.aiResponse) {
                const errorMsg = errors[currentChapterId];
                if (errorMsg) {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
                            <div className="bg-red-100 p-4 rounded-full text-red-600 mb-2">⚠️</div>
                            <h3 className="text-xl font-bold text-stone-800">분석에 실패했구먼...</h3>
                            <p className="text-stone-600">"할머니가 잠시 조는 바람에 사주를 못 봤다.<br />다시 한 번 물어봐라."</p>
                            <p className="text-xs text-red-400 font-mono bg-red-50 p-2 rounded">{errorMsg}</p>
                            <button
                                onClick={() => {
                                    setErrors(prev => {
                                        const next = { ...prev };
                                        delete next[currentChapterId];
                                        return next;
                                    });
                                    // Clear locks
                                    fetchingRef.current.delete('BATCH_1_TEASER');
                                    fetchingRef.current.delete('BATCH_1_PAID');
                                    fetchingRef.current.delete('BATCH_2_WEALTH');
                                    fetchingRef.current.delete('BATCH_3_FUTURE');

                                    if ([2, 3].includes(currentChapterId)) fetchBatch('BATCH_1_TEASER');
                                    else if ([4, 5, 6].includes(currentChapterId)) fetchBatch('BATCH_1_PAID');
                                    else if ([7, 9, 10, 11, 12].includes(currentChapterId)) fetchBatch('BATCH_2_WEALTH');
                                    else if ([8, 13, 14].includes(currentChapterId)) fetchBatch('BATCH_3_FUTURE');
                                }}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
                            >
                                다시 시도하기
                            </button>
                        </div>
                    );
                }
                return <LoadingView />;
            }
        }


        if (currentChapterId === 2 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter2 content={currentChapterData} />
                </div>
            );
        }

        if (currentChapterId === 3 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter3 content={currentChapterData} />
                </div>
            );
        }

        if (currentChapterId === 4 && currentChapterData) {
            const contentWithPillars = {
                ...currentChapterData,
                chapterSub: currentChapterData.chapterSub || "",
                desc: currentChapterData.desc || "",
                data: { ...currentChapterData.data, pillars: sajuData.pillars }
            };
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter4 content={contentWithPillars as any} />
                </div>
            );
        }

        if (currentChapterId === 5 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter5 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 6 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter6 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 7 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter7 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 8 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter8
                        content={currentChapterData as any}
                        resultId={resultId}
                        onUpdate={(newData) => handleChapterUpdate(8, newData)}
                    />
                </div>
            );
        }

        if (currentChapterId === 9 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter9 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 10 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter10 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 11 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter11 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 12 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter12 content={currentChapterData as any} />
                </div>
            );
        }

        if (currentChapterId === 13 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter13 content={currentChapterData} userQuestion={data.question} />
                </div>
            );
        }

        if (currentChapterId === 14 && currentChapterData) {
            return (
                <div className="w-full max-w-md">
                    {renderLoadError()}
                    <Chapter14
                        content={currentChapterData}
                        onShare={handleShare}
                        onRestart={() => {
                            if (window.confirm("처음부터 다시 하시겠습니까?")) {
                                window.location.href = '/';
                            }
                        }}
                    />
                </div>
            );
        }



        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-stone-400">
                <p>Chapter {currentChapterId} 준비 중...</p>
            </div>
        );
    };

    return (
        <>
            <div className={`min-h-screen pb-20 max-w-md mx-auto flex flex-col relative transition-colors duration-500 print:hidden ${isDarkMode ? 'bg-stone-900 shadow-2xl' : 'bg-stone-50 shadow-2xl'
                }`}>
                {/* Header / Progress */}
                <header className={`fixed top-0 left-0 right-0 mx-auto w-full max-w-md z-50 backdrop-blur-md border-b px-4 py-4 flex items-center justify-center shadow-sm transition-colors duration-500 ${isDarkMode
                    ? 'bg-stone-900/90 border-stone-800 text-stone-200'
                    : 'bg-white/95 border-stone-200 text-stone-800'
                    }`}>
                    <h1 className="text-sm font-bold tracking-wide uppercase">
                        조선의 욕쟁이 할머니 <span className="mx-2 opacity-30">|</span>
                        {(() => {
                            // Header Title Logic
                            const titleMap: Record<number, string> = {
                                0: 'Prologue', 1: 'Chapter 1', 2: 'Chapter 2', 3: 'Chapter 3', 4: 'Chapter 4',
                                7: 'Chapter 5 (재물)', 9: 'Chapter 6 (적성)', 11: 'Chapter 7 (대운)', 12: 'Chapter 8 (년운)',
                                5: 'Chapter 9 (신살)', 10: 'Chapter 10 (건강)', 6: 'Chapter 11 (귀인)', 8: 'Chapter 12 (연애)',
                                13: 'Chapter 13', 14: 'Chapter 14'
                            };
                            return titleMap[currentChapterId] || `Chapter ${currentChapterId}`;
                        })()}
                    </h1>
                </header>

                {/* TOC Overlay */}
                {showToc && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
                        <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-stone-800">
                            <div className="bg-stone-800 text-white p-4 flex justify-between items-center shrink-0">
                                <h2 className="font-bold text-lg">📜 사주 목차</h2>
                                <button onClick={() => setShowToc(false)} className="text-stone-400 hover:text-white">✕</button>
                            </div>
                            <div className="p-2 max-h-[70vh] overflow-y-auto overscroll-contain">
                                {[
                                    { id: 0, title: 'Prologue: 할머니의 초대' },
                                    { id: 1, title: 'Chapter 1: 나의 사주 팔자' },
                                    { id: 2, title: 'Chapter 2: 전생의 업보' },
                                    { id: 3, title: 'Chapter 3: 사회적 가면' },
                                    { id: 4, title: 'Chapter 4: 인생 에너지 그래프' },
                                    { id: 7, title: 'Chapter 5: 돈 그릇 (재물운)' },
                                    { id: 9, title: 'Chapter 6: 천직과 적성' },
                                    { id: 11, title: 'Chapter 7: 10년 대운 (인생의 계절)' },
                                    { id: 12, title: 'Chapter 8: 향후 5년 & 삼재' },
                                    { id: 5, title: 'Chapter 9: 내 안의 신과 살' },
                                    { id: 10, title: 'Chapter 10: 신체 사용설명서 (건강)' },
                                    { id: 6, title: 'Chapter 11: 귀인 (인복)' },
                                    { id: 8, title: 'Chapter 12: 미래의 짝꿍 (연애운)' },
                                    { id: 13, title: 'Chapter 13: 할머니의 직설' },
                                    { id: 14, title: 'Chapter 14: 마지막 당부' },
                                ].map((item) => {
                                    // Calculate locking status
                                    // In the original flow, lock was item.idx >= 4.
                                    // Here, any ID other than 0,1,2,3,4 needs lock if not paid.
                                    // Actually Ch 4 is the bridge/sales page, so it is "unlocked" content-wise but triggers payment?
                                    // Wait, Ch 4 renders content if paid, or sales page if not using `renderContent`.
                                    // In `renderContent`, if Ch4 && !paid -> SalesPage.
                                    // So in TOC, Ch4 is clickable.
                                    // But Ch 7 (Wealth) is definitely locked.
                                    const isLocked = ![0, 1, 2, 3, 4].includes(item.id) && !sajuData.isPaidResult;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                if (isLocked) {
                                                    alert("어허! 복채도 안 내고 어딜 보려고!\n결제 먼저 하고 온나!");
                                                    return;
                                                }
                                                // Find index in sequence
                                                const stepIndex = CHAPTER_SEQUENCE.indexOf(item.id);
                                                jumpToChapter(item.id); // This function expects ID because we seemingly fixed it? 
                                                // Wait, let's check jumpToChapter definition.
                                                // It accepts 'index'. And sets currentStep = CHAPTER_SEQUENCE.indexOf(index).
                                                // So we pass the ID.
                                            }}
                                            className={`w-full text-left p-4 rounded-lg mb-1 transition-colors font-medium border-b border-stone-100 last:border-0 flex justify-between items-center
                                                ${currentChapterId === item.id
                                                    ? 'bg-dancheong-red text-white'
                                                    : isLocked
                                                        ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                                                        : 'hover:bg-stone-100 text-stone-700'
                                                }`}
                                        >
                                            <span>{item.title}</span>
                                            {isLocked && <span className="text-xs">🔒</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-grow w-full min-h-[70vh] flex flex-col items-center pt-20 pb-6 animate-fadeIn">
                    {renderContent()}
                </main>

                {/* Footer Navigation */}
                <footer className="fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full bg-stone-900 text-white p-0 z-50 flex shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
                    {/* TOC Button */}
                    {(currentChapterId !== 4 || sajuData.isPaidResult) && (
                        <button
                            onClick={() => setShowToc(!showToc)}
                            className="flex-1 py-5 flex items-center justify-center gap-2 hover:bg-stone-800 active:bg-stone-700 transition-colors border-r border-stone-700"
                        >
                            <span className="text-lg">📜</span>
                            <span className="font-bold">목차</span>
                        </button>
                    )}

                    {/* Prev Button */}
                    <button
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        disabled={currentStep === 0}
                        className="w-20 flex items-center justify-center hover:bg-stone-800 active:bg-stone-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-stone-700 font-black text-xl"
                    >
                        &lt;
                    </button>

                    {/* Next Button */}
                    {/* Next Button / Save Button */}
                    {(currentChapterId === 4 && !sajuData.isPaidResult) ? (
                        <div className="flex-1 flex items-center justify-center bg-stone-800 text-stone-500 font-bold text-sm cursor-not-allowed">
                            결제 필요
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (currentStep >= totalSteps - 1) { // Last Step?
                                    handleShare();
                                } else {
                                    handleNext();
                                }
                            }}
                            className={`w-24 flex items-center justify-center transition-colors font-black text-xl text-white ${currentStep >= totalSteps - 1
                                ? 'bg-pink-600 hover:bg-pink-700 w-auto px-6 text-base gap-2'
                                : 'bg-red-700 hover:bg-red-800'
                                }`}
                        >
                            {currentStep >= totalSteps - 1 ? (
                                <>
                                    <span>📥</span>
                                    <span>저장</span>
                                </>
                            ) : '>'}
                        </button>
                    )}
                </footer>


            </div>



            {/* Footer Information */}
            <div className="text-center pb-32 text-stone-400 text-[10px] space-y-1">
                <p>Copyright © 2026 Grumpy Grandma. All rights reserved.</p>
                <p className="font-mono text-stone-500">System v30 - PAYWALL MODE (Gemini 3 REAL + Nano Banana Pro)</p>
            </div>


            {/* Share Modal */}
            {(isSharing || shareUrl) && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
                        <h3 className="text-xl font-bold text-stone-900 border-b pb-2">
                            📣 결과 공유하기
                        </h3>

                        {!shareUrl ? (
                            <div className="py-8">
                                <div className="animate-spin text-3xl mb-4">⏳</div>
                                <p className="text-stone-600 font-medium">
                                    할머니가 서버에<br />기록을 남기는 중입니다...
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-2">
                                <p className="text-sm text-stone-500">
                                    아래 링크를 복사해서<br />친구들에게 보내주세요!
                                </p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        className="flex-1 bg-stone-100 p-3 rounded-lg text-sm text-stone-600 border border-stone-200 outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(shareUrl);
                                            alert("링크가 복사되었습니다!");
                                        }}
                                        className="bg-stone-800 text-white p-3 rounded-lg font-bold hover:bg-stone-700"
                                    >
                                        복사
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => {
                                            // @ts-ignore
                                            if (window.Kakao) {
                                                // If Kakao SDK is initialized
                                                // For MVP, just use Link Copy
                                            } else {
                                                // alert("카카오톡 SDK가 아직 연동되지 않았습니다. 링크 복사를 이용해주세요.");
                                            }
                                            // Native Share if available
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: '조선의 욕쟁이 할머니 사주',
                                                    text: '내 사주 결과 좀 봐라... 팩폭 미쳤다.',
                                                    url: shareUrl
                                                });
                                            }
                                        }}
                                        className="w-full py-3 bg-[#FEE500] text-stone-900 rounded-lg font-bold hover:bg-[#FDD835]"
                                    >
                                        카카오톡/문자 보내기
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsSharing(false);
                                        setShareUrl(null);
                                    }}
                                    className="text-stone-400 text-sm hover:text-stone-600 underline"
                                >
                                    닫기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PaidResult;
