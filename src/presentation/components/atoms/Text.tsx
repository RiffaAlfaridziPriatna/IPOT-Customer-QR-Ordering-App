import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { colors, typography } from '@config/theme';

type TextVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: keyof typeof colors.text | string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const variantStyle = typography[variant];

  const textColor = color
    ? color in colors.text
      ? colors.text[color as keyof typeof colors.text]
      : color
    : colors.text.primary;

  return (
    <RNText
      style={[variantStyle, { color: textColor }, align && { textAlign: align }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};
