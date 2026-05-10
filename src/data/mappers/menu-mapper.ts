import {
  MenuItem,
  createMenuItem,
  Category,
  createCategory,
  Restaurant,
  createRestaurant,
  CustomizationGroup,
  createCustomizationGroup,
  CustomizationOption,
  createCustomizationOption,
} from '@domain/entities';
import {
  MenuResponseDTO,
  MenuItemDTO,
  CategoryDTO,
  RestaurantDTO,
  CustomizationGroupDTO,
  CustomizationOptionDTO,
} from '../api/types';

export const mapCustomizationOptionFromDTO = (
  dto: CustomizationOptionDTO
): CustomizationOption => {
  return createCustomizationOption(dto.id, dto.name, dto.price_modifier);
};

export const mapCustomizationGroupFromDTO = (
  dto: CustomizationGroupDTO
): CustomizationGroup => {
  return createCustomizationGroup(
    dto.id,
    dto.name,
    dto.required,
    dto.max_selections,
    dto.options.map(mapCustomizationOptionFromDTO)
  );
};

export const mapMenuItemFromDTO = (dto: MenuItemDTO): MenuItem => {
  return createMenuItem(
    dto.id,
    dto.name,
    dto.description,
    dto.price,
    dto.category_id,
    dto.image_url,
    dto.customization_groups.map(mapCustomizationGroupFromDTO)
  );
};

export const mapCategoryFromDTO = (dto: CategoryDTO): Category => {
  return createCategory(dto.id, dto.name, dto.sort_order);
};

export const mapRestaurantFromDTO = (dto: RestaurantDTO): Restaurant => {
  return createRestaurant(dto.id, dto.name, dto.table_id);
};

export const mapMenuResponseFromDTO = (dto: MenuResponseDTO) => {
  return {
    restaurant: mapRestaurantFromDTO(dto.restaurant),
    categories: dto.categories.map(mapCategoryFromDTO),
    items: dto.items.map(mapMenuItemFromDTO),
  };
};
