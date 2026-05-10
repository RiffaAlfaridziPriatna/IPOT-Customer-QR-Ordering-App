import { Money } from '../value-objects/Money';

export interface CustomizationOption {
  id: number;
  name: string;
  priceModifier: Money;
}

export const createCustomizationOption = (
  id: number,
  name: string,
  priceModifier: number
): CustomizationOption => ({
  id,
  name,
  priceModifier: new Money(priceModifier),
});
