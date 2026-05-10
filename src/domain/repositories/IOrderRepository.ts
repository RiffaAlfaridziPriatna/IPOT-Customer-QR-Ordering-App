import { Order, CreateOrderRequest, OrderStatus } from '../entities/Order';

export interface IOrderRepository {
  createOrder(request: CreateOrderRequest): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | null>;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
}
