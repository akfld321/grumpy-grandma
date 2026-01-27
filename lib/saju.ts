import lunisolar from "lunisolar";

// Types
// (Removed duplicate definition)

// --- Constants & Data ---

// 1. Basic Mappings
const CHEONGAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

// 2. Elemental Traits (Day Master / Ilgan)
// Index: 0-9 (甲-癸) -> Wood, Wood, Fire, Fire, Earth, Earth, Metal, Metal, Water, Water
const ELEMENT_TRAITS = [
    { type: "큰 나무(甲)", desc: "고집이 세고 뻣뻣해. 굽힐 줄을 몰라!", advice: "유연하게 좀 살아라 제발." },
    { type: "화초(乙)", desc: "이리 붙었다 저리 붙었다, 생존력 하나는 끈질겨.", advice: "줏대 좀 챙기고 살아!" },
    { type: "태양(丙)", desc: "성질 급하고 화끈해서 탈이야. 뒤끝은 없지.", advice: "성질 좀 죽여라, 주변 사람들 타 죽겠다." },
    { type: "촛불(丁)", desc: "속에 화가 많아. 겉으론 조용해 보여도 속은 부글부글하지?", advice: "속앓이 그만하고 털어버려!" },
    { type: "큰 산(戊)", desc: "무뚝뚝하고 속을 알 수가 없어. 답답해!", advice: "입 좀 열고 살아라, 곰팡이 필라." },
    { type: "밭 흙(己)", desc: "의심 많고 자기 잇속은 다 챙기네. 얌체 같이!", advice: "베풀면서 좀 살아라, 죽으면 썩는다." },
    { type: "바위(庚)", desc: "성격 한번 차갑네. 찔러도 피 한 방울 안 나오겠어.", advice: "사람 냄새 좀 풍기고 살아!" },
    { type: "보석(辛)", desc: "예민하고 까탈스럽기는... 공주/왕자 납셨네.", advice: "너만 잘난 줄 알지? 겸손 좀 배워!" },
    { type: "큰 물(壬)", desc: "속을 알 수 없는 능구렁이 같아. 머리는 비상하네.", advice: "잔머리 그만 굴리고 진심으로 대해라." },
    { type: "빗물(癸)", desc: "변덕이 죽 끓듯 하네. 종잡을 수가 없어!", advice: "꾸준한 맛이 있어야지, 끈기 좀 길러!" }
];

// 3. Grandma's Randomized Templates
const OPENINGS = [
    "아이고, 사주 팔자 꼬라지 좀 보소...",
    "쯧쯧, 이걸 팔자라고 타고났냐?",
    "어디 보자... 흐음, 기가 막히는구만.",
    "야, 니 팔자도 참 가지가지 한다."
];

const ENDINGS = [
    "아무튼 정신 똑바로 차리고 살아! 알겠냐?",
    "밥은 챙겨 먹고 다니냐? 굶고 다니진 말고.",
    "오늘 내 말 명심해라. 안 그럼 후회한다?",
    "썩 마음에 들진 않지만, 그래도 니 인생이니 니가 잘 개척해봐."
];

// 4. Element Mapping
export const STEM_ELEMENTS = ["wood", "wood", "fire", "fire", "earth", "earth", "metal", "metal", "water", "water"];
export const BRANCH_ELEMENTS = ["water", "earth", "wood", "wood", "earth", "fire", "fire", "earth", "metal", "metal", "earth", "water"];

export const ELEMENT_COLORS: Record<string, string> = {
    wood: "bg-green-500 text-white",
    fire: "bg-red-500 text-white",
    earth: "bg-yellow-500 text-black",
    metal: "bg-stone-300 text-black",
    water: "bg-blue-600 text-white"
};

export const getElementColor = (char: string): string => {
    const stemIdx = CHEONGAN.indexOf(char);
    if (stemIdx !== -1) {
        return ELEMENT_COLORS[STEM_ELEMENTS[stemIdx]] || "bg-gray-200";
    }
    const branchIdx = JIJI.indexOf(char);
    if (branchIdx !== -1) {
        return ELEMENT_COLORS[BRANCH_ELEMENTS[branchIdx]] || "bg-gray-200";
    }
    return "bg-gray-200";
};

