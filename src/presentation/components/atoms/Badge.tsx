import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from './Text';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

const VARIANT_MAP: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.surface, text: colors.text.secondary },
  success: { bg: colors.successLight, text: colors.success },
  error: { bg: colors.errorLight, text: colors.error },
  warning: { bg: colors.warningLight, text: colors.warning },
  info: { bg: colors.infoLight, text: colors.info },
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, style }) => {
  const v = VARIANT_MAP[variant];

  return (
    <View style={[styles.base, { backgroundColor: v.bg }, style]}>
      <Text variant="caption" style={{ color: v.text, fontWeight: '600' }}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
});
