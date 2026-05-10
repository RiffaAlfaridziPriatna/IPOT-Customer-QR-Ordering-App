import { CustomizationSelection } from '../value-objects/CustomizationSelection';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled';

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  customizations: CustomizationSelection[];
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  customerNote: string;
  status: OrderStatus;
  createdAt: Date;
  estimatedPrepTime?: number;
}

export interface CreateOrderRequest {
  tableId: string;
  items: OrderItem[];
  customerNote: string;
}

export const createOrder = (
  id: string,
  tableId: string,
  items: OrderItem[],
  customerNote: string,
  status: OrderStatus = 'pending',
  createdAt: Date = new Date(),
  estimatedPrepTime?: number
): Order => ({
  id,
  tableId,
  items,
  customerNote,
  status,
  createdAt,
  estimatedPrepTime,
});
