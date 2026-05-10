import { MOCK_API_DELAY } from '@config/api';
import {
  MenuResponseDTO,
  CreateOrderRequestDTO,
  OrderResponseDTO,
  TableStatusDTO,
  CategoryDTO,
} from './types';
import {
  MOCK_MENU_DATA,
  createMockOrder,
  getMockOrder,
  simulateOrderStatusProgression,
} from './mock-data';

const delay = (ms: number = MOCK_API_DELAY): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class MockApiClient {
  async getMenuByTableId(tableId: string): Promise<MenuResponseDTO> {
    await delay();

    if (!tableId || tableId.trim() === '') {
      throw new Error('Invalid table ID');
    }

    return {
      ...MOCK_MENU_DATA,
      restaurant: {
        ...MOCK_MENU_DATA.restaurant,
        table_id: tableId,
      },
    };
  }

  async getCategories(): Promise<CategoryDTO[]> {
    await delay();
    return MOCK_MENU_DATA.categories;
  }

  async createOrder(
    request: CreateOrderRequestDTO
  ): Promise<OrderResponseDTO> {
    await delay();

    if (!request.table_id) {
      throw new Error('Table ID is required');
    }

    if (!request.items || request.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const order = createMockOrder(
      request.table_id,
      request.items,
      request.customer_note
    );

    simulateOrderStatusProgression(order.id);

    return order;
  }

  async getOrderById(orderId: string): Promise<OrderResponseDTO> {
    await delay();

    const order = getMockOrder(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    return order;
  }

  async getOrderStatus(
    orderId: string
  ): Promise<OrderResponseDTO['status']> {
    await delay();

    const order = getMockOrder(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    return order.status;
  }

  async getTableStatus(tableId: string): Promise<TableStatusDTO> {
    await delay();

    return {
      table_id: tableId,
      available: true,
      current_order_id: undefined,
    };
  }
}

export const mockApiClient = new MockApiClient();
