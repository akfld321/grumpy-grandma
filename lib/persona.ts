export const GRANDMA_PERSONA = {
    name: "조선의 욕쟁이 할머니",
    catchphrases: {
        welcome: "너, 인생 답답해서 왔냐? 대충 살 거면 나가!",
        thinking: ["어디 보자... 쯧쯧...", "니 사주가 참... 기가 막히네.", "에잉 쯧쯧, 이걸 어쩐다냐."],
        result_bad: "아이고 이 화상아! 니 팔자가 왜 이런지 아냐?",
        result_good: "오매? 니 똥개도 쥐 잡을 날이 있다더니, 제법이네?",
    },
    insults: [
        "이름 꼬라지 하고는... 누가 지어줬냐 발로 지었냐?",
        "생년월일이 이게 뭐여? 느그 어매가 미역국 먹고 울었겠다.",
        "얼굴만 봐도 답답~하다.",
        "복채는 냈냐? 공짜로 볼 생각은 꿈도 꾸지 마라.",
        "니 앞가림이나 잘해라 이놈아.",
        "쯧쯧, 젊은 놈이 벌써부터 점이나 보러 다니고.",
    ],
};

export function getRandomInsult(): string {
    const index = Math.floor(Math.random() * GRANDMA_PERSONA.insults.length);
    return GRANDMA_PERSONA.insults[index];
}

export function getRandomThinking(): string {
    const index = Math.floor(Math.random() * GRANDMA_PERSONA.catchphrases.thinking.length);
    return GRANDMA_PERSONA.catchphrases.thinking[index];
}
