// Fragrance Quiz Questions Configuration

export interface QuizQuestion {
    id: string;
    question: string;
    type: "single" | "multiple" | "range";
    options?: QuizOption[];
    min?: number;
    max?: number;
    weight: number; // Importance in recommendation (0-1)
}

export interface QuizOption {
    value: string;
    label: string;
    image?: string;
    tags?: string[]; // For matching with products
}

export const quizQuestions: QuizQuestion[] = [
    {
        id: "gender",
        question: "Who is this fragrance for?",
        type: "single",
        weight: 0.25,
        options: [
            { value: "men", label: "For Him", tags: ["men"] },
            { value: "women", label: "For Her", tags: ["women"] },
            { value: "unisex", label: "Unisex", tags: ["unisex"] },
        ],
    },
    {
        id: "fragranceFamily",
        question: "Which scent families appeal to you? (Select all that apply)",
        type: "multiple",
        weight: 0.3,
        options: [
            { value: "floral", label: "Floral", tags: ["Floral"] },
            { value: "woody", label: "Woody", tags: ["Woody"] },
            { value: "oriental", label: "Oriental", tags: ["Oriental"] },
            { value: "fresh", label: "Fresh", tags: ["Fresh"] },
            { value: "citrus", label: "Citrus", tags: ["Citrus"] },
            { value: "spicy", label: "Spicy", tags: ["Spicy"] },
            { value: "musk", label: "Musk", tags: ["Musk"] },
            { value: "oud", label: "Oud", tags: ["Oud"] },
        ],
    },
    {
        id: "intensity",
        question: "How strong do you prefer your fragrance?",
        type: "single",
        weight: 0.15,
        options: [
            { value: "light", label: "Light & Subtle", tags: ["EDT", "Fresh"] },
            { value: "moderate", label: "Moderate", tags: ["EDP"] },
            { value: "bold", label: "Bold & Intense", tags: ["Parfum", "Attar"] },
        ],
    },
    {
        id: "longevity",
        question: "How long should the fragrance last?",
        type: "single",
        weight: 0.2,
        options: [
            { value: "short", label: "2-4 hours (Quick refresh)", tags: ["EDT"] },
            { value: "medium", label: "4-8 hours (Half day)", tags: ["EDP"] },
            { value: "long", label: "8+ hours (All day)", tags: ["Parfum", "Attar"] },
        ],
    },
    {
        id: "season",
        question: "When will you wear this fragrance most?",
        type: "single",
        weight: 0.1,
        options: [
            { value: "summer", label: "Summer (Light & Fresh)", tags: ["Fresh", "Citrus"] },
            { value: "winter", label: "Winter (Warm & Rich)", tags: ["Oriental", "Woody", "Spicy"] },
            { value: "all", label: "All Seasons", tags: [] },
        ],
    },
    {
        id: "occasion",
        question: "What's the primary occasion?",
        type: "single",
        weight: 0.15,
        options: [
            { value: "daily", label: "Daily Wear", tags: ["Fresh", "Citrus"] },
            { value: "office", label: "Office/Professional", tags: ["Fresh", "Woody"] },
            { value: "evening", label: "Evening/Dinner", tags: ["Oriental", "Spicy"] },
            { value: "special", label: "Special Events/Wedding", tags: ["Oud", "Oriental"] },
            { value: "religious", label: "Religious Occasions", tags: ["Attar", "Musk"] },
        ],
    },
    {
        id: "personality",
        question: "Which personality best describes you or the recipient?",
        type: "single",
        weight: 0.1,
        options: [
            { value: "elegant", label: "Elegant & Sophisticated", tags: ["Floral", "Oriental"] },
            { value: "sporty", label: "Sporty & Active", tags: ["Fresh", "Citrus"] },
            { value: "romantic", label: "Romantic & Sensual", tags: ["Floral", "Musk"] },
            { value: "professional", label: "Professional & Confident", tags: ["Woody", "Spicy"] },
            { value: "traditional", label: "Traditional & Classic", tags: ["Oud", "Attar"] },
        ],
    },
    {
        id: "budget",
        question: "What's your budget range?",
        type: "single",
        weight: 0.15,
        options: [
            { value: "0-5000", label: "Under Rs. 5,000", tags: [] },
            { value: "5000-10000", label: "Rs. 5,000 - 10,000", tags: [] },
            { value: "10000-20000", label: "Rs. 10,000 - 20,000", tags: [] },
            { value: "20000+", label: "Rs. 20,000+", tags: [] },
        ],
    },
];

export type QuizAnswers = Record<string, string | string[]>;
