'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/supabase-client';
import { generateRandomSlug } from '../utils/utils'

const createGame = async (gameSlug: string, player1Name: string, player2Name: string) => {
    const { data, error } = await supabase.from('games').insert(
        { slug: gameSlug, player1_name: player1Name, player2_name: player2Name }
    );
    if (error) throw new Error(error.message)
    return data
}

const PlayersNames = () => {
    const router = useRouter();
    const [slug] = useState(() => generateRandomSlug());
    // console.log(gameSlug)

    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');


    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: () => {
            return createGame(slug, name1, name2)
        },
        onSuccess: () => {
            // console.log("Game created successfully! Navigating to gamePage.");
            router.push(`/game/${slug}`);
        },
    })


    const handleStartGame = (event: React.FormEvent) => {
        event.preventDefault();
        if (!name1.trim() || !name2.trim()) return;
        mutate();
    };


    return (

        <form onSubmit={handleStartGame} className="w-full flex flex-col items-center h-full ">

            <h1 className="mt-10 text-5xl font-bold">
                מי משחק?
            </h1>

            <div className='my-10 w-full flex items-center justify-center'>
                <input type='text' value={name1} required
                    placeholder='שם שחקן/ית 1'
                    onChange={(e) => setName1(e.target.value)}
                    className='bg-white w-7/10 text-center p-4'

                />
            </div>

            <div className='mt-2 mb-20 w-full flex items-center justify-center'>
                <input type='text' value={name2} required
                    onChange={(e) => setName2(e.target.value)}
                    placeholder='שם שחקן/ית 2'
                    className='bg-white w-7/10 text-center p-4'
                />
            </div>


            <button
                className="mb-6 bg-white text-xl py-2 w-7/10 rounded-lg cursor-pointer "
                type="submit"
                disabled={isPending}
            >
                {isPending ? 'כבר מתחילים...' : 'בואו נתחיל!'}


            </button>

            {isError && <p className='text-red-500'>
                אופס, משהו השתבש. נסו שוב. ({error.message})
            </p>}

        </form>
    )
}

export default PlayersNames