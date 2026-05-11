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
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text variant="h3" style={{ color: canDecrement ? colors.primary : colors.text.disabled }}>
          -
        </Text>
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text variant="bodyMedium" style={styles.value}>
          {value}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.buttonAdd, !canIncrement && styles.buttonDisabled]}
        onPress={onIncrement}
        disabled={!canIncrement}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text variant="h3" style={{ color: canIncrement ? '#FFFFFF' : colors.text.disabled }}>
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
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAdd: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  valueContainer: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: '600',
    color: colors.text.primary,
  },
});
