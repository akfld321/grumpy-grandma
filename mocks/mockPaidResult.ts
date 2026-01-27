import { PaidSajuResult } from '@/types/PaidResultTypes';

export const MOCK_PAID_RESULT: PaidSajuResult = {
    userName: "김철수",
    gender: 'male',
    birthDate: "1990년 5월 15일",
    birthTime: "13시 30분",
    sajuKey: {
        year: "경오",
        month: "신사",
        day: "갑자",
        time: "병인"
    },
    fiveElements: {
        wood: 1,
        fire: 2,
        earth: 0,
        metal: 2,
        water: 1
    },

    pillars: {
        year: {
            gan: { char: "庚", sound: "경", trait: "편관", color: "metal" },
            ji: { char: "午", sound: "오", animal: "말", color: "fire" },
            tenGod: "편관",
            relation: "조상"
        },
        month: {
            gan: { char: "辛", sound: "신", trait: "정관", color: "metal" },
            ji: { char: "巳", sound: "사", animal: "뱀", color: "fire" },
            tenGod: "정관",
            relation: "부모"
        },
        day: {
            gan: { char: "甲", sound: "갑", trait: "본인", color: "wood" },
            ji: { char: "子", sound: "자", animal: "쥐", color: "water" },
            tenGod: "비견",
            relation: "나"
        },
        time: {
            gan: { char: "丙", sound: "병", trait: "식신", color: "fire" },
            ji: { char: "寅", sound: "인", animal: "범", color: "wood" },
            tenGod: "식신",
            relation: "자식"
        }
    },
    daewoon: [
        { age: 4, ganji: "무진", stem: "무", branch: "진" },
        { age: 14, ganji: "기사", stem: "기", branch: "사" },
        { age: 24, ganji: "경오", stem: "경", branch: "오" },
        { age: 34, ganji: "신미", stem: "신", branch: "미" },
        { age: 44, ganji: "임신", stem: "임", branch: "신" },
        { age: 54, ganji: "계유", stem: "계", branch: "유" }
    ],
    samsae5Year: [
        { year: 2024, isSamsae: true, type: "entering" },
        { year: 2025, isSamsae: true, type: "staying" },
        { year: 2026, isSamsae: true, type: "leaving" },
        { year: 2027, isSamsae: false, type: null },
        { year: 2028, isSamsae: false, type: null }
    ],
    chapters: [
        {
            chapterId: 0,
            chapterTitle: "프롤로그",
            chapterSub: "욕쟁이 할머니의 등장",
            content: "그래, 김철수라고 했냐?\n먼 길 오느라 고생했다.\n\n내 이 나이 먹도록 수많은 놈들을 봐왔지만,\n너 같이 생긴 놈은 또 처음이네.\n\n어디 한번 니 놈 사주팔자 좀 까보자.\n준비 단단히 해라. 뼈 때릴 거니까.",
            data: { type: 'text', value: null }
        },
        {
            chapterId: 1,
            chapterTitle: "너의 바코드",
            chapterSub: "사주명식 도표",
            desc: "태어날 때 찍힌 너의 인생 바코드다.",
            data: { type: 'sajuTable', value: null }
        },
        {
            chapterId: 2,
            chapterTitle: "전생의 정체",
            chapterSub: "너는 전생에 뭐였을까?",
            desc: "너는 한마디로 '겨울 밭을 가는 소'야. \n남들은 추워서 다 들어가 있는데, 너 혼자 묵묵히 밭을 갈고 있구나.",
            data: {
                type: 'pastLife',
                value: {
                    identity: {
                        name: "대지주 마님",
                        img: "/grandma_smoking_v2.png",
                        desc: "곳간에 곡식이 마를 날이 없던..."
                    },
                    description: "겉으로는 순해 보여도 속엔 고집이 아주 쇳덩어리 만해. \n한번 마음먹으면 누가 뭐래도 끝까지 밀고 나가는 뚝심은 인정한다."
                }
            }
        },
        {
            chapterId: 3,
            chapterTitle: "사회적 가면",
            chapterSub: "너의 사회생활 처세술",
            desc: "남들 앞에서 쓰고 있는 가면을 벗겨보자.",
            data: { type: 'text', value: null }
        },
        {
            chapterId: 4,
            chapterTitle: "인생 에너지",
            chapterSub: "12운성으로 보는 파도",
            desc: "인생은 파도다.",
            data: { type: 'text', value: null }
        },
        {
            chapterId: 5,
            chapterTitle: "살풀이",
            chapterSub: "내 안의 도화살, 역마살",
            desc: "너에게 숨겨진 필살기를 찾아라.",
            data: { type: 'text', value: null }
        },
        {
            chapterId: 6,
            chapterTitle: "Chapter 6: 귀인 (인복)",
            chapterSub: "숨은 귀인 찾기",
            desc: "너를 도와줄 귀인을 찾아보자.",
            data: { type: 'text', value: null }
        },
        {
            chapterId: 7,
            chapterTitle: "Chapter 7: 돈 그릇 (재물운)",
            chapterSub: "니 돈그릇은 얼마나 될꼬?",
            desc: "재물운 분석",
            data: { type: 'text', value: null },
            aiResponse: {
                wealthBowl: {
                    size: "big",
                    title: "마르지 않는 샘물",
                    description: "니 돈그릇은 꽤 크다. 퍼내도 계속 채워지는 샘물 같아서 먹고 사는 걱정은 없겠다."
                },
                timing: {
                    callToAction: "40대부터 진짜 돈이 모인다",
                    description: "초년에는 다 수업료라고 생각해라. 40대부터는 담는 족족 니 거다."
                },
                strategies: {
                    investment: "부동산이 답이다. 땅에 묻어둬라.",
                    habit: "지갑은 비싼 거 써라. 돈이 집을 알아본다."
                }
            }
        },
        {
            chapterId: 8,
            chapterTitle: "Chapter 8: 미래의 짝꿍 (연애운)",
            chapterSub: "니 평생 짝꿍은 누굴까?",
            desc: "관상으로 보는 미래 배우자",
            data: { type: 'spouseFace', value: null },
            aiResponse: {
                spouse: {
                    type: "dino_m",
                    desc: "겉으로는 무뚝뚝해 보여도 내 여자한테는 한없이 다정한 스타일. 책임감이 강해서 너를 굶길 일은 절대 없다.",
                    appearance: "선이 굵고 남성적인 공룡상"
                },
                timing: {
                    when: "3년 안에 만난다. 겨울 즈음.",
                    where: "일하다가 자연스럽게 만난다."
                },
                matchScore: 92
            }
        },
        {
            chapterId: 9,
            chapterTitle: "Chapter 9: 천직 (적성)",
            chapterSub: "내 밥벌이는 뭘로 해야 할까?",
            desc: "직업 적성 및 천직 분석",
            data: { type: 'text', value: null },
            aiResponse: {
                career: {
                    type: "business",
                    title: "맨땅에 헤딩하는 불도저",
                    description: "남 밑에서 월급 받고는 홧병 나서 못 사는 팔자다. 네 마음대로 판을 벌려야 직성이 풀린다."
                },
                strengths: ["추진력 하나는 끝내준다", "사람을 끌어당기는 리더십", "돈 냄새를 잘 맡는다"],
                weaknesses: ["귀가 얇아서 사기 당하기 쉽다", "마무리가 약하다"],
                recommendedJobs: ["유통업", "요식업 프랜차이즈", "영업직"],
                workStyle: "혼자 결정하고 책임지는 게 제일 편하다.",
                verdict: "월급쟁이 하면 3년 안에 때려치운다. 그냥 장사해라."
            }
        },
        {
            chapterId: 10,
            chapterTitle: "Chapter 10: 신체 사용설명서 (건강)",
            chapterSub: "삐그덕대는 니 몸뚱아리",
            desc: "오행 결핍/과다에 따른 건강 분석",
            data: { type: 'text', value: null },
            aiResponse: {
                weakestOrgan: "위장(배)",
                vulnerability: "신경성 위염, 소화불량",
                advice: "차가운 물 마시지 마라. 배를 따뜻하게 해야 산다. 밀가루 끊어라.",
                mentalHealth: "남 눈치 보느라 속이 타들어간다. 좀 뻔뻔해져라."
            }
        },
        {
            chapterId: 11,
            chapterTitle: "Chapter 11: 10년 대운 (인생의 계절)",
            chapterSub: "인생의 사계절",
            desc: "10년 주기 대운 흐름 분석",
            data: { type: 'text', value: null },
            aiResponse: {
                graph: [
                    { age: 4, score: 40, keyword: "유년기" },
                    { age: 14, score: 50, keyword: "학업운" },
                    { age: 24, score: 70, keyword: "사회진출" },
                    { age: 34, score: 90, keyword: "전성기" },
                    { age: 44, score: 85, keyword: "안정기" },
                    { age: 54, score: 60, keyword: "은퇴준비" }
                ],
                daewoonDetails: [
                    {
                        ganji: "갑오(甲午)",
                        startAge: 24,
                        endAge: 33,
                        meaning: "뜨거운 태양 아래 나무가 자란다. 열정이 넘치고 성과가 드러나는 시기.",
                        advice: "너무 앞만 보고 달리지 마라. 탈진한다."
                    },
                    {
                        ganji: "을미(乙未)",
                        startAge: 34,
                        endAge: 43,
                        meaning: "노력의 결실을 맺는 황금기. 재물이 모이고 사람이 따른다.",
                        advice: "이때 모은 돈이 평생 간다. 저축해라."
                    },
                    {
                        ganji: "병신(丙申)",
                        startAge: 44,
                        endAge: 53,
                        meaning: "해가 서쪽으로 기운다. 화려함은 덜하지만 실속은 있다.",
                        advice: "새로운 도전보다는 지키는 것에 힘써라."
                    }
                ],
                overallCurve: "30대 중반에 정점을 찍는 '청년 성공형' 그래프다."
            }
        },
        {
            chapterId: 12,
            chapterTitle: "Chapter 12: 향후 5년 & 삼재",
            chapterSub: "그래서 언제 풀리는데?",
            desc: "앞으로 5년의 좋고 나쁨을 알려주마.",
            data: { type: 'calendar', value: null }
        },
        {
            chapterId: 13,
            chapterTitle: "Chapter 13: 할머니의 직설",
            chapterSub: "뼈 때리는 현실 조언",
            desc: "Q&A 및 최종 조언",
            data: { type: 'counseling', value: null }
        },
        {
            chapterId: 14,
            chapterTitle: "Chapter 14: 마지막 당부",
            chapterSub: " Epilogue",
            desc: "부적과 개운템",
            data: { type: 'text', value: null }
        }
    ]
};
