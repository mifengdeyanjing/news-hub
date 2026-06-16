import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '@/api/client';

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
