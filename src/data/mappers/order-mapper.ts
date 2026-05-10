import { Order, createOrder, OrderItem, CreateOrderRequest } from '@domain/entities';
import {
  OrderResponseDTO,
  CreateOrderRequestDTO,
  OrderItemDTO,
  CustomizationDTO,
} from '../api/types';
import { CustomizationSelection } from '@domain/value-objects';

export const mapCustomizationToDTO = (
  selection: CustomizationSelection
): CustomizationDTO => ({
  option_id: selection.optionId,
  quantity: selection.quantity,
});

export const mapCustomizationFromDTO = (
  dto: CustomizationDTO
): CustomizationSelection => ({
  optionId: dto.option_id,
  quantity: dto.quantity,
});

export const mapOrderItemToDTO = (item: OrderItem): OrderItemDTO => ({
  menu_item_id: item.menuItemId,
  quantity: item.quantity,
  customizations: item.customizations.map(mapCustomizationToDTO),
});

export const mapOrderItemFromDTO = (dto: OrderItemDTO): OrderItem => ({
  menuItemId: dto.menu_item_id,
  quantity: dto.quantity,
  customizations: dto.customizations.map(mapCustomizationFromDTO),
});

export const mapCreateOrderRequestToDTO = (
  request: CreateOrderRequest
): CreateOrderRequestDTO => ({
  table_id: request.tableId,
  items: request.items.map(mapOrderItemToDTO),
  customer_note: request.customerNote,
});

export const mapOrderFromDTO = (dto: OrderResponseDTO): Order => {
  return createOrder(
    dto.id,
    dto.table_id,
    dto.items.map(mapOrderItemFromDTO),
    dto.customer_note,
    dto.status,
    new Date(dto.created_at),
    dto.estimated_prep_time
  );
};
