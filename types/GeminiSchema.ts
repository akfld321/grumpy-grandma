/**
 * GEMINI JSON SCHEMAS
 * These interfaces correspond to the strict JSON output we expect from the AI.
 */

// Chapter 2: Identity & Past Life
export interface Chapter2AIResponse {
    pastLife: {
        theme: string;           // e.g. "조선시대 과거 시험만 10번 떨어진 선비"
        karmaAnalysis: string;   // e.g. "네 놈이 이번 생에도..."
        reincarnationReason: string; // e.g. "이번 생에는..."
    };
    dayMasterAnalysis: {
        coreNature: {
            title: string;
            description: string;
        };
        lifestyle: {
            title: string;
            description: string;
        };
        innerHeart: {
            title: string;
            description: string;
        };
    };
    elementalBalance: {
        myShape: string; // e.g. "불타오르는 마른 장작더미"
        lacks: {
            element: string; // e.g. "수(Water)"
            consequence: string;
            advice?: string;
        };
        excess: {
            element: string; // e.g. "화(Fire)"
            consequence: string;
            advice?: string;
        };
        advice: string; // Actionable advice
    };
}

// Chapter 3: Society & Ten Gods (Social Persona)
export interface Chapter3AIResponse {
    socialMask: {
        title: string;          // e.g. "빈틈없는 관리자"
        description: string;    // How others see me
        score: number;          // 0-100 social capability
    };
    realSelf: {
        title: string;          // e.g. "자유로운 영혼"
        description: string;    // My deep internal desire
    };
    career: {
        recommendation: string; // Job recommendation
        jobStyle: string;       // Working style
        scolding: string;       // "Admonishment" about work attitude
    };
    tenGodsAnalysis: {
        dominant: string;       // Strongest ten god (e.g. "Pyeon-gwan")
        explanation: string;
    };
}

// Chapter 4: Energy Flow (12 Stages of Life)
export interface Chapter4AIResponse {
    graphInterpretation: string; // Overall analysis of the energy flow
    currentStage: {
        stage: string;          // e.g. "장생(Birth)"
        description: string;    // Meaning of this stage
        advice: string;         // What to do in this stage
    };
    onePointLesson: string;     // Short maxim (e.g. "지금은 웅크릴 때다.")
    // NEW: Detailed Life Graph Data from AI
    lifeGraph?: {
        age: string; // "10대", "20대" etc
        score: number; // 0-100
        keyword: string; // e.g. "급상승", "정체기"
    }[];
}

// Chapter 5: Salpuri (Shinsal)
export interface Chapter5AIResponse {
    shinsalList: {
        name: string;           // e.g. "도화살"
        description: string;    // e.g. "사람을 홀리는 매력"
        isPositive: boolean;    // true/false
    }[];
    mainShinsalAnalysis: {
        title: string;          // e.g. "너는 걸어다니는 *복숭아 꽃*이다."
        description: string;    // Deep analysis
        impact: string;         // How it affects life
    };
    modernSolution: {
        title: string;          // e.g. "이 살을 풀려면..."
        advice: string;         // Concrete advice
        talisman: string;       // Name of the talisman for UI (e.g., "popular_charm")
    };
}

// Chapter 6: Gui-in (Nobleman)
export interface Chapter6AIResponse {
    hasNobleman: boolean;       // Did we find Cheoneul Guiin?
    noblemanList: string[];     // List of found noblemen characters (e.g. ["축(丑)", "미(未)"])
    noblemanDescription: {
        title: string;          // e.g. "너의 귀인은 '엄격한 스승' 같은 존재다" or "니 귀인은 니 자신이다!"
        description: string;    // Detailed persona of the nobleman
    };
    timing: string;             // When do they appear? (or when is your golden era)
    advice: string;             // Action item to attract people or succeed alone
}

// Chapter 7: Wealth Luck (Money)
export interface Chapter7AIResponse {
    wealthBowl: {
        size: 'huge' | 'big' | 'medium' | 'small' | 'cracked'; // Size of the vessel
        title: string;          // e.g. "흘러넘치는 황금 독", "밑 빠진 독"
        description: string;    // Interpretative text
    };
    timing: {
        callToAction: string;   // e.g. "40대부터 돈이 붙는다"
        description: string;    // Detailed timing analysis
    };
    strategies: {
        investment: string;     // e.g. "부동산에 묻어라", "주식 단타는 패가망신"
        habit: string;          // e.g. "지갑을 비싼 걸 써라"
    };
    // NEW CONTENT: 2026 Monthly Wealth Calendar
    monthlyCalendar?: {
        month: number;
        score: number; // 0-100
        keyword: string; // e.g. "횡재수", "지출주의"
    }[];
}

