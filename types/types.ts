export type Game = {
    slug: string;
    player1_name: string;
    player2_name: string;
    player1_score: number;
    player2_score: number;
    is_player1_turn: boolean;
    // ...כל שדה אחר שקיים בטבלת games
};


export type QuizQuestionHandle = {
    getNewQuestion: () => void;
};