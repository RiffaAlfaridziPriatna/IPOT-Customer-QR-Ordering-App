export interface CustomizationSelection {
  optionId: number;
  quantity: number;
}

export class CustomizationValidator {
  static validate(
    selections: CustomizationSelection[],
    required: boolean,
    maxSelections: number
  ): { valid: boolean; error?: string } {
    const totalSelections = selections.reduce((sum, s) => sum + s.quantity, 0);

    if (required && totalSelections === 0) {
      return { valid: false, error: 'This customization is required' };
    }

    if (totalSelections > maxSelections) {
      return {
        valid: false,
        error: `You can select up to ${maxSelections} option(s)`,
      };
    }

    return { valid: true };
  }
}
