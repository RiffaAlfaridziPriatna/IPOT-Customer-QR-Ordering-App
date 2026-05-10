import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from './Text';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Something went wrong
      </Text>
      <Text variant="body" color="secondary" style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button variant="outline" size="small" onPress={onRetry} style={styles.button}>
          Try Again
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    margin: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.error,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
});
