import { CustomizationOption } from './CustomizationOption';

export interface CustomizationGroup {
  id: number;
  name: string;
  required: boolean;
  maxSelections: number;
  options: CustomizationOption[];
}

export const createCustomizationGroup = (
  id: number,
  name: string,
  required: boolean,
  maxSelections: number,
  options: CustomizationOption[]
): CustomizationGroup => ({
  id,
  name,
  required,
  maxSelections,
  options,
});
