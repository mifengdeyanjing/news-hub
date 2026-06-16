import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '@/api/client';

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
