import { supabase } from "@/supabase-client";
import { Game } from "@/types/types";

export const fetchGameById = async (slug: string): Promise<Game> => {
    const { data, error } = await supabase.from("games").select("*").eq("slug", slug).single();
    if (error) throw new Error(error.message);
    return data;
};