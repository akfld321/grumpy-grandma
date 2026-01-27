
import { SajuResult } from "../saju";
import { PaidSajuResult, ChapterContent, PillarDetails } from "@/types/PaidResultTypes";
import { ELEMENT_COLORS } from "../saju";

// --- Past Life Logic (Previously in Component) ---
const PAST_LIFE_RULES = {
    wood: {
        E: { name: '풍류를 즐기던 한량 선비', img: '/past_life_scholar.png', desc: '시와 음악, 그리고 술을 사랑했던...' },
        I: { name: '초야에 묻힌 천재 화가', img: '/past_life_artist.png', desc: '붓 하나로 세상을 담아내려 했던...' }
    },
    fire: {
        E: { name: '난세를 평정한 대장군', img: '/past_life_general.png', desc: '붉은 갑옷을 입고 적진을 누비던...' },
        I: { name: '비운의 혁명가', img: '/past_life_revolutionary.png', desc: '세상을 바꾸려다 홀로 지고 간...' }
    },
    earth: {
        E: { name: '천하를 호령한 거상', img: '/past_life_merchant.png', desc: '황금으로 성을 쌓을 뻔했던...' },
        I: { name: '대지주 마님/대감', img: '/past_life_landlord.png', desc: '곳간에 곡식이 마를 날이 없던...' }
    },
    metal: {
        E: { name: '절대 권력의 황제', img: '/pl_emperor.png', desc: '모든 이를 발아래 두었던...' },
        I: { name: '냉철한 호위무사', img: '/past_life_guard.png', desc: '그림자처럼 주군을 지키던...' }
    },
    water: {
        E: { name: '전설의 기생', img: '/past_life_gisaeng.png', desc: '한 곡조로 심금을 울리던...' },
        I: { name: '신통한 도사', img: '/past_life_shaman.png', desc: '앉아서 천리를 꿰뚫어 보던...' }
    }
};

export function convertSajuToPaidResult(
    raw: SajuResult,
    userInfo: { name: string; gender: 'male' | 'female'; birthDate: string; birthTime: string; question?: string }
): PaidSajuResult {

    // 1. Transform Pillars
    if (!raw.pillars) {
        throw new Error("Raw Saju calculations missing pillars data");
    }

    const transformPillar = (p: any, relation: string): PillarDetails => {
        // Defensive: If pillar or its components are missing, return "Unknown"
        // This prevents the entire app from crashing if one value is off.
        const gan = (p && (p.gan || p.stem)) || { char: '?', sound: '?', trait: '?', color: 'gray' };
        const ji = (p && (p.ji || p.branch)) || { char: '?', sound: '?', animal: 'Unknown', color: 'gray', unseong: '' };

        return {
            gan: {
                char: gan.char || '?',
                sound: gan.sound || '?',
                trait: gan.trait || gan.tenGod || '?',
                color: gan.color || gan.element || 'gray'
            },
            ji: {
                char: ji.char || '?',
                sound: ji.sound || '?',
                animal: ji.animal || "동물",
                color: ji.color || ji.element || 'gray',
                unseong: ji.unseong || ''
            },
            tenGod: gan.trait || gan.tenGod || p?.tenGod || '?',
            relation: relation
        };
    };

    const pillars = {
        year: transformPillar(raw.pillars.year, "Year (Root)"),
        month: transformPillar(raw.pillars.month, "Month (Society)"),
        day: transformPillar(raw.pillars.day, "Day (Self)"),
        time: transformPillar(raw.pillars.time, "Time (Future)"),
    };

    // 2. Calculate Past Life Identity
    const el = raw.fiveElements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    let maxEl = 'wood';
    let maxVal = -1;
    (Object.keys(el) as Array<keyof typeof el>).forEach(key => {
        if (el[key] > maxVal) {
            maxVal = el[key];
            maxEl = key;
        }
    });

    const mbtiRaw = raw.mbti ? raw.mbti.toUpperCase() : 'E';
    const trait = mbtiRaw.startsWith('I') ? 'I' : 'E';

    // @ts-ignore
    const pastLifeIdentity = PAST_LIFE_RULES[maxEl]?.[trait] || PAST_LIFE_RULES.fire.E;


    // 3. Generate Chapter Content
    const chapters: ChapterContent[] = [
        // Chapter 0: Prologue
        {
            chapterId: 0,
            chapterTitle: "프롤로그",
            chapterSub: "욕쟁이 할머니의 등장",
            content: `아이고, 또 이상한 놈 하나 왔구나. ${userInfo.name}? 이름은 멀쩡하네.\n어디 사주 한번 까보자.`,
            data: { type: 'text', value: null }
        },
        // Chapter 1: Saju Barcode
        {
            chapterId: 1,
            chapterTitle: "너의 바코드",
            chapterSub: "사주명식 도표",
            desc: "태어날 때 찍힌 너의 인생 바코드다.",
            data: {
                type: 'sajuTable',
                value: pillars
            }
        },
        // Chapter 2: Past Life Identity
        {
            chapterId: 2,
            chapterTitle: "전생의 정체",
            chapterSub: "너는 전생에 뭐였을까?",
            desc: "니 놈의 성격이 왜 이 모양인지 알려주마.",
            data: {
                type: 'pastLife',
                value: {
                    identity: pastLifeIdentity,
                    element: maxEl,
                    trait: trait,
                    description: `너는 전생에 [${pastLifeIdentity.name}]였다.\n${pastLifeIdentity.desc}`
                }
            }
        },
        // Chapters 3-12 (Standard)
        ...Array.from({ length: 10 }, (_, i) => ({
            chapterId: i + 3,
            chapterTitle: `Chapter ${i + 3}`,
            chapterSub: "준비 중",
            desc: "할머니가 돋보기 쓰고 분석 중이다. 기다려라.",
            data: { type: 'text', value: "Coming Soon" } as any
        }))
    ];

    // Chapter 13: Q&A (Always Present)
    chapters.push({
        chapterId: 13,
        chapterTitle: "할머니의 직설",
        chapterSub: "무엇이든 물어보살",
        desc: "니가 물어본 거? 그래, 까짓것 대답해주마.",
        data: { type: 'text', value: (userInfo.question && userInfo.question.trim().length > 0) ? userInfo.question : "질문이 없으면 대답도 없는 법이다. (질문 미입력)" }
    });

    // Chapter 14: Final Advice (Always present)
    chapters.push({
        chapterId: 14,
        chapterTitle: "마지막 당부",
        chapterSub: "Epilogue",
        desc: "가는 길에 이것만은 꼭 챙겨가라.",
        data: { type: 'text', value: "Farewell" }
    });

    return {
        userName: userInfo.name,
        gender: userInfo.gender,
        birthDate: userInfo.birthDate,
        birthTime: userInfo.birthTime,
        sajuKey: {
            year: raw.year,
            month: raw.month,
            day: raw.day,
            time: raw.hour
        },
        pillars: pillars,
        fiveElements: raw.fiveElements,
        chapters: chapters,
        daewoon: raw.daewoon,
        samsae5Year: raw.samsae5Year,
        question: userInfo.question,
        isPaidResult: false // Default to free/locked
    };
}
