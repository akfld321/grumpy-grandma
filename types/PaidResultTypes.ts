export interface ChapterContent {
    chapterId: number;
    chapterTitle: string;
    chapterSub?: string;
    heroImagePrompt?: string; // Prompt for generating the image (or pre-defined ID)
    desc?: string; // Short description
    content?: string; // Main text content (HTML/Markdown support)
    summary?: string; // One-line summary

    // Visualization Data (Union Type)
    data: {
        type: 'sajuTable' | 'pastLife' | 'graph' | 'list' | 'calendar' | 'spouseFace' | 'counseling' | 'text';
        value: any;
        monthlyCalendar?: { month: number; score: number; keyword: string }[]; // New Feature
    };
    aiResponse?: any; // Structured JSON from Gemini
}

export interface PaidSajuResult {
    userName: string;
    gender: 'male' | 'female';
    birthDate: string; // Display Format
    birthTime: string; // Display Format

    // Raw Saju Data (Normalized)
    sajuKey: {
        year: string; month: string; day: string; time: string;
    };

    // Detailed Pillars (Calculated)
    pillars: {
        year: PillarDetails;
        month: PillarDetails;
        day: PillarDetails;
        time: PillarDetails;
    };

    // Five Elements
    fiveElements: {
        wood: number; fire: number; earth: number; metal: number; water: number;
    };

    // 14 Chapters
    chapters: ChapterContent[];

    // Extra Metadata
    mbti?: string;
    question?: string; // User's specific concern

    // NEW: Detailed Calculation Data for AI
    daewoon?: { age: number; ganji: string; stem: string; branch: string }[];
    samsae5Year?: { year: number; isSamsae: boolean; type: string | null }[];

    // Payment Status
    isPaidResult?: boolean;

    // Admin Stats
    usage?: { batchId: string; inputTokens: number; outputTokens: number; totalTokens: number; model: string; timestamp: string }[];
}

export interface PillarDetails {
    gan: { char: string; sound: string; trait: string; color: string; }; // Cheongan
    ji: { char: string; sound: string; animal: string; color: string; unseong?: string; }; // Jiji
    tenGod: string; // e.g. "Pyeon-gwan"
    relation: string; // e.g. "Me", "Father", "Spouse"
}
