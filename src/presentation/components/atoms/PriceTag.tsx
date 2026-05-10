import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@config/theme';
import { Text } from './Text';
import { Money } from '@domain/value-objects/Money';
import { formatCurrency } from '@utils/formatters';

interface PriceTagProps {
  price: Money;
  size?: 'small' | 'medium' | 'large';
  showCurrency?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  size = 'medium',
  showCurrency = true,
}) => {
  const variant = size === 'small' ? 'caption' : size === 'large' ? 'h3' : 'body';
  const formattedPrice = showCurrency ? formatCurrency(price) : price.amount.toFixed(2);

  return (
    <Text variant={variant} style={[styles.price, { color: colors.primary }]}>
      {formattedPrice}
    </Text>
  );
};

const styles = StyleSheet.create({
  price: {
    fontWeight: '700',
  },
});
