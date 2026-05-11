import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from '../atoms/Text';
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
    const exists = selections.findIndex((s) => s.optionId === option.id);

    if (exists >= 0) {
      onChange(selections.filter((s) => s.optionId !== option.id));
    } else if (group.maxSelections === 1) {
      onChange([{ optionId: option.id, quantity: 1 }]);
    } else if (selections.length < group.maxSelections) {
      onChange([...selections, { optionId: option.id, quantity: 1 }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="h3">{group.name}</Text>
          <Text variant="caption" color="tertiary">
            {group.maxSelections === 1
              ? 'Choose one'
              : `Choose up to ${group.maxSelections}`}
          </Text>
        </View>
        {group.required && (
          <View style={styles.requiredBadge}>
            <Text variant="caption" style={styles.requiredText}>
              Required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.options}>
        {group.options.map((option) => {
          const selected = isSelected(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => toggleOption(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text variant="body">{option.name}</Text>
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
    marginBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  requiredBadge: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  requiredText: {
    color: colors.error,
    fontWeight: '600',
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  priceModifier: {
    color: colors.primary,
    fontWeight: '600',
  },
});
