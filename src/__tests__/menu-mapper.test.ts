import {
  mapMenuItemFromDTO,
  mapCategoryFromDTO,
  mapRestaurantFromDTO,
  mapCustomizationOptionFromDTO,
  mapCustomizationGroupFromDTO,
} from '@data/mappers/menu-mapper';
import {
  MenuItemDTO,
  CategoryDTO,
  RestaurantDTO,
  CustomizationOptionDTO,
  CustomizationGroupDTO,
} from '@data/api/types';

describe('Menu Mappers', () => {
  describe('mapCustomizationOptionFromDTO', () => {
    it('should map customization option correctly', () => {
      const dto: CustomizationOptionDTO = {
        id: 1,
        name: 'Sea Salt',
        price_modifier: 0,
      };

      const option = mapCustomizationOptionFromDTO(dto);

      expect(option.id).toBe(1);
      expect(option.name).toBe('Sea Salt');
      expect(option.priceModifier.amount).toBe(0);
    });

    it('should map customization option with price modifier', () => {
      const dto: CustomizationOptionDTO = {
        id: 2,
        name: 'Truffle Salt',
        price_modifier: 1.5,
      };

      const option = mapCustomizationOptionFromDTO(dto);

      expect(option.id).toBe(2);
      expect(option.name).toBe('Truffle Salt');
      expect(option.priceModifier.amount).toBe(1.5);
    });
  });

  describe('mapCustomizationGroupFromDTO', () => {
    it('should map customization group correctly', () => {
      const dto: CustomizationGroupDTO = {
        id: 1,
        name: 'Seasoning',
        required: false,
        max_selections: 2,
        options: [
          { id: 1, name: 'Sea Salt', price_modifier: 0 },
          { id: 2, name: 'Truffle Salt', price_modifier: 1.5 },
        ],
      };

      const group = mapCustomizationGroupFromDTO(dto);

      expect(group.id).toBe(1);
      expect(group.name).toBe('Seasoning');
      expect(group.required).toBe(false);
      expect(group.maxSelections).toBe(2);
      expect(group.options).toHaveLength(2);
      expect(group.options[0].name).toBe('Sea Salt');
      expect(group.options[1].name).toBe('Truffle Salt');
    });
  });

  describe('mapMenuItemFromDTO', () => {
    it('should map simple menu item correctly', () => {
      const dto: MenuItemDTO = {
        id: 3,
        name: 'Green Tea',
        description: 'Hot Japanese green tea',
        price: 3.5,
        category_id: 3,
        image_url: null,
        customization_groups: [],
      };

      const menuItem = mapMenuItemFromDTO(dto);

      expect(menuItem.id).toBe(3);
      expect(menuItem.name).toBe('Green Tea');
      expect(menuItem.description).toBe('Hot Japanese green tea');
      expect(menuItem.price.amount).toBe(3.5);
      expect(menuItem.categoryId).toBe(3);
      expect(menuItem.imageUrl).toBeNull();
      expect(menuItem.customizationGroups).toHaveLength(0);
    });

    it('should map menu item with customizations', () => {
      const dto: MenuItemDTO = {
        id: 1,
        name: 'Edamame',
        description: 'Steamed soybeans with sea salt',
        price: 5.99,
        category_id: 1,
        image_url: null,
        customization_groups: [
          {
            id: 1,
            name: 'Seasoning',
            required: false,
            max_selections: 2,
            options: [
              { id: 1, name: 'Sea Salt', price_modifier: 0 },
              { id: 2, name: 'Truffle Salt', price_modifier: 1.5 },
            ],
          },
        ],
      };

      const menuItem = mapMenuItemFromDTO(dto);

      expect(menuItem.id).toBe(1);
      expect(menuItem.name).toBe('Edamame');
      expect(menuItem.customizationGroups).toHaveLength(1);
      expect(menuItem.customizationGroups[0].name).toBe('Seasoning');
      expect(menuItem.customizationGroups[0].options).toHaveLength(2);
    });

    it('should map menu item with image URL', () => {
      const dto: MenuItemDTO = {
        id: 1,
        name: 'Edamame',
        description: 'Steamed soybeans',
        price: 5.99,
        category_id: 1,
        image_url: 'https://example.com/edamame.jpg',
        customization_groups: [],
      };

      const menuItem = mapMenuItemFromDTO(dto);

      expect(menuItem.imageUrl).toBe('https://example.com/edamame.jpg');
    });
  });

  describe('mapCategoryFromDTO', () => {
    it('should map category correctly', () => {
      const dto: CategoryDTO = {
        id: 1,
        name: 'Appetizers',
        sort_order: 1,
      };

      const category = mapCategoryFromDTO(dto);

      expect(category.id).toBe(1);
      expect(category.name).toBe('Appetizers');
      expect(category.sortOrder).toBe(1);
    });
  });

  describe('mapRestaurantFromDTO', () => {
    it('should map restaurant correctly', () => {
      const dto: RestaurantDTO = {
        id: 'R001',
        name: 'Sushi Zen',
        table_id: 'T001',
      };

      const restaurant = mapRestaurantFromDTO(dto);

      expect(restaurant.id).toBe('R001');
      expect(restaurant.name).toBe('Sushi Zen');
      expect(restaurant.tableId).toBe('T001');
    });
  });
});
