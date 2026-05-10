import { ITableRepository, TableStatus } from '@domain/repositories';
import { mockApiClient } from '../api/mock-api';

export class TableRepository implements ITableRepository {
  async getTableStatus(tableId: string): Promise<TableStatus> {
    const dto = await mockApiClient.getTableStatus(tableId);
    return {
      tableId: dto.table_id,
      available: dto.available,
      currentOrderId: dto.current_order_id,
    };
  }

  async validateTableId(tableId: string): Promise<boolean> {
    try {
      await this.getTableStatus(tableId);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const tableRepository = new TableRepository();
