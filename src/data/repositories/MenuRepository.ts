import { IMenuRepository, MenuData } from '@domain/repositories';
import { MenuItem, Category } from '@domain/entities';
import { mockApiClient } from '../api/mock-api';
import { mapMenuResponseFromDTO } from '../mappers/menu-mapper';

export class MenuRepository implements IMenuRepository {
  async getMenuByTableId(tableId: string): Promise<MenuData> {
    const response = await mockApiClient.getMenuByTableId(tableId);
    return mapMenuResponseFromDTO(response);
  }

  async getCategories(): Promise<Category[]> {
    const response = await mockApiClient.getCategories();
    return response.map((dto) => ({
      id: dto.id,
      name: dto.name,
      sortOrder: dto.sort_order,
    }));
  }

  async getMenuItemById(itemId: number): Promise<MenuItem | null> {
    const menuData = await this.getMenuByTableId('T001');
    return menuData.items.find((item) => item.id === itemId) || null;
  }
}

export const menuRepository = new MenuRepository();
