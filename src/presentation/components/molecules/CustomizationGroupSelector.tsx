import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { CustomizationGroup, CustomizationOption } from '@domain/entities';
import { CustomizationSelection } from '@domain/value-objects';
import { formatPrice } from '@utils/formatters';

interface CustomizationGroupSelectorProps {
  group: CustomizationGroup;
  selections: CustomizationSelection[];
  onChange: (selections: CustomizationSelection[]) => void;
}

export const CustomizationGroupSelector: React.FC<CustomizationGroupSelectorProps> = ({
  group,
  selections,
  onChange,
}) => {
  const isSelected = (optionId: number) =>
    selections.some((s) => s.optionId === optionId);

  const toggleOption = (option: CustomizationOption) => {
    const existingIndex = selections.findIndex((s) => s.optionId === option.id);

    if (existingIndex >= 0) {
      const newSelections = selections.filter((s) => s.optionId !== option.id);
      onChange(newSelections);
    } else {
      if (group.maxSelections === 1) {
        onChange([{ optionId: option.id, quantity: 1 }]);
      } else {
        if (selections.length < group.maxSelections) {
          onChange([...selections, { optionId: option.id, quantity: 1 }]);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3">{group.name}</Text>
        {group.required && <Badge variant="error">Required</Badge>}
      </View>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        {group.maxSelections === 1
          ? 'Choose one'
          : `Choose up to ${group.maxSelections}`}
      </Text>

      <View style={styles.options}>
        {group.options.map((option) => {
          const selected = isSelected(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => toggleOption(option)}
            >
              <View style={styles.optionContent}>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text variant="body" style={styles.optionName}>
                  {option.name}
                </Text>
              </View>
              {option.priceModifier.amount > 0 && (
                <Text variant="bodySmall" style={styles.priceModifier}>
                  +{formatPrice(option.priceModifier.amount)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  optionName: {
    flex: 1,
  },
  priceModifier: {
    color: colors.primary,
    fontWeight: '600',
  },
});
