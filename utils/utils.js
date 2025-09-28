import { supabase } from "@/supabase-client";

export const generateRandomSlug = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



export async function checkAuthConnection() {
    try {
        // This query asks for the total count of users without fetching user data.
        // It's a very fast and low-cost operation.
        const { error } = await supabase.from('users').select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase auth connection error:', error.message);
            return false;
        }

        console.log('✅ Supabase connection to auth schema is good.');
        return true;

    } catch (e) {
        console.error('A network error occurred:', e.message);
        return false;
    }
}
