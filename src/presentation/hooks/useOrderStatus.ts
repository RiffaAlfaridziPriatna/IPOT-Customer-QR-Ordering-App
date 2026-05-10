import { useQuery } from '@tanstack/react-query';
import { orderRepository } from '@data/repositories';
import { Order } from '@domain/entities';

export const useOrderStatus = (orderId: string | null, enabled: boolean = true) => {
  return useQuery<Order | null, Error>({
    queryKey: ['order', orderId],
    queryFn: () => {
      if (!orderId) {
        return null;
      }
      return orderRepository.getOrderById(orderId);
    },
    enabled: !!orderId && enabled,
    refetchInterval: (query) => {
      const order = query.state.data;
      if (!order) return false;
      
      if (order.status === 'served' || order.status === 'cancelled') {
        return false;
      }
      
      return 3000;
    },
    retry: 2,
  });
};
