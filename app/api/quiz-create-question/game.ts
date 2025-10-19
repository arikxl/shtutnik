import { Game } from "@/types/types";
import { supabase } from "@/supabase-client";

export const fetchGameById = async (slug: string): Promise<Game> => {
    const { data, error } = await supabase.from("games").select("*").eq("slug", slug).single();
    if (error) throw new Error(error.message);
    if (!data) throw new Error(error.message);
    return data;
};


export const updateScore = async (currentGame: Game, points: number) => {
    const newPlayer1Score = currentGame.is_player1_turn
        ? currentGame.player1_score + points
        : currentGame.player1_score;

    const newPlayer2Score = !currentGame.is_player1_turn
        ? currentGame.player2_score + points
        : currentGame.player2_score;

    const { data, error } = await supabase
        .from('games')
        .update({
            player1_score: newPlayer1Score,
            player2_score: newPlayer2Score,
        })
        .eq('slug', currentGame.slug);

    if (error) {
        throw new Error(error.message);
    }
    return data;
};



export const updateTurn = async (currentGame: Game) => {

    const { data, error } = await supabase
        .from('games')
        .update({
            is_player1_turn: !currentGame.is_player1_turn 
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

