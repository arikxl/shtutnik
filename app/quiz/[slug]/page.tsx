/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import NotFound from '@/app/not-found';
import Loader from '@/components/Loader';
import { supabase } from '@/supabase-client';
import { Game } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useRef, useState } from 'react' // ⭐️ 1. לייבא את useRef
import QuizQuestion, { QuizQuestionHandle } from '@/components/QuizQuestion';



const fetchPostById = async (slug: string):Promise<Game> => {
  const { data, error } = await supabase.from("games").select("*").eq("slug", slug).single();
  if (error) throw new Error(error.message);
  return data;
};

const updateScoreAndTurn = async (currentGame: Game) => {
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

const Quiz = ({ params }: {params: {slug:string}}) => {
  const queryClient = useQueryClient(); // Get the client instance

  const { slug } = params;

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);


  const quizQuestionRef = useRef<QuizQuestionHandle>(null);


  const { data:game, error, isLoading } = useQuery<Game>({
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
      quizQuestionRef.current?.getNewQuestion();

    },
    onError: (err) => {
      console.error("Failed to update score:", err);
    }
  });


  


  if (isLoading) return <Loader/>

  if (error) return <div>Error: {error.message}</div>;


  if (!game) {
    return <NotFound />;
  }

  return (
    <div className='flex flex-col items-center py-20 space-y-6 px-6'>

      <button onClick={() => setIsSoundOn(!isSoundOn)}>
        {isSoundOn ? '🔊' : '🔇'}
      </button>

      <h1 className='text-2xl'>
        בהצלחה&nbsp;
        {game.is_player1_turn ? game.player1_name : game.player2_name }
      </h1>

      


      <QuizQuestion ref={quizQuestionRef} isSoundOn={isSoundOn } />

      <div className='w-full'>
        <button disabled={isUpdating} onClick={() => addPoint()}

          className="bg-[lime] text-slate-900 border-slate-900 border-2 text-xl py-2 w-full rounded-lg cursor-pointer"
        >
          חירטוט מעולה - נקודה אחת!
        </button>
      </div>

      <p>player1_score {game.player1_score}</p>
      <p>player2_score {game.player2_score}</p>
    </div>
  )
}

export default Quiz