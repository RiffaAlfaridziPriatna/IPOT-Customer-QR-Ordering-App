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

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  style,
}) => {
  const badgeStyle = [styles.base, styles[variant], style];

  return (
    <View style={badgeStyle}>
      <Text variant="caption" style={styles.text}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: colors.surface,
  },
  success: {
    backgroundColor: colors.success,
  },
  error: {
    backgroundColor: colors.error,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  info: {
    backgroundColor: colors.info,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
  },
});
