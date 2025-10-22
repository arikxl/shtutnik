import { ApiError, Game } from '@/types/types';
import { updateTurn } from '@/app/api/quiz-create-question/game';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useTurnLogic(game: Game | undefined, slug: string) {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, void>({
        mutationFn: async () => {
            if (!game) throw new Error("Game data is missing.");
            await updateTurn(game);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['game', slug] });
        },
        onError: (err) => {
            console.error('Failed to change player turn', err);
        }
    });
}
