import { supabase } from "@/supabase-client";
import { Game } from "@/types/types";

export const fetchGameById = async (slug: string): Promise<Game> => {
    const { data, error } = await supabase.from("games").select("*").eq("slug", slug).single();
    if (error) throw new Error(error.message);
    return data;
};



 export const updateScoreAndTurn = async (currentGame: Game) => {
    // חישוב הניקוד החדש והתור הבא
    const newPlayer1Score = currentGame.is_player1_turn
        ? currentGame.player1_score + 1
        : currentGame.player1_score;

    const newPlayer2Score = !currentGame.is_player1_turn
        ? currentGame.player2_score + 1
        : currentGame.player2_score;

    const { data, error } = await supabase
        .from('games')
        .update({
            player1_score: newPlayer1Score,
            player2_score: newPlayer2Score,
            // is_player1_turn: !currentGame.is_player1_turn, // הופכים את התור
        })
        .eq('slug', currentGame.slug);

    if (error) {
        throw new Error(error.message);
    }
    return data;
};




export const advanceLevel = async (currentGame: Game) => {
    const newLevel = currentGame.level + 1;
    const { data, error } = await supabase
        .from('games')
        .update({ level: newLevel })
        .eq('slug', currentGame.slug);

    if (error) {
        throw new Error((error as Error).message);
    }
    return data;
};

