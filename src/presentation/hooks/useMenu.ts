import { useQuery } from '@tanstack/react-query';
import { menuRepository } from '@data/repositories';
import { MenuData } from '@domain/repositories';

export const useMenu = (tableId: string | null) => {
  return useQuery<MenuData, Error>({
    queryKey: ['menu', tableId],
    queryFn: () => {
      if (!tableId) {
        throw new Error('Table ID is required');
      }
      return menuRepository.getMenuByTableId(tableId);
    },
    enabled: !!tableId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => menuRepository.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
};
