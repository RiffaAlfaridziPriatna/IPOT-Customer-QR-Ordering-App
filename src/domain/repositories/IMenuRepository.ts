import { MenuItem } from '../entities/MenuItem';
import { Category } from '../entities/Category';
import { Restaurant } from '../entities/Restaurant';

export interface MenuData {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

export interface IMenuRepository {
  getMenuByTableId(tableId: string): Promise<MenuData>;
  getCategories(): Promise<Category[]>;
  getMenuItemById(itemId: number): Promise<MenuItem | null>;
}
