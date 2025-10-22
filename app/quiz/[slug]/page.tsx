'use client'
import { useRouter, useParams } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Temp from '@/components/Temp';
import Loader from '@/components/Loader';
import GetReady1 from '@/components/GetReady1';
import GetReady2 from '@/components/GetReady2';
import QuizQuestion from '@/components/QuizQuestion';
import { btnStyles2 } from '@/utils/utils';
import { useScoreLogic } from '@/hooks/useScoreLogic';
import { useLevelLogic } from '@/hooks/useLevelLogic';
import { ApiError, Game, QuizQuestionHandle } from '@/types/types';
import { fetchGameById, updateTurn } from '@/app/api/quiz-create-question/game';
import { useTurnLogic } from '@/hooks/useTurnLogic';


export default function Quiz() {

  const params = useParams();
  const slug = params.slug as string;

  const router = useRouter();
  const queryClient = useQueryClient();


  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isQLoading, setIsQLoading] = useState<boolean>(false);
  const [questionsCount, setQuestionsCount] = useState(0);


  const [isReady, setIsReady] = useState(false);

  const quizQuestionRef = useRef<QuizQuestionHandle | null>(null);
  
  
  
  const { data: game, error, isLoading } = useQuery<Game>({
    queryKey: ["game", slug],
    queryFn: () => fetchGameById(slug)
  })

  const advanceLevelMutation = useLevelLogic(game, slug);
  const updateScoreMutation = useScoreLogic(game, slug, quizQuestionRef);


  useEffect(() => {
    if (isReady) {
      quizQuestionRef.current?.getNewQuestion();
    }
  }, [isReady]);



  const changeTurnMutation = useTurnLogic(game, slug);


  if (isLoading) return <Loader />
  if (error) return <div>Error: {error.message}</div>;
  if (!game) {
    router.push(`/not-found`);
    return null;
  }

  if (!isReady && game) {
    switch (game.level) {
      case 1:
      case 2:
        return (
          <GetReady1
            player={game.is_player1_turn ? game.player1_name : game.player2_name}
            onStart={() => setIsReady(true)}
          />
        );
      case 3:
        return (
          <GetReady2
            game={game}
            onStart={() => setIsReady(true)}
          />
        );
      default:
        return <Temp game={game} />;
    }
  }






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
        advanceLevelMutation={advanceLevelMutation.mutate}
        isAdvancingLevel={advanceLevelMutation.isPending}
        changeTurnMutation={changeTurnMutation.mutate}
        isQLoading={isQLoading} setIsQLoading={setIsQLoading}
        level={game.level}
        setIsReady={setIsReady}
      />


      <div className='w-full'>
        <style>{btnStyles2}</style>

        <button hidden={isQLoading}
          // onClick={() => addPoint()}
          onClick={() => updateScoreMutation.mutate(2)}
          id='btn'
        >
          2 נקודות על חרטוט מעולה!
        </button>
      </div>


      <div>
        <p>{game.player1_name} {game.player1_score}</p>
        <p>{game.player2_name} {game.player2_score}</p>
      </div>
    </div>
  )
}
