export interface TableStatus {
  tableId: string;
  available: boolean;
  currentOrderId?: string;
}

export interface ITableRepository {
  getTableStatus(tableId: string): Promise<TableStatus>;
  validateTableId(tableId: string): Promise<boolean>;
}
