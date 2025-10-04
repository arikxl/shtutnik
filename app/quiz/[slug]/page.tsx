/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import NotFound from '@/app/not-found';
import Loader from '@/components/Loader';
import QuizQuestion from '@/components/QuizQuestion';
import { supabase } from '@/supabase-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'


const fetchPostById = async (slug: string) => {
  const { data, error } = await supabase.from("games").select("*").eq("slug", slug).single();
  if (error) throw new Error(error.message);
  return data;
};

const updateScoreAndTurn = async (currentGame: { is_player1_turn: any; player1_score: number; player2_score: number; slug: string; }) => {
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

const Quiz = ({ params }: any) => {
  const queryClient = useQueryClient(); // Get the client instance

  const { slug } = params;

  const { data:game, error, isLoading } = useQuery({
    queryKey: ["game", slug],
    queryFn: () => fetchPostById(slug)
  })

  const { mutate: addPoint, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      if (!game) throw new Error("Game data is not available.");
      return updateScoreAndTurn(game);
    },
    onSuccess: () => {
      // console.log('Score updated!');
      // console.log(game)
      queryClient.invalidateQueries({ queryKey: ['game', slug] });
    },
    onError: (err) => {
      console.error("Failed to update score:", err);
    }
  });


  


  if (isLoading) return <Loader/>

  if (error) return <div>Error: {error.message}</div>;


  if (!game) NotFound()


  return (
    <div className='flex flex-col items-center py-20 space-y-6 px-6'>
      <h1 className='text-2xl'>
        בהצלחה&nbsp;
        {game.is_player1_turn ? game.player1_name : game.player2_name }
      </h1>


        <QuizQuestion />

      <div className='w-full'>
        <button disabled={isUpdating} onClick={() => addPoint()}

          className="bg-[lime] text-slate-900 border-slate-900 border-2 text-xl py-2 w-full rounded-lg cursor-pointer"
        >
          חירטוט מעולה - נקודה אחת!
        </button>
      </div>

      <p>{game.player1_score}</p>
    </div>
  )
}

export default Quiz