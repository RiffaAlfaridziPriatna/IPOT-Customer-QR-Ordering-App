import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from './Text';

interface QuantityControlProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canDecrement && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={!canDecrement}
      >
        <Text variant="h3" style={styles.buttonText}>
          −
        </Text>
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text variant="body" style={styles.value}>
          {value}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !canIncrement && styles.buttonDisabled]}
        onPress={onIncrement}
        disabled={!canIncrement}
      >
        <Text variant="h3" style={styles.buttonText}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: colors.primary,
  },
  valueContainer: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  value: {
    fontWeight: '600',
  },
});
