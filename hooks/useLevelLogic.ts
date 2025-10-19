import { useMutation, useQueryClient } from "@tanstack/react-query";

import { advanceLevel } from "@/app/api/quiz-create-question/game";
import { Game, ApiError } from "@/types/types";

export function useLevelLogic(game: Game | undefined, slug: string) {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, void>({
        mutationFn: async () => {
            if (!game) throw new Error("Game data is missing.");
            await advanceLevel(game);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game", slug] });
        },
        onError: (err) => {
            console.error("Failed to advance level:", err);
        },
    });

}
