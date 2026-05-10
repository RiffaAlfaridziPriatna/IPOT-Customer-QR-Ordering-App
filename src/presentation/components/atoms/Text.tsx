import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@config/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'button';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: keyof typeof colors.text | string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const variantStyle = typography[variant];
  
  const textColor = color
    ? typeof color === 'string' && color in colors.text
      ? colors.text[color as keyof typeof colors.text]
      : color
    : colors.text.primary;

  return (
    <RNText
      style={[
        variantStyle,
        { color: textColor },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
