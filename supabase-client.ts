import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string


export const supabase = createClient(
    supabaseURL,
    supabaseKEY
);


