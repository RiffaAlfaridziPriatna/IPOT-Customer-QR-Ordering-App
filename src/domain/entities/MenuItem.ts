import { Money } from '../value-objects/Money';
import { CustomizationGroup } from './CustomizationGroup';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: Money;
  categoryId: number;
  imageUrl: string | null;
  customizationGroups: CustomizationGroup[];
}

export const createMenuItem = (
  id: number,
  name: string,
  description: string,
  price: number,
  categoryId: number,
  imageUrl: string | null,
  customizationGroups: CustomizationGroup[]
): MenuItem => ({
  id,
  name,
  description,
  price: new Money(price),
  categoryId,
  imageUrl,
  customizationGroups,
});
