/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react' // ⭐️ 1. לייבא את useRef
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Loader from '@/components/Loader';
import QuizQuestion from '@/components/QuizQuestion';
import { supabase } from '@/supabase-client';
import { advanceLevel, fetchGameById, updateScoreAndTurn } from '@/app/api/quiz-create-question/game';
import { Game, QuizQuestionHandle } from '@/types/types';
import GetReady1 from '@/components/GetReady1';



const Quiz = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();

  const queryClient = useQueryClient(); // Get the client instance

  const { slug } = params;

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  const [questionsCount, setQuestionsCount] = useState(0);

  const quizQuestionRef = useRef<QuizQuestionHandle>(null);

  const [isReady, setIsReady] = useState(false); // 1. הוספת state חדש למצב הממשק



  const { data: game, error, isLoading } = useQuery<Game>({
    queryKey: ["game", slug],
    queryFn: () => fetchGameById(slug)
  })

  useEffect(() => {
    // כאשר isReady הופך ל-true, המשחק מוכן להתחיל.
    // אנחנו קוראים לפונקציה כדי להביא את השאלה הראשונה.
    // זה מבטיח שהיא תיקרא פעם אחת בלבד בתחילת כל שלב.
    if (isReady) {
      quizQuestionRef.current?.getNewQuestion();
    }
  }, [isReady]);

  const { mutate: addPoint, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      if (!game) throw new Error("Game data is not available.");
      return updateScoreAndTurn(game);
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


  // if (game && game.level === 1) return <GetReady1 game={game}
  //   onAdvanceLevel={() => advanceLevelMutation()}
  //   isAdvancing={isAdvancingLevel}
  // />;


  if (!isReady) {
    if (game.level === 1) {
      // הקומפוננטה מקבלת פונקציה שמעדכנת את ה-state המקומי
      return <GetReady1 game={game} onStart={() => setIsReady(true)} />;
    }
    if (game.level === 2) {
      // כאן תוכל להוסיף קומפוננטת הכנה לשלב 2
      return <div>Get Ready for Level 2!</div>;
    }
    // Fallback for other levels or completed game
    return <div>Game level: {game.level}</div>
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
      />

      <div className='w-full'>
        <button disabled={isUpdating}
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

export default Quiz