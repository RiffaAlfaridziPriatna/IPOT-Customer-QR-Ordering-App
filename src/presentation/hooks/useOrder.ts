import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderRepository } from '@data/repositories';
import { CreateOrderRequest, Order } from '@domain/entities';

export const useSubmitOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderRequest>({
    mutationFn: (request: CreateOrderRequest) => {
      return orderRepository.createOrder(request);
    },
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order);
    },
  });
};
