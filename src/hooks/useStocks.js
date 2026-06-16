import { useQuery } from '@tanstack/react-query';
import { fetchStocks } from '@/api/client';

export function useStocks() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    staleTime: 15 * 1000,
    refetchInterval: 20 * 1000,
    refetchOnWindowFocus: true,
  });
}
