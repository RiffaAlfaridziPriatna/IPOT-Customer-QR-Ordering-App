import { Money } from '../value-objects/Money';
import { CustomizationSelection } from '../value-objects/CustomizationSelection';
import { MenuItem } from './MenuItem';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: CustomizationSelection[];
}

export const createCartItem = (
  menuItem: MenuItem,
  quantity: number,
  customizations: CustomizationSelection[]
): CartItem => ({
  menuItem,
  quantity,
  customizations,
});

export const calculateCartItemPrice = (item: CartItem): Money => {
  let itemPrice = item.menuItem.price;

  item.customizations.forEach((selection) => {
    item.menuItem.customizationGroups.forEach((group) => {
      const option = group.options.find((opt) => opt.id === selection.optionId);
      if (option) {
        itemPrice = itemPrice.add(
          option.priceModifier.multiply(selection.quantity)
        );
      }
    });
  });

  return itemPrice.multiply(item.quantity);
};

export const generateCartItemKey = (
  menuItemId: number,
  customizations: CustomizationSelection[]
): string => {
  const sortedCustomizations = [...customizations].sort(
    (a, b) => a.optionId - b.optionId
  );
  const customizationKey = sortedCustomizations
    .map((c) => `${c.optionId}:${c.quantity}`)
    .join(',');
  return `${menuItemId}_${customizationKey}`;
};
