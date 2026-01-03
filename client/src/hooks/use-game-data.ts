import { useQuery } from "@tanstack/react-query";
import type { User, GameProgress } from "@shared/schema";

export function useGameData() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: progress, isLoading: progressLoading } = useQuery<GameProgress[]>({
    queryKey: ["/api/progress"],
  });

  return {
    user,
    progress,
    isLoading: userLoading || progressLoading,
  };
}
