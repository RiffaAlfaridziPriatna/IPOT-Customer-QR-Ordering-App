import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@config/theme';
import { Text } from './Text';
import { Money } from '@domain/value-objects/Money';
import { formatCurrency } from '@utils/formatters';

interface PriceTagProps {
  price: Money;
  size?: 'small' | 'medium' | 'large';
}

export const PriceTag: React.FC<PriceTagProps> = ({ price, size = 'medium' }) => {
  const variant = size === 'small' ? 'caption' : size === 'large' ? 'h2' : 'h3';

  return (
    <Text variant={variant} style={styles.price}>
      {formatCurrency(price)}
    </Text>
  );
};

const styles = StyleSheet.create({
  price: {
    color: colors.text.primary,
    fontWeight: '700',
  },
});
