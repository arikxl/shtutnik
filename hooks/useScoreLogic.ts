import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScore } from "@/app/api/quiz-create-question/game";
import { Game, ApiError, QuizQuestionHandle } from "@/types/types";
import { RefObject } from "react";

export function useScoreLogic(
    game: Game | undefined,
    slug: string,
    quizQuestionRef: RefObject<QuizQuestionHandle | null>
) {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number | undefined>({
        mutationFn: async (points = 1) => {
            if (!game) throw new Error("Game data is missing.");
            return await updateScore(game, points);
        },

        onMutate: (points) => {
            queryClient.cancelQueries({ queryKey: ["game", slug] });

            const previousGame = queryClient.getQueryData<Game>(["game", slug]);

            if (previousGame) {
                const optimisticGame = {
                    ...previousGame,
                    player1_score: previousGame.is_player1_turn
                        ? previousGame.player1_score + points
                        : previousGame.player1_score,
                    player2_score: !previousGame.is_player1_turn
                        ? previousGame.player2_score + points
                        : previousGame.player2_score,
                };
                queryClient.setQueryData(["game", slug], optimisticGame);
            }

            return { previousGame };
        },

        onError: (
            _, __, context?: { previousGame?: Game }
        ) => {
            if (context?.previousGame) {
                queryClient.setQueryData(["game", slug], context.previousGame);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["game", slug] });
            quizQuestionRef.current?.getNewQuestion();
        },
    });
}
