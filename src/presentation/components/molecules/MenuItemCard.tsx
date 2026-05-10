import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@config/theme';
import { Text } from '../atoms/Text';
import { PriceTag } from '../atoms/PriceTag';
import { MenuItem } from '@domain/entities';

interface MenuItemCardProps {
  item: MenuItem;
  onPress: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text variant="h3" numberOfLines={1}>
          {item.name}
        </Text>
        <Text variant="bodySmall" color="secondary" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <PriceTag price={item.price} />
          {item.customizationGroups.length > 0 && (
            <Text variant="caption" style={styles.customizable}>
              Customizable
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.md,
  },
  description: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customizable: {
    color: colors.accent,
    fontStyle: 'italic',
  },
});
