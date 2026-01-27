import { useReducer } from "react";

export type Stage = "name" | "gender" | "birthDate" | "birthTime" | "mbti" | "question" | "analyzing" | "result";

export type UserData = {
    name: string;
    gender: "male" | "female" | null;
    birthDate: string; // YYMMDD
    isSolar: boolean;
    birthTime: string; // HHmm or UNKNOWN
    mbti: string | null;
    question?: string;
};

type State = {
    stage: Stage;
    userData: UserData;
    input: string;
    error: string | null;
};

type Action =
    | { type: "SET_INPUT"; payload: string }
    | { type: "SUBMIT_NAME" }
    | { type: "SELECT_GENDER"; payload: "male" | "female" }
    | { type: "SUBMIT_BIRTHDATE" }
    | { type: "SET_IS_SOLAR"; payload: boolean }
    | { type: "SELECT_BIRTHTIME"; payload: string }
    | { type: "SELECT_MBTI"; payload: string }
    | { type: "SUBMIT_QUESTION" }
    | { type: "START_ANALYSIS" }
    | { type: "FINISH_ANALYSIS" }
    | { type: "SUBMIT_BIRTHTIME_STAGE" }
    | { type: "RESET" };

const initialState: State = {
    stage: "name",
    userData: {
        name: "",
        gender: null,
        birthDate: "",
        isSolar: true,
        birthTime: "",
        mbti: null,
        question: ""
    },
    input: "",
    error: null
};

function chatReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_INPUT":
            return { ...state, input: action.payload, error: null };

        case "SUBMIT_NAME":
            if (!state.input.trim()) return { ...state, error: "이름을 입력해야지!" };
            return {
                ...state,
                userData: { ...state.userData, name: state.input.trim() },
                stage: "gender",
                input: "",
                error: null
            };

        case "SELECT_GENDER":
            return {
                ...state,
                userData: { ...state.userData, gender: action.payload },
                stage: "birthDate",
                input: "",
                error: null
            };

        case "SUBMIT_BIRTHDATE":
            const cleanDate = state.input.replace(/-/g, "");
            if (!/^\d{6}$/.test(cleanDate)) {
                return { ...state, error: "똑바로 못 쓰냐? 숫자 6개로 적어라! (예: 960505)" };
            }
            return {
                ...state,
                userData: { ...state.userData, birthDate: cleanDate },
                stage: "birthTime",
                input: "",
                error: null
            };

        case "SET_IS_SOLAR":
            return {
                ...state,
                userData: { ...state.userData, isSolar: action.payload }
            };

        case "SELECT_BIRTHTIME":
            if (!action.payload) return state;
            // Note: In select dropdown, usually we select and move next or select and press next.
            // Let's assume selecting specific time moves to next stage OR just updates data.
            // Based on previous flow, it was "Next" button click. 
            // But to make it smooth, let's update data here.
            // Actually, we want a separate submit for dropdowns usually, but for consistency with the refactor goal:
            return {
                ...state,
                input: action.payload, // store in input temporarily if we want to wait for "Next" button
                userData: { ...state.userData, birthTime: action.payload },
                // If we want to move instantly:
                // stage: "mbti", 
                // input: ""
                // But typically UI has "Next" button for dropdowns. 
                // Let's just update userData and let the "NEXT_STAGE" action handle it? 
                // Or better: Let "SUBMIT_BIRTHTIME" be the action.
            };

        // Let's define specific transition actions for inputs that require a "Next" button press vs instant click.
        // For BirthTime (dropdown), usually user picks then clicks Next.
        // So we need a SUBMIT_BIRTHTIME action.

        // Wait, I didn't verify if I missed "SUBMIT_BIRTHTIME" logic in the case list above.
        // I will add a case for SUBMIT_BIRTHTIME.

        case "SUBMIT_BIRTHTIME_STAGE":
            if (!state.userData.birthTime) return { ...state, error: "태어난 시간을 선택해라!" };
            return {
                ...state,
                stage: "mbti",
                input: "",
                error: null
            };

        case "SELECT_MBTI":
            return {
                ...state,
                userData: { ...state.userData, mbti: action.payload },
                stage: "question",
                input: "",
                error: null
            };

        case "SUBMIT_QUESTION":
            return {
                ...state,
                userData: { ...state.userData, question: state.input },
                stage: "analyzing",
                input: "",
                error: null
            };

        case "START_ANALYSIS":
            return { ...state, stage: "analyzing" };

        case "FINISH_ANALYSIS":
            return { ...state, stage: "result" };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

// Separate helper for submit logic to keep reducer clean? 
// No, keep it simple.

// Re-refining the reducer to handle the "Next" button generically if preferred, 
// OR specific actions. Specific actions are more robust (Deterministic).

export function useChatReducer() {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const setInput = (idx: string) => dispatch({ type: "SET_INPUT", payload: idx });

    // Explicit Actions
    const submitName = () => dispatch({ type: "SUBMIT_NAME" });
    const selectGender = (gender: "male" | "female") => dispatch({ type: "SELECT_GENDER", payload: gender });
    const submitBirthDate = () => dispatch({ type: "SUBMIT_BIRTHDATE" });
    const setIsSolar = (isSolar: boolean) => dispatch({ type: "SET_IS_SOLAR", payload: isSolar });
    const selectBirthTime = (time: string) => dispatch({ type: "SELECT_BIRTHTIME", payload: time });

    // For birth time, we need a submit action because it's a dropdown + Next button.
    const submitBirthTime = () => {
        if (!state.userData.birthTime && !state.input) return; // Basic validation
        // In the reducer, we optimistically allowed updating userData with SELECT_BIRTHTIME.
        // So just move stage.
        // Let's add a precise SUBMIT_BIRTHTIME case below to be safe.
        dispatch({ type: "SUBMIT_BIRTHTIME_STAGE" } as any);
    };

    const selectMbti = (mbti: string) => dispatch({ type: "SELECT_MBTI", payload: mbti });

    // For Question, it's an input + Next/Skip.
    const submitQuestion = () => dispatch({ type: "SUBMIT_QUESTION" });

    const reset = () => dispatch({ type: "RESET" });
    const finishAnalysis = () => dispatch({ type: "FINISH_ANALYSIS" });

    return {
        state,
        setInput,
        submitName,
        selectGender,
        submitBirthDate,
        setIsSolar,
        selectBirthTime,
        submitBirthTime,
        selectMbti,
        submitQuestion,
        reset,
        finishAnalysis
    };
}
