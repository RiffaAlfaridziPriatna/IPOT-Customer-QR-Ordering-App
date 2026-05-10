import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from '../atoms/Text';
import { PriceTag } from '../atoms/PriceTag';
import { QuantityControl } from '../atoms/QuantityControl';
import { CartItem, calculateCartItemPrice } from '@domain/entities';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const itemPrice = calculateCartItemPrice(item);
  
  const customizationText = item.customizations
    .map((selection) => {
      const customizationGroup = item.menuItem.customizationGroups.find((group) =>
        group.options.some((opt) => opt.id === selection.optionId)
      );
      const option = customizationGroup?.options.find(
        (opt) => opt.id === selection.optionId
      );
      return option ? option.name : '';
    })
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="body" style={styles.name}>
          {item.menuItem.name}
        </Text>
        {customizationText && (
          <Text variant="caption" color="secondary" style={styles.customizations}>
            {customizationText}
          </Text>
        )}
        <View style={styles.footer}>
          <QuantityControl
            value={item.quantity}
            onIncrement={() => onQuantityChange(item.quantity + 1)}
            onDecrement={() => {
              if (item.quantity === 1) {
                onRemove();
              } else {
                onQuantityChange(item.quantity - 1);
              }
            }}
            min={1}
          />
          <PriceTag price={itemPrice} />
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text variant="caption" style={styles.removeText}>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  customizations: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  removeText: {
    color: colors.error,
    fontSize: 20,
  },
});
