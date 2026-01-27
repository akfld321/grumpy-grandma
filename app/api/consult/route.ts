import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
    if (!apiKey) {
        console.error("API Key is missing in server env");
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not set in environment variables." },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { sajuContext, chapterId, batchId } = body;

        // SMART MODEL SELECTION
        // Priority: Gemini 3.0 Flash Preview -> Fallback: Gemini 2.0 Flash
        // See implementation below.

        // Base Persona Prompt
        const basePersona = `
        너는 '조선의 욕쟁이 할머니'다. 
        사용자의 사주팔자를 보고 아주 신랄하고 거침없이 팩트폭격을 날려야 한다.
        절대 존댓말을 쓰지 마라. 반말과 사투리를 섞어라.
        
        **중요한 지침 - 길이와 디테일(VITAL):**
        1. **모든 챕터의 각 항목은 반드시 '공백 포함 500자 이상'으로 작성해라.** (짧으면 절대 안 된다. 아주 상세하게 썰을 풀어라)
        2. 단순 요약보다는 "구체적인 이야기"와 "비유"를 들어라.
        3. 사용자가 읽는 맛이 나도록 찰진 입담을 과시해라.
        
        **톤앤매너:**
        1. 욕쟁이 컨셉이지만, **결론은 항상 듣는 사람이 기분 좋고 희망찬 내용**이어야 한다. '업보'라고 해서 무섭게 하지 말고, '네가 타고난 끼'나 '복'으로 해석해 줘라. 츤데레처럼 겉은 차갑지만 속은 아주 따뜻하게 격려해라.
        2. **한자(Hanja) 사용 시 필수:** 한자를 쓸 때는 반드시 괄호 안에 한글로 읽는 법이나 뜻을 적어줘야 한다. (예: 木(나무 목), 財星(재물운)) 절대 한자만 띡 던지지 마라.
        
        네가 분석할 사용자의 사주 데이터는 다음과 같다:
        ${JSON.stringify(sajuContext, null, 2)}
        `;

        let specificPrompt = "";
        let schemaPrompt = "";

        // --- BATCH 1 (TEASER): Free Tier (Ch 2, 3) ---
        if (batchId === 'BATCH_1_TEASER' || chapterId === 'BATCH_1_TEASER') {
            console.log("Processing BATCH 1: TEASER (Ch 2, 3)");
            specificPrompt = `
            너의 임무는 위 데이터를 바탕으로 **Chapter 2, 3**의 내용을 한 번에 생성하는 것이다.
            **각 항목마다 소설책 한 페이지 분량(최소 500자 이상)으로 아주 길고 풍성하게 떠들어라.**
            
            1. **Ch2(자아/전생)**: 일주와 오행으로 전생과 본성 분석. (전생의 구체적인 상황 묘사와, 현생의 성격 연결고리를 500자 이상 서술)
            2. **Ch3(사회/가면)**: 십성 분포와 socialScore(${sajuContext.socialScore})를 바탕으로 사회적 가면과 내면 분석. (회사나 학교에서의 구체적인 상황 예시 필수)
            `;

            schemaPrompt = `
            응답 형식 (JSON):
            {
               "ch2": {
                    "pastLife": { "theme": "...", "karmaAnalysis": "최소 500자 이상 작성...", "reincarnationReason": "..." },
                    "dayMasterAnalysis": {
                        "coreNature": { "title": "...", "description": "최소 500자 이상 작성..." },
                        "lifestyle": { "title": "...", "description": "..." },
                        "innerHeart": { "title": "...", "description": "..." }
                    },
                    "elementalBalance": {
                        "myShape": "...",
                        "lacks": { "element": "...", "consequence": "...", "advice": "..." },
                        "excess": { "element": "...", "consequence": "...", "advice": "..." },
                        "advice": "..."
                    }
                },
               "ch3": {
                    "socialMask": { "title": "...", "description": "최소 500자 이상 작성...", "score": ${sajuContext.socialScore || 0} },
                    "realSelf": { "title": "...", "description": "..." },
                    "career": { "recommendation": "...", "jobStyle": "...", "scolding": "..." },
                    "tenGodsAnalysis": { "dominant": "...", "explanation": "..." }
                }
            }
            `;

            // --- BATCH 1 (PAID): Core Analysis (Ch 4, 5, 6) ---
        } else if (batchId === 'BATCH_1_PAID' || chapterId === 'BATCH_1_PAID') {
            console.log("Processing BATCH 1: PAID (Ch 4, 5, 6)");
            specificPrompt = `
            너의 임무는 위 데이터를 바탕으로 **Chapter 4, 5, 6**의 내용을 한 번에 생성하는 것이다.
            **각 항목마다 소설책 한 페이지 분량(최소 500자 이상)으로 아주 길고 풍성하게 떠들어라.**

            1. **Ch4(에너지 흐름)**: 12운성 흐름을 보고 인생의 현재 단계 조언. **(추가: 10대부터 80대까지의 인생 에너지 그래프 점수(0~100)를 구체적인 키워드와 함께 생성하라. 사주의 대운 흐름을 참고하여 리얼하게 작성.)**
            3. **Ch6(귀인)**: 천을귀인 유무(${sajuContext.cheoneul?.has})에 따른 인복 분석. (누가 귀인인지, 어떻게 나타나는지 드라마처럼 묘사).
               **중요: 'noblemanList'에는 사용자가 이해하기 쉽게 십이지신(띠, 동물)에 해당하는 글자(자, 축, 인, 묘...)를 우선적으로 포함시켜라. 천간(갑, 을...)이 귀인이라 하더라도, 현실에서 찾기 쉬운 띠(동물)로 변환하거나 함께 언급해라.**
            `;

            schemaPrompt = `
            응답 형식 (JSON):
            {
               "ch4": {
                    "graphInterpretation": "최소 500자 이상 작성...",
                    "currentStage": { "stage": "...", "description": "...", "advice": "..." },
                    "onePointLesson": "...",
                    "lifeGraph": [
                        { "age": "10대", "score": 50, "keyword": "..." },
                        { "age": "20대", "score": 75, "keyword": "..." },
                        { "age": "30대", "score": 60, "keyword": "..." },
                        { "age": "40대", "score": 85, "keyword": "..." },
                        { "age": "50대", "score": 90, "keyword": "..." },
                        { "age": "60대", "score": 70, "keyword": "..." },
                        { "age": "70대", "score": 60, "keyword": "..." },
                        { "age": "80대", "score": 50, "keyword": "..." }
                    ]
                },
               "ch5": {
                    "shinsalList": [{ "name": "...", "description": "...", "isPositive": true/false }],
                    "mainShinsalAnalysis": { "title": "...", "description": "최소 500자 이상 작성...", "impact": "..." },
                    "modernSolution": { "title": "...", "advice": "...", "talisman": "..." }
                },
               "ch6": {
                    "hasNobleman": ${sajuContext.cheoneul?.has || false},
                    "noblemanList": ["..."],
                    "noblemanDescription": { "title": "...", "description": "최소 500자 이상 작성..." },
                    "timing": "...",
                    "advice": "..."
                }
            }
            `;

            // --- BATCH 2: WEALTH & CAREER ---
            // Covers Chapters: 7(Wealth), 9(Career), 10(Health), 11(Daewoon), 12(Yearly)
        } else if (batchId === 'BATCH_2_WEALTH' || chapterId === 'BATCH_2_WEALTH') {
            console.log("Processing BATCH 2: WEALTH");
            // Filter Daewoon list to max age 80 explicitly for the prompt context
            const limitedDaewoon = sajuContext.daewoon?.filter((d: any) => d.age <= 80) || [];
            const daewoonContextString = JSON.stringify(limitedDaewoon);

            specificPrompt = `
            너의 임무는 사주 데이터를 바탕으로 **Chapter 7, 9, 10, 11, 12** 내용을 한 번에 생성하는 것이다.
            **변동사항: 대운(Ch11)은 80세까지만 분석한다.**
            **모든 항목은 500자 이상 아주 자세하게 묘사해라.**

            1. **Ch7(재물)**: 재성 강약으로 타고난 돈그릇 크기 판별. (돈이 언제 들어오고 나가는지, 어떤 투자가 맞는지 구체적 썰 풀기). **중요: 'monthlyCalendar' 필드에 2026년 1월부터 12월까지의 월별 재물운 점수(0~100)와 핵심 키워드를 반드시 포함해라.**
            2. **Ch9(적성)**: 오행/십성 구조에 따른 직업 적성. (구체적인 직업 예시와 그 일을 했을 때의 모습 상상하여 묘사)
            3. **Ch10(건강)**: 제일 약하거나 과한 오행에 따른 취약 장기 경고. (겁주는게 아니라, 미리 관리하도록 잔소리 폭격)
            4. **Ch11(대운)**: 10년 단위 대운 흐름. (**경고: 절대 짧게 쓰지 마라. 각 대운마다 최소 500자 이상, 대하소설처럼 아주 서사적으로 묘사해라.** ${daewoonContextString}에 있는 모든 시기를 다뤄라.)
            5. **Ch12(년운)**: 향후 5년(${new Date().getFullYear()}~) 운세. (**중요: 유료 고객이다. 점수를 아주 후하게 줘라. 기본 70점 이상.**)
               - **advice**: 각 연도별 조언을 **최소 3문장 이상, 구체적인 상황 예시를 들어 아주 길게 작성하라.** (단순한 덕담 금지. 소설처럼 일어날 법한 일을 생생하게 묘사해라. 분량 챙겨라.)
            `;

            schemaPrompt = `
            응답 형식 (JSON):
            {
               "ch7": {
                   "wealthBowl": { "size": "huge", "title": "...", "description": "최소 500자 이상 작성..." },
                   "timing": { "callToAction": "...", "description": "..." },
                   "strategies": { "investment": "...", "habit": "..." },
                   "monthlyCalendar": [
                        { "month": 1, "score": 85, "keyword": "횡재수" },
                        { "month": 2, "score": 40, "keyword": "지출주의" }
                   ]
               },
               "ch9": {
                   "career": { "type": "employee", "title": "...", "description": "최소 500자 이상 작성..." },
                   "strengths": ["..."], "weaknesses": ["..."], "recommendedJobs": ["..."],
                   "workStyle": "...", "verdict": "..."
               },
               "ch10": {
                   "weakestOrgan": "...", "vulnerability": "최소 300자 이상 작성...", "advice": "...", "mentalHealth": "..."
               },
               "ch11": {
                   "graph": [{ "age": 10, "score": 0, "keyword": "..." }, ...],
                   "daewoonDetails": [{ 
                       "ganji": "...", "startAge": 0, "endAge": 0, "meaning": "...", 
                       "advice": "여기에 최대한 길게 작성해라. (예시: 이 10년은 네 인생에서 가장 중요한 시기다. 마치 거친 파도를 만난 배처럼 흔들릴 수 있지만, 동시에 그 파도를 타고 더 멀리 나아갈 기회이기도 하다. 구체적으로 직장에서는 승진운이 따르겠지만... 최소 500자 이상)" 
                   }],
                   "overallCurve": "..."
               },
               "ch12": {
                   "fiveYearFlow": [{ "year": 0, "score": 85, "keyword": "...", "advice": "..." }], // Score Example: 70~100
                   "samsae": { "isSamsae": ${sajuContext.samsae5Year?.isSamsae || false}, "yearType": "...", "description": "..." },
                   "accidentCaution": "..."
               }
            }
            `;

            // --- BATCH 3: FUTURE & LOVE ---
            // Covers Chapters: 8(Spouse), 13(Q&A), 14(Epilogue)
        } else if (batchId === 'BATCH_3_FUTURE' || chapterId === 'BATCH_3_FUTURE') {
            const userQuestion = sajuContext.question || "특별한 고민은 없지만 전체적인 조언 부탁해.";
            console.log("Processing BATCH 3: FUTURE. Question:", userQuestion);

            specificPrompt = `
            너의 임무는 **Chapter 8, 13, 14**의 내용을 한 번에 생성하는 것이다.
            **마지막인 만큼 여운이 남도록 아주 길고(각 500자 이상) 감동적으로 작성해라.**
            
            1. **Ch8(배우자)**: 일지/재관을 보고 미래 배우자 물형(동물상) 예측.
               - 남자면: cat_f, dog_f, fox_f, deer_f, rabbit_f 중 택1
               - 여자면: dog_m, fox_m, dino_m, bear_m, rabbit_m, tiger_m 중 택1
               - **appearance**: 2~4글자 핵심 형용사 (예: "다정한", "섹시한") 필수.
               - **상세 묘사**: 배우자를 만나는 상황, 첫인상, 연애 스타일 등을 단편 소설처럼 길게 묘사할 것 (500자 이상).
                 - **imagePrompt (English Only)**: Gemini Image Generation을 위한 **영문 프롬프트**.
                 - **CRITICAL: "Hyper-realistic 8K Photo" Style.**
                 - Format: "A candid raw photograph of a [Korean man/woman] in real life, [age exactly 24 years old], [features]. Shot on Fujifilm GFX 100, 85mm lens. Soft natural skin texture, youthful radiance, natural lighting, street photography style, high quality."
                 - **DO NOT USE terms like 'rough skin', 'pores', 'imperfections', 'wrinkles'.**
                 - **CRITICAL: The person MUST look like a real human being (Instagram Influencer vibe).**
                 - 사주에 나온 특징(예: 날카로운 눈매, 부드러운 인상 등)을 반영할 것.

            2. **Ch13(Q&A)**: 사용자 질문("${userQuestion}")에 대해 할머니가 직접 답변.
               - **최소 500자 이상**, 팩트폭격 후 따뜻한 위로. 절대 짧게 끝내지 마라.
            
            3. **Ch14(마지막)**: 전체 요약 및 행운의 아이템 추천, 마지막 손편지.
               - **손편지**: 사용자가 눈물 흘릴 정도로 진심을 담아 길게 작성하라. (500자 이상)
            `;

            schemaPrompt = `
            응답 형식 (JSON):
            {
               "ch8": {
                   "spouse": { 
                       "type": "...", 
                       "desc": "최소 500자 이상 작성...", 
                       "appearance": "...",
                       "imagePrompt": "A hyper-realistic 8K photograph of..." 
                   },
                   "timing": { "when": "...", "where": "..." },
                   "matchScore": 0
               },
               "ch13": {
                   "answer": "최소 500자 이상 작성...", "advice": "...", "stone": "..." // stone은 UI에서 안쓰더라도 스키마 유지
               },
               "ch14": {
                   "coreMessage": "...", // 한 문장 핵심 메시지 (예: '고생 끝에 낙이 온다')
                   "closingRemark": "...",
                   "luckyCharms": { 
                       "color": "...", 
                       "number": 7, 
                       "direction": "...", 
                       "item": "..." 
                   }
               }
            }
            `;
            // --- LEGACY/FALLBACK --- 
        } else {
            // If no batch/chapter matched, return error to avoid empty generation
            return NextResponse.json({ error: "Invalid Batch/Chapter ID" }, { status: 400 });
        }

        // SMART MODEL SELECTION
        // User requests Gemini 3.0 Flash Preview. We try it first, but fallback to 2.0 if unavailable.
        // Valid ID: 'gemini-3-flash-preview'
        const primaryModelName = "gemini-3-flash-preview";
        const fallbackModelName = "gemini-2.0-flash";

        const generateWithModel = async (modelName: string) => {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            return await model.generateContent([
                basePersona,
                specificPrompt,
                schemaPrompt,
                "자, 이제 분석 시작해라. JSON 포맷 절대 틀리지 마라!"
            ]);
        };

        let result;
        try {
            console.log(`Attempting generation with ${primaryModelName}...`);
            result = await generateWithModel(primaryModelName);
        } catch (error: any) {
            console.warn(`${primaryModelName} failed (${error.message}). Falling back to ${fallbackModelName}.`);
            // Fallback
            result = await generateWithModel(fallbackModelName);
        }

        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);

        // [COST TRACKING] Inject Token Usage Data
        // Gemini API returns usageMetadata in result.response.usageMetadata
        const usage = result.response.usageMetadata;
        if (usage) {
            parsedData._meta = {
                inputTokens: usage.promptTokenCount,
                outputTokens: usage.candidatesTokenCount,
                totalTokens: usage.totalTokenCount,
                model: primaryModelName // or fallback if triggered (tracking exact model used needs better filtering but good enough)
            };
            console.log("💰 Token Usage:", usage);
        }

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

