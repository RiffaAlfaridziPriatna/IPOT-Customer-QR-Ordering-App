export interface CustomizationOptionDTO {
  id: number;
  name: string;
  price_modifier: number;
}

export interface CustomizationGroupDTO {
  id: number;
  name: string;
  required: boolean;
  max_selections: number;
  options: CustomizationOptionDTO[];
}

export interface MenuItemDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  customization_groups: CustomizationGroupDTO[];
}

export interface CategoryDTO {
  id: number;
  name: string;
  sort_order: number;
}

export interface RestaurantDTO {
  id: string;
  name: string;
  table_id: string;
}

export interface MenuResponseDTO {
  restaurant: RestaurantDTO;
  categories: CategoryDTO[];
  items: MenuItemDTO[];
}

export interface CustomizationDTO {
  option_id: number;
  quantity: number;
}

export interface OrderItemDTO {
  menu_item_id: number;
  quantity: number;
  customizations: CustomizationDTO[];
}

export interface CreateOrderRequestDTO {
  table_id: string;
  items: OrderItemDTO[];
  customer_note: string;
}

export interface OrderResponseDTO {
  id: string;
  table_id: string;
  items: OrderItemDTO[];
  customer_note: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  created_at: string;
  estimated_prep_time?: number;
}

export interface TableStatusDTO {
  table_id: string;
  available: boolean;
  current_order_id?: string;
}
