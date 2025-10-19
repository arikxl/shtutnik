export type Game = {
    slug: string;
    player1_name: string;
    player2_name: string;
    player1_score: number;
    player2_score: number;
    is_player1_turn: boolean;
    level: number
};


export type QuizQuestionHandle = {
    getNewQuestion: () => void;
};



export type ApiError = {
    message: string;
}