import { useQuery } from '@tanstack/react-query';
import { fetchArticle } from '@/api/client';

export function useArticle(url) {
  return useQuery({
    queryKey: ['article', url],
    queryFn: () => fetchArticle(url),
    enabled: Boolean(url),
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
