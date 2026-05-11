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
      const group = item.menuItem.customizationGroups.find((g) =>
        g.options.some((opt) => opt.id === selection.optionId)
      );
      return group?.options.find((opt) => opt.id === selection.optionId)?.name || '';
    })
    .filter(Boolean)
    .join(' \u00B7 ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text variant="bodyMedium" numberOfLines={1} style={styles.name}>
            {item.menuItem.name}
          </Text>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.removeIcon}>{'\u2715'}</Text>
          </TouchableOpacity>
        </View>
        {customizationText !== '' && (
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {customizationText}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <QuantityControl
          value={item.quantity}
          onIncrement={() => onQuantityChange(item.quantity + 1)}
          onDecrement={() => {
            if (item.quantity === 1) onRemove();
            else onQuantityChange(item.quantity - 1);
          }}
          min={1}
        />
        <PriceTag price={itemPrice} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  removeIcon: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
