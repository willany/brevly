import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteLink } from '../services';

export const useDeleteLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
};
