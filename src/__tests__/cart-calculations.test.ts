import {
  createCartItem,
  calculateCartItemPrice,
  generateCartItemKey,
} from '@domain/entities/CartItem';
import { createMenuItem } from '@domain/entities/MenuItem';
import { createCustomizationGroup } from '@domain/entities/CustomizationGroup';
import { createCustomizationOption } from '@domain/entities/CustomizationOption';
import { Money } from '@domain/value-objects/Money';

describe('Cart Calculations', () => {
  describe('calculateCartItemPrice', () => {
    it('should calculate price for item without customizations', () => {
      const menuItem = createMenuItem(
        1,
        'Green Tea',
        'Hot Japanese green tea',
        3.5,
        3,
        null,
        []
      );

      const cartItem = createCartItem(menuItem, 2, []);
      const price = calculateCartItemPrice(cartItem);

      expect(price.amount).toBe(7.0);
    });

    it('should calculate price with single customization', () => {
      const option = createCustomizationOption(2, 'Truffle Salt', 1.5);
      const group = createCustomizationGroup(1, 'Seasoning', false, 2, [option]);
      const menuItem = createMenuItem(
        1,
        'Edamame',
        'Steamed soybeans',
        5.99,
        1,
        null,
        [group]
      );

      const cartItem = createCartItem(menuItem, 1, [
        { optionId: 2, quantity: 1 },
      ]);
      const price = calculateCartItemPrice(cartItem);

      expect(price.amount).toBe(7.49);
    });

    it('should calculate price with multiple customizations', () => {
      const spiceOption = createCustomizationOption(9, 'Extra Spicy', 1.0);
      const eggOption = createCustomizationOption(10, 'Extra Egg', 2.0);
      const chashuOption = createCustomizationOption(11, 'Extra Chashu', 4.0);

      const spiceGroup = createCustomizationGroup(3, 'Spice Level', true, 1, [
        spiceOption,
      ]);
      const addonsGroup = createCustomizationGroup(4, 'Add-ons', false, 3, [
        eggOption,
        chashuOption,
      ]);

      const menuItem = createMenuItem(
        4,
        'Chicken Ramen',
        'Rich chicken broth',
        14.99,
        2,
        null,
        [spiceGroup, addonsGroup]
      );

      const cartItem = createCartItem(menuItem, 1, [
        { optionId: 9, quantity: 1 },
        { optionId: 10, quantity: 1 },
        { optionId: 11, quantity: 1 },
      ]);
      const price = calculateCartItemPrice(cartItem);

      expect(price.amount).toBe(21.99);
    });

    it('should calculate price with quantity multiplier', () => {
      const option = createCustomizationOption(5, 'Large (12pc)', 8.0);
      const group = createCustomizationGroup(2, 'Size', true, 1, [option]);
      const menuItem = createMenuItem(
        2,
        'Salmon Sashimi',
        'Fresh Norwegian salmon',
        16.99,
        2,
        null,
        [group]
      );

      const cartItem = createCartItem(menuItem, 3, [
        { optionId: 5, quantity: 1 },
      ]);
      const price = calculateCartItemPrice(cartItem);

      expect(price.amount).toBe(74.97);
    });

    it('should handle items with no price modifiers', () => {
      const option = createCustomizationOption(6, 'Mild', 0);
      const group = createCustomizationGroup(3, 'Spice Level', true, 1, [
        option,
      ]);
      const menuItem = createMenuItem(
        4,
        'Chicken Ramen',
        'Rich chicken broth',
        14.99,
        2,
        null,
        [group]
      );

      const cartItem = createCartItem(menuItem, 2, [
        { optionId: 6, quantity: 1 },
      ]);
      const price = calculateCartItemPrice(cartItem);

      expect(price.amount).toBe(29.98);
    });
  });

  describe('generateCartItemKey', () => {
    it('should generate unique key for item without customizations', () => {
      const key = generateCartItemKey(1, []);
      expect(key).toBe('1_');
    });

    it('should generate unique key for item with customizations', () => {
      const key = generateCartItemKey(1, [
        { optionId: 2, quantity: 1 },
        { optionId: 3, quantity: 1 },
      ]);
      expect(key).toBe('1_2:1,3:1');
    });

    it('should generate same key for customizations in different order', () => {
      const key1 = generateCartItemKey(1, [
        { optionId: 3, quantity: 1 },
        { optionId: 2, quantity: 1 },
      ]);
      const key2 = generateCartItemKey(1, [
        { optionId: 2, quantity: 1 },
        { optionId: 3, quantity: 1 },
      ]);
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different quantities', () => {
      const key1 = generateCartItemKey(1, [{ optionId: 2, quantity: 1 }]);
      const key2 = generateCartItemKey(1, [{ optionId: 2, quantity: 2 }]);
      expect(key1).not.toBe(key2);
    });

    it('should generate different keys for different menu items', () => {
      const key1 = generateCartItemKey(1, [{ optionId: 2, quantity: 1 }]);
      const key2 = generateCartItemKey(2, [{ optionId: 2, quantity: 1 }]);
      expect(key1).not.toBe(key2);
    });
  });

  describe('Money value object', () => {
    it('should add money correctly', () => {
      const money1 = new Money(5.99);
      const money2 = new Money(1.5);
      const result = money1.add(money2);
      expect(result.amount).toBe(7.49);
    });

    it('should multiply money correctly', () => {
      const money = new Money(14.99);
      const result = money.multiply(3);
      expect(result.amount).toBe(44.97);
    });

    it('should round to 2 decimal places', () => {
      const money = new Money(3.333);
      expect(money.amount).toBe(3.33);
    });

    it('should not allow negative amounts', () => {
      expect(() => new Money(-5)).toThrow('Amount cannot be negative');
    });
  });
});
