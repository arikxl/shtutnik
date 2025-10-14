'use client'
import { supabase } from '@/supabase-client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const fetchGamesCount = async () => {
    const { data, error } = await supabase.from("games").select("*");
    if (error) throw new Error(error.message);
    const totalGamesStarted = data?.length;
    const totalGamesEnded = data?.filter(game => game.level === 3).length || 0;

    return { totalGamesStarted, totalGamesEnded };
}


const Admin = () => {

    const { data, error, isLoading } = useQuery({
        queryKey: ["gamsCount"],
        queryFn: () => fetchGamesCount()
    })

    if (isLoading) return <div>Loading game data... ⏳</div>;

    if (error) return <div>Error: {error.message}</div>;


    return (
        <div dir='ltr'>
            <p>Hi Arik</p>
            <p>Total games stared:{data.totalGamesStarted}</p>
            <p>Total games ended:{data.totalGamesEnded}</p>

        </div>
    )
}

export default Admin