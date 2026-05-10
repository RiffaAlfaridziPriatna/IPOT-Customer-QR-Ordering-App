import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@config/theme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  children,
  ...props
}) => {
  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...styles[variant],
    ...styles[`size_${size}`],
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
  };

  const textColor = variant === 'primary' ? '#FFFFFF' : colors.primary;

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : typeof children === 'string' ? (
        <Text variant="button" style={{ color: textColor }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  size_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  size_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
