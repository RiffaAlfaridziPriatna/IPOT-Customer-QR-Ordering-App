import { IOrderRepository } from '@domain/repositories';
import { Order, CreateOrderRequest, OrderStatus } from '@domain/entities';
import { mockApiClient } from '../api/mock-api';
import {
  mapCreateOrderRequestToDTO,
  mapOrderFromDTO,
} from '../mappers/order-mapper';

export class OrderRepository implements IOrderRepository {
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const dto = mapCreateOrderRequestToDTO(request);
    const response = await mockApiClient.createOrder(dto);
    return mapOrderFromDTO(response);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await mockApiClient.getOrderById(orderId);
      return mapOrderFromDTO(response);
    } catch (error) {
      return null;
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const status = await mockApiClient.getOrderStatus(orderId);
    return status;
  }
}

export const orderRepository = new OrderRepository();
