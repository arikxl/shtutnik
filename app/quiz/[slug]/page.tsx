/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Loader from '@/components/Loader';
import QuizQuestion from '@/components/QuizQuestion';
import { supabase } from '@/supabase-client';
import { advanceLevel, fetchGameById, updateScore, updateTurn } from '@/app/api/quiz-create-question/game';
import { Game, QuizQuestionHandle } from '@/types/types';
import GetReady1 from '@/components/GetReady1';
import { useParams } from 'next/navigation';



// const Quiz = ({ params }: { params: { slug: string } }) => {

export default function Quiz() {

  const params = useParams();
  const slug = params.slug as string;

  const router = useRouter();
  const queryClient = useQueryClient(); // Get the client instance

  // const { slug } = params;

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isQLoading, setIsQLoading] = useState<boolean>(false);

  const [questionsCount, setQuestionsCount] = useState(0);

  const [isReady, setIsReady] = useState(false); // 1. הוספת state חדש למצב הממשק

  const quizQuestionRef = useRef<QuizQuestionHandle>(null);



  const { data: game, error, isLoading } = useQuery<Game>({
    queryKey: ["game", slug],
    queryFn: () => fetchGameById(slug)
  })

  useEffect(() => {
    if (isReady) {
      quizQuestionRef.current?.getNewQuestion();
    }
  }, [isReady]);

  const { mutate: addPoint, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      if (!game) throw new Error("Game data is not available.");
      return updateScore(game);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', slug] });
      quizQuestionRef.current?.getNewQuestion();
    },
    onError: (err) => {
      console.error("Failed to update score:", err);
    }
  });

  const { mutate: advanceLevelMutation, isPending: isAdvancingLevel } = useMutation<any, Error, void>({
    mutationFn: () => {
      if (!game) throw new Error("Game data is not available.");
      return advanceLevel(game);
    },
    onSuccess: () => {
      setQuestionsCount(0);
      setIsReady(false);
      queryClient.invalidateQueries({ queryKey: ['game', slug] });
    },
    onError: (err) => console.error("Failed to advance level:", err),
  });


  const { mutate: changeTurnMutation, isPending: isChangingTurn } = useMutation<any, Error, void>({
    mutationFn: () => {
      if (!game) throw new Error("Game data is not available.");
      return updateTurn(game);
    },
    onSuccess: () => {
      setQuestionsCount(0);
      setIsReady(false);
      queryClient.invalidateQueries({ queryKey: ['game', slug] });
    },
    onError: (err) => console.error("Failed to change player turn:", err),
  });


  if (!isReady) {
    if (game && game?.level === 1 || game && game?.level === 2) {
      return <GetReady1 player={game.is_player1_turn ? game.player1_name : game.player2_name}
        onStart={() => setIsReady(true)} />;
    }
    // Fallback for other levels or completed game
    return <div>Game level: {game?.level}</div>
  }

  if (isLoading) return <Loader />

  if (error) return <div>Error: {error.message}</div>;

  if (!game) router.push(`/not-found`);
  // console.log(game)
  // console.log(game)

  return (
    <div className='flex flex-col items-center h-full justify-around text-center px-6'>


      <button onClick={() => setIsSoundOn(!isSoundOn)}>
        {isSoundOn ? '🔊' : '🔇'}
      </button>

      <h1 className='text-2xl'>
        בהצלחה&nbsp;
        {game.is_player1_turn ? game.player1_name : game.player2_name}
      </h1>




      <QuizQuestion ref={quizQuestionRef} isSoundOn={isSoundOn}
        questionsCount={questionsCount} setQuestionsCount={setQuestionsCount}
        advanceLevelMutation={advanceLevelMutation}
        isAdvancingLevel={isAdvancingLevel}
        changeTurnMutation={changeTurnMutation}
        isQLoading={isQLoading} setIsQLoading={setIsQLoading}
      />


      <div className='w-full'>
        <button hidden={isQLoading}
          onClick={() => addPoint()}
          className="bg-[lime] text-slate-900 border-slate-900 border-2 text-xl py-2 w-full rounded-lg cursor-pointer"
        >
          חירטוט מעולה - נקודה אחת!
        </button>
      </div>




      <div>
        <p>{game.player1_name} {game.player1_score}</p>
        <p>{game.player2_name} {game.player2_score}</p>
      </div>
    </div>
  )
}

// export default Quiz