// Chapter 8: Love & Marriage (Spouse)
export interface Chapter8AIResponse {
    spouse: {
        // Animal Physiognomy Types
        type: 'dog_m' | 'fox_m' | 'dino_m' | 'bear_m' | 'rabbit_m' | 'tiger_m' |
        'cat_f' | 'dog_f' | 'fox_f' | 'deer_f' | 'rabbit_f';
        desc: string;           // Detailed personality/vibe description
        appearance: string;     // Visual feature keywords (e.g. "쌍꺼풀 없는 큰 눈")
        imagePrompt?: string;   // Image generation prompt for internal use
        imageUrl?: string;      // PERSISTENCE: Generated image URL (Base64/Cloud) -> Saved to DB
    };
    timing: {
        when: string;           // e.g. "32세 즈음"
        where: string;          // e.g. "동호회나 스터디 모임"
    };
    matchScore: number;         // 0-100 compatibility
}

// Union type for the API response
// Chapter 9: Career & Aptitude
export interface Chapter9AIResponse {
    career: {
        type: 'business' | 'freelancer' | 'employee' | 'expert' | 'artist';
        title: string;
        description: string;
    };
    strengths: string[];
    weaknesses: string[];
    recommendedJobs: string[];
    workStyle: string;
    // Grandma's harsh verdict
    verdict: string;
}

// Chapter 10: Health & Body
export interface Chapter10AIResponse {
    weakestOrgan: string;
    vulnerability: string;
    advice: string;
    mentalHealth: string;
}

// Chapter 11: 10-Year Luck Cycles (Daewoon)
export interface Chapter11AIResponse {
    // Graph Data Points
    graph: {
        age: number;
        score: number; // 0-100
        keyword: string; // e.g. "전성기", "준비기"
    }[];
    // Detailed analysis for each cycle
    daewoonDetails: {
        ganji: string;      // e.g. "갑자(甲子)"
        startAge: number;   // e.g. 24
        endAge: number;     // e.g. 33
        meaning: string;    // Theme of this era
        advice: string;     // Actionable advice
    }[];
    overallCurve: string;   // e.g. "대기만성형"
}

// (Duplicate removed)

// Chapter 12: Future 5 Years & Samsae
export interface Chapter12AIResponse {
    fiveYearFlow: {
        year: number;
        score: number; // 0-100
        keyword: string;
        warning?: string;
        advice: string;
    }[];
    samsae: {
        isSamsae: boolean;
        yearType?: 'entering' | 'staying' | 'leaving'; // 들삼재, 눌삼재, 날삼재
        description: string;
    };
    accidentCaution: string; // General caution for accidents/health
}

// Chapter 13: Grandma's Direct Answer (Q&A)
export interface Chapter13AIResponse {
    answer: string;
    advice: string;
    stone: string;
}

// Chapter 14: Final Advice & Lucky Charms
// Chapter 14: Final Advice & Lucky Charms
export interface Chapter14AIResponse {
    coreMessage: string;
    closingRemark: string;
    luckyCharms: {
        color: string;
        number: number;
        direction: string;
        item: string;
    };
}

// BATCH RESPONSES for Optimization
export interface Batch1CoreResponse {
    ch2: Chapter2AIResponse;
    ch3: Chapter3AIResponse;
    ch4: Chapter4AIResponse;
    ch5: Chapter5AIResponse;
    ch6: Chapter6AIResponse;
}

export interface Batch2WealthResponse {
    ch7: Chapter7AIResponse;
    ch9: Chapter9AIResponse;
    ch10: Chapter10AIResponse;
    ch11: Chapter11AIResponse;
    ch12: Chapter12AIResponse;
}

export interface Batch3FutureResponse {
    ch8: Chapter8AIResponse;
    ch13: Chapter13AIResponse;
    ch14: Chapter14AIResponse;
}

// Union type for the API response
export type SajuAIResponse =
    | Chapter2AIResponse
    | Chapter3AIResponse
    | Chapter4AIResponse
    | Chapter5AIResponse
    | Chapter6AIResponse
    | Chapter7AIResponse
    | Chapter8AIResponse
    | Chapter9AIResponse
    | Chapter10AIResponse
    | Chapter11AIResponse
    | Chapter12AIResponse
    | Chapter13AIResponse
    | Chapter14AIResponse
    | Batch1CoreResponse
    | Batch2WealthResponse
    | Batch3FutureResponse;


