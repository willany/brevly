import { useQuery } from '@tanstack/react-query';

import { getLinks } from '../services';

export const useLinks = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