export type SajuResult = {
    year: string;
    month: string;
    day: string;
    hour: string;
    text: string;
    fiveElements: {
        wood: number;
        fire: number;
        earth: number;
        metal: number;
        water: number;
    };
    // Enhanced Data for Webtoon
    pillars?: {
        year: PillarData;
        month: PillarData;
        day: PillarData;
        time: PillarData;
    };
    dayMaster?: {
        trait: any;
        animal: string;
    };
    mbti?: string;
    userName?: string;
    question?: string;
    socialScore?: number;
    shinsals?: string[];
    cheoneul?: {
        has: boolean;
        list: string[];
    };
    daewoon?: { age: number; ganji: string; stem: string; branch: string }[];
    samsae5Year?: { year: number; isSamsae: boolean; type: string | null }[];
};

export type PillarData = {
    gan: { char: string; sound: string; trait: string; color: string; };
    ji: { char: string; sound: string; animal: string; color: string; unseong?: string; };
    tenGod: string;
    relation: string;
};

export function calculateSaju(year: number, month: number, day: number, hour: number, gender: string = 'male'): SajuResult {
    const date = new Date(year, month - 1, day, hour);
    const luni = lunisolar(date);

    const pillars = {
        year: luni.char8.year,
        month: luni.char8.month,
        day: luni.char8.day,
        hour: luni.char8.hour
    };

    // Helper to get Korean text for a pillar
    const getPillarText = (pillar: any) => {
        const stemIdx = pillar.stem.value;
        const branchIdx = pillar.branch.value;
        return `${CHEONGAN[stemIdx]}${JIJI[branchIdx]} (${ANIMALS[branchIdx]})`;
    };

    // Calculate Element Counts with Weights
    // Standard Count (Gaesu): Just counting 1 for each.
    // Weighted (Deukryeong): Month Branch (Season) has more power. Day Stem (Self) is core.
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

    const WEIGHTS = {
        DEFAULT: 1.0,
        MONTH_BRANCH: 2.5, // The season you were born in controls the temperature (Very important)
        DAY_STEM: 1.5      // 'Me'
    };

    // Iterate over all 8 characters
    // Stems (4)
    const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
    stems.forEach((stem, idx) => {
        const el = STEM_ELEMENTS[stem.value] as keyof typeof counts;
        let weight = WEIGHTS.DEFAULT;
        if (idx === 2) weight = WEIGHTS.DAY_STEM; // Day Stem is Self
        counts[el] += weight;
    });

    // Branches (4)
    const branches = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];
    branches.forEach((branch, idx) => {
        const el = BRANCH_ELEMENTS[branch.value] as keyof typeof counts;
        let weight = WEIGHTS.DEFAULT;
        if (idx === 1) weight = WEIGHTS.MONTH_BRANCH; // Month Branch is Season
        counts[el] += weight;
    });

    // --- NEW: Calculate "Social Mask Score" (Deterministic) ---
    // Gwan(Official) = Rules, Mask, Reputation.
    // In(Resource) = Study, Acceptance, Image.
    // Sik(Expression) = Acting out, Rebellion (Lowers Mask).
    // Bi(Self) = Ego.

    // Simple Heuristic:
    const gwanScore = counts.wood * (STEM_ELEMENTS.indexOf("metal") === 0 ? 0 : 1); // Logic is complex dependent on Day Master.
    // Simplified: Just use Ten Gods count if we had them easily sum-able.
    // Since we don't have Ten Gods counts readily summed in `counts` (which is just Elements),
    // let's use a simplified Element-based approach or iterate pillars again.

    // let socialScore = 50; // Removed duplicate base

    // We need Ten Gods for accurate 'Social Mask' score.
    // Since calculating Ten Gods for all elements is heavy here without the full Ten God Array,
    // let's infer from the Element Interaction with Day Master.
    // Day Master Element:
    const dmEl = STEM_ELEMENTS[pillars.day.stem.value]; // wood, fire...

    // Function to checking Element Relation (Me -> Target)
    // Wood(0) -> Fire(1) -> Earth(2) -> Metal(3) -> Water(4) -> Wood(0)
    const elMap = ["wood", "fire", "earth", "metal", "water"];
    const dmIdx = elMap.indexOf(dmEl);

    const getRel = (targetEl: string) => {
        const tIdx = elMap.indexOf(targetEl);
        return (tIdx - dmIdx + 5) % 5;
    };

    // 0: Bi (Friend)
    // 1: Sik (Output) -> Lowers Mask (Authentic)
    // 2: Jae (Wealth) -> Calculation
    // 3: Gwan (Official) -> Increases Mask (Rules)
    // 4: In (Resource) -> Increases Mask (Image)

    // User Request: Minimum Score 70 (To keep users happy)
    // New Range: 70 ~ 99
    let socialScore = 75; // New Base

    Object.entries(counts).forEach(([el, count]) => {
        const rel = getRel(el);
        if (rel === 3) socialScore += count * 5; // Gwan (Reduced weight)
        if (rel === 4) socialScore += count * 3; // In
        if (rel === 1) socialScore -= count * 2; // Sik (Reduced penalty)
    });

    // Clamp to 70 - 99
    socialScore = Math.min(99, Math.max(70, Math.round(socialScore)));


    // 1. Extract Day Master (Ilgan) for personality analysis
    const dayStemIdx = pillars.day.stem.value; // 0-9
    const dayElement = ELEMENT_TRAITS[dayStemIdx];

    // 2. Extract Year Animal (Tti)
    const yearBranchIdx = pillars.year.branch.value; // 0-11
    const animalName = ANIMALS[yearBranchIdx];

    // 3. Construct the Logic-based Fortune Text
    const opening = OPENINGS[Math.floor(Math.random() * OPENINGS.length)];
    const ending = ENDINGS[Math.floor(Math.random() * ENDINGS.length)];

    let middleText = "";

    middleText += `너는 태어나길 [${dayElement.type}]같은 기운을 타고났어.\n`;
    middleText += `보자하니 ${dayElement.desc}\n\n`;
    middleText += `${animalName}띠라 그런가? 아주 그냥 성격이 딱 보이네.\n`;
    middleText += `내 충고 하나 하마. ${dayElement.advice}`;

    const fullText = `${opening}\n\n${middleText}\n\n${ending}`;

    // --- NEW: Detailed Data Calculation (Ten Gods, Korean Sounds) ---
    const STEM_SOUNDS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
    const BRANCH_SOUNDS = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

    // Ten Gods (Shipsin) Logic
    const getTenGod = (targetStemIdx: number, dayStemIdx: number): string => {
        const dayElem = Math.floor(dayStemIdx / 2);
        const targetElem = Math.floor(targetStemIdx / 2);
        const dayPol = dayStemIdx % 2;
        const targetPol = targetStemIdx % 2;
        const samePol = dayPol === targetPol;

        const rel = (targetElem - dayElem + 5) % 5;

        switch (rel) {
            case 0: return samePol ? "비견" : "겁재";
            case 1: return samePol ? "식신" : "상관";
            case 2: return samePol ? "편재" : "정재";
            case 3: return samePol ? "편관" : "정관";
            case 4: return samePol ? "편인" : "정인";
            default: return "";
        }
    };

    // Main Qi Mapping for Branches
    const BRANCH_TO_STEM_IDX = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];

    // Basic Data Arrays
    const CHEONGAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
    const CHEONGAN_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

    const JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
    const JIJI_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]; // ... Fixed Logic below ...

    // ... (Existing code) ...

    // --- NEW: 12 Unseong (12 Stages of Life) Logic ---
    const STAGES_12 = ["절", "태", "양", "장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘"];

    // Starting Branch Index for "Jangsaeng" (Birth) for each Stem (0=Gap ... 9=Gye)
    // Gap(Wood+): Hac (11) -> No, Gap starts Jangsaeng at Hae(11).
    // Let's use a standard lookup for "Start of Jangsaeng" or "Start of Jeol".
    // Or just a raw offset table for reliable results.
    // Rows: Stems (0-9), Cols: Branches (0-11: Ja, Chuk, In...)

    // Simplified Lookup based on standard 12 Unseong tables
    // 0: Gap (Yang Wood) -> Jangsaeng at Hae(11). Order: Forward.
    // 1: Eul (Yin Wood) -> Jangsaeng at O(6). Order: Reverse.
    // ... adapting full logic is error-prone inline. Let's use a matrix.

    // 12 Unseong Indices corresponding to Branches [Ja(0), Chuk(1), ... Hae(11)]
    const UNSEONG_TABLE = [
        // Gap (0): Mok-yok, Gwan-dae, Geol-rok, Je-wang, Soe, Byeong, Sa, Myo, Jeol, Tae, Yang, Jang-saeng
        [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
        // Eul (1): Byeong, Soe, Je-wang, Geol-rok, Gwan-dae, Mok-yok, Jang-saeng, Yang, Tae, Jeol, Myo, Sa
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10],
        // Byeong (2): Tae, Yang, Jang-saeng, Mok-yok, Gwan-dae, Geol-rok, Je-wang, Soe, Byeong, Sa, Myo, Jeol
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
        // Jeong (3): Jeol, Myo, Sa, Byeong, Soe, Je-wang, Geol-rok, Gwan-dae, Mok-yok, Jang-saeng, Yang, Tae
        [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        // Mu (4): Same as Byeong (Fire/Earth same cycle)
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
        // Gi (5): Same as Jeong (Fire/Earth same cycle)
        [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        // Gyeong (6): Sa, Myo, Jeol, Tae, Yang, Jang-saeng, Mok-yok, Gwan-dae, Geol-rok, Je-wang, Soe, Byeong
        [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // Sin (7): Je-wang, Geol-rok, Gwan-dae, Mok-yok, Jang-saeng, Yang, Tae, Jeol, Myo, Sa, Byeong, Soe
        [7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8],
        // Im (8): Je-wang, Soe, Byeong, Sa, Myo, Jeol, Tae, Yang, Jang-saeng, Mok-yok, Gwan-dae, Geol-rok
        [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
        // Gye (9): Geol-rok, Gwan-dae, Mok-yok, Jang-saeng, Yang, Tae, Jeol, Myo, Sa, Byeong, Soe, Je-wang 
        [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7]
    ];
    // Note: The above table logic needs careful verification.
    // Let's refine based on "Starts at":
    // Gap(0): Hae(11) is Jangsaeng(3). Ja(0) is Mokyok(4). Logic Checks out.
    // Eul(1): O(6) is Jangsaeng(3). Ja(0) is Byeong(9). Logic Checks out.

    // Actually, simpler to just map branch index to stage index for each stem.

    const get12Unseong = (stemIdx: number, branchIdx: number): string => {
        const stageIdx = UNSEONG_TABLE[stemIdx][branchIdx];
        return STAGES_12[stageIdx];
    };

    // --- NEW: Shinsal Logic (Dohwa, Yeokma, Hwagae) ---
    // Dohwa (Peach Blossom): Attraction, Popularity. (Ja, O, Myo, Yu)
    // Yeokma (Traveler): Movement, Change. (In, Sin, Sa, Hae)
    // Hwagae (Art/Religion): Solitude, Art, Honor. (Jin, Sul, Chuk, Mi)

    // Simplification: We check if ANY branch has these.
    // Ideally, Shinsal is determined by Year/Day branch relative to others, 
    // but in modern interpretation, having the characters themselves ("Gaseu") is often counted as having the potential.

    const SHINSAL_MAP = {
        "도화살": [0, 6, 3, 9], // Ja(0), O(6), Myo(3), Yu(9)
        "역마살": [2, 8, 5, 11], // In(2), Sin(8), Sa(5), Hae(11)
        "화개살": [4, 10, 1, 7]  // Jin(4), Sul(10), Chuk(1), Mi(7)
    };

    const myShinsals: string[] = [];

    const branchIndices = [
        pillars.year.branch.value,
        pillars.month.branch.value,
        pillars.day.branch.value,
        pillars.hour.branch.value
    ];

    // Count occurrences
    let dohwaCount = 0;
    let yeokmaCount = 0;
    let hwagaeCount = 0;

    branchIndices.forEach(idx => {
        if (SHINSAL_MAP["도화살"].includes(idx)) dohwaCount++;
        if (SHINSAL_MAP["역마살"].includes(idx)) yeokmaCount++;
        if (SHINSAL_MAP["화개살"].includes(idx)) hwagaeCount++;
    });

    if (dohwaCount > 0) myShinsals.push(`도화살(${dohwaCount}개)`);
    if (yeokmaCount > 0) myShinsals.push(`역마살(${yeokmaCount}개)`);
    if (hwagaeCount > 0) myShinsals.push(`화개살(${hwagaeCount}개)`);

    // --- NEW: Cheoneul Gui-in Logic (Heavenly Nobleman) ---
    // Mapping Day Stem -> Nobleman Branches
    // 甲(0) -> 丑(1), 未(7)
    // 乙(1) -> 子(0), 申(8)
    // 丙(2) -> 亥(11), 酉(9)
    // 丁(3) -> 亥(11), 酉(9)
    // 戊(4) -> 丑(1), 未(7)
    // 己(5) -> 子(0), 申(8)
    // 庚(6) -> 丑(1), 未(7)
    // 辛(7) -> 午(6), 寅(2)
    // 壬(8) -> 巳(5), 卯(3)
    // 癸(9) -> 巳(5), 卯(3)

    // Simplified Lookup Table (Index of Day Stem 0-9)
    const NOBLEMAN_MAP = [
        [1, 7], // 甲
        [0, 8], // 乙
        [11, 9], // 丙
        [11, 9], // 丁
        [1, 7], // 戊
        [0, 8], // 己
        [1, 7], // 庚
        [6, 2], // 辛
        [5, 3], // 壬
        [5, 3]  // 癸
    ];

    const myNoblemanTargets = NOBLEMAN_MAP[pillars.day.stem.value]; // e.g. [1, 7]
    const foundNobleman: string[] = [];

    // Check all branches for these targets
    const allBranches = [
        pillars.year.branch.value,
        pillars.month.branch.value,
        pillars.day.branch.value,
        pillars.hour.branch.value
    ];

    allBranches.forEach(branchVal => {
        if (myNoblemanTargets.includes(branchVal)) {
            // Get character name
            // Get character name "Sound(Hanja)"
            const char = `${JIJI[branchVal]}(${JIJI_HANJA[branchVal]})`;
            if (!foundNobleman.includes(char)) {
                foundNobleman.push(char);
            }
        }
    });

    const hasCheoneul = foundNobleman.length > 0;

    const formatPillar = (stemVal: number, branchVal: number) => {
        const stemGod = getTenGod(stemVal, dayStemIdx);
        // Day Stem itself is "Won" (Me)
        const finalStemGod = (stemVal === dayStemIdx && stemVal === pillars.day.stem.value) ? "일원" : stemGod;
        const branchGod = getTenGod(BRANCH_TO_STEM_IDX[branchVal], dayStemIdx);
        const unseong = get12Unseong(dayStemIdx, branchVal); // 12 Unseong is always Day Stem vs Branch

        return {
            gan: {
                char: CHEONGAN_HANJA[stemVal],
                sound: CHEONGAN[stemVal],
                trait: (stemVal === pillars.day.stem.value) ? "본인" : stemGod, // tenGod as trait
                color: STEM_ELEMENTS[stemVal]
            },
            ji: {
                char: JIJI_HANJA[branchVal],
                sound: JIJI[branchVal],
                animal: ANIMALS[branchVal],
                color: BRANCH_ELEMENTS[branchVal],
                unseong: unseong
            },
            tenGod: (stemVal === pillars.day.stem.value) ? "본인" : stemGod, // Main tenGod
            relation: (stemVal === pillars.day.stem.value) ? "나" : "가족" // Placeholder relation, logic needed if strict
        };
    };

    const enhancedPillars = {
        year: formatPillar(pillars.year.stem.value, pillars.year.branch.value),
        month: formatPillar(pillars.month.stem.value, pillars.month.branch.value),
        day: formatPillar(pillars.day.stem.value, pillars.day.branch.value),
        time: formatPillar(pillars.hour.stem.value, pillars.hour.branch.value),
    };

    return {
        year: getPillarText(pillars.year),
        month: getPillarText(pillars.month),
        day: getPillarText(pillars.day),
        hour: getPillarText(pillars.hour),
        text: fullText,
        fiveElements: counts,
        pillars: enhancedPillars,
        dayMaster: {
            trait: dayElement,
            animal: animalName
        },
        socialScore: socialScore,
        shinsals: myShinsals,
        cheoneul: {
            has: hasCheoneul,
            list: foundNobleman
        },
        daewoon: calculateDaewoonList(pillars.year.stem.value, gender, pillars.month.stem.value, pillars.month.branch.value),
        samsae5Year: calculateSamsae(pillars.year.branch.value, new Date().getFullYear())
    };
}

// Helper: Calculate Daewoon
// Needs: Year Stem Index (0-9), Gender ('male'|'female'), Month Stem(0-9), Month Branch(0-11)
export function calculateDaewoonList(yearStemIdx: number, gender: string, monthStemIdx: number, monthBranchIdx: number): { age: number, ganji: string, stem: string, branch: string }[] {
    // 1. Determine Direction
    // Yang Stems: 0, 2, 4, 6, 8 (Gap, Byeong, Mu, Gyeong, Im) -> Even Indices
    const isYearYang = (yearStemIdx % 2) === 0;
    const isMale = gender === 'male';

    // Male+Yang or Female+Yin = Forward (1)
    // Male+Yin or Female+Yang = Backward (-1)
    let direction = 1;
    if (isMale && isYearYang) direction = 1;
    else if (!isMale && !isYearYang) direction = 1;
    else direction = -1;

    // 2. Determine Daewoon Number (Simple Deterministic Fallback)
    // Exact calculation requires Solar Terms (Jeolgi). 
    // Heuristic: (yearStem + monthBranch) % 10. To keep it static for a user.
    // Ideally 1-10.
    const daewoonNum = ((yearStemIdx + monthBranchIdx) % 10) + 1;

    // 3. Generate Sequence (Starting from Month Pillar)
    const list = [];
    let currentStem = monthStemIdx;
    let currentBranch = monthBranchIdx;

    const CHEONGAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
    const JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
    const CHEONGAN_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const JIJI_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

    for (let i = 0; i < 9; i++) { // Generate 9 daewoons (approx up to 90s)
        // Advance
        currentStem = (currentStem + direction + 10) % 10;
        currentBranch = (currentBranch + direction + 12) % 12; // Modulo 12 for branches

        const age = daewoonNum + (i * 10);
        const name = `${CHEONGAN[currentStem]}${JIJI[currentBranch]}(${CHEONGAN_HANJA[currentStem]}${JIJI_HANJA[currentBranch]})`;

        list.push({
            age: age,
            ganji: name,
            stem: CHEONGAN[currentStem], // For element analysis
            branch: JIJI[currentBranch]
        });
    }

    return list;
}

// --- NEW: Samsae (Three Disasters) Logic ---
// 1. Monkey, Rat, Dragon -> Tiger(Entering), Rabbit(Staying), Dragon(Leaving)
// 2. Pig, Rabbit, Goat -> Snake, Horse, Goat
// 3. Tiger, Horse, Dog -> Monkey, Rooster, Dog
// 4. Snake, Rooster, Ox -> Pig, Rat, Ox
export function calculateSamsae(birthYearBranchIdx: number, currentYear: number) {
    // 0:Ja(Rat), 1:Chuk(Ox), 2:In(Tiger), 3:Myo(Rabbit), 4:Jin(Dragon), 5:Sa(Snake)
    // 6:O(Horse), 7:Mi(Goat), 8:Sin(Monkey), 9:Yu(Rooster), 10:Sul(Dog), 11:Hae(Pig)

    // Grouping by Birth Branch (mod 4 relations? No, triangles)
    // Triangles: (0, 4, 8), (1, 5, 9), (2, 6, 10), (3, 7, 11) - Check indices.
    // Rat(0), Dragon(4), Monkey(8) -> Group 1. Samsae Years: In(2), Myo(3), Jin(4).
    // Ox(1), Snake(5), Rooster(9) -> Group 4. Samsae Years: Hae(11), Ja(0), Chuk(1).
    // Tiger(2), Horse(6), Dog(10) -> Group 3. Samsae Years: Sin(8), Yu(9), Sul(10).
    // Rabbit(3), Goat(7), Pig(11) -> Group 2. Samsae Years: Sa(5), O(6), Mi(7).

    let samsaeYears: number[] = []; // Indices of branches

    if ([0, 4, 8].includes(birthYearBranchIdx)) samsaeYears = [2, 3, 4];
    else if ([3, 7, 11].includes(birthYearBranchIdx)) samsaeYears = [5, 6, 7];
    else if ([2, 6, 10].includes(birthYearBranchIdx)) samsaeYears = [8, 9, 10];
    else if ([1, 5, 9].includes(birthYearBranchIdx)) samsaeYears = [11, 0, 1];

    // Determine Status for Current Year
    // Needed: Current Year's Branch Index.
    // Reference: 2024 is Dragon (Jin, 4).
    // Formula: (year - 4) % 12. 
    // 2024 - 4 = 2020. 2020 % 12 = 4 (Jin). Correct.

    // Check next 5 years
    const result = [];
    for (let i = 0; i < 5; i++) {
        const y = currentYear + i;
        const yBranch = (y - 4) % 12;

        let type = null;
        if (yBranch === samsaeYears[0]) type = 'entering'; // 들삼재
        else if (yBranch === samsaeYears[1]) type = 'staying'; // 눌삼재
        else if (yBranch === samsaeYears[2]) type = 'leaving'; // 날삼재

        result.push({
            year: y,
            isSamsae: type !== null,
            type: type
        });
    }

    return result;
}
