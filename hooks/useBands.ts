import * as queries from '@/db/queries';
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from './useDatabase';

/**
 * Hook pro získání všech pásem
 */
export function useBands() {
  const db = useDatabase();

  return useQuery({
    queryKey: ['bands', db],
    queryFn: () => queries.getAllBands(db),
  });
}

/**
 * Hook pro získání pouze oficiálních pásem
 */
export function useOfficialBands() {
  const db = useDatabase();

  return useQuery({
    queryKey: ['bands', 'official', db],
    queryFn: () => queries.getOfficialBands(db),
  });
}
