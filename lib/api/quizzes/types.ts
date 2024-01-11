enum QuizDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

enum QuizFormat {
    MULTIPLE_CHOICE = 'multiple-choice',
    TRUE_FALSE = 'true/false',
    SHORT_ANSWER = 'short-answer',
}

type GenerateQuizParams = {
    chapter_id?: number;
    number_of_questions: number;
    difficulty: string;
    form: string;
    prompt?: string;
};