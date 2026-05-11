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
  const hasCustomizations = item.customizationGroups.length > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text variant="h3" numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            variant="bodySmall"
            color="secondary"
            numberOfLines={2}
            style={styles.description}
          >
            {item.description}
          </Text>
          <View style={styles.footer}>
            <PriceTag price={item.price} size="medium" />
            {hasCustomizations && (
              <View style={styles.customizeBadge}>
                <Text variant="caption" style={styles.customizeText}>
                  Customize
                </Text>
              </View>
            )}
          </View>
        </View>

        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>
              {item.categoryId === 3 ? '\u2615' : '\uD83C\uDF5C'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.sm,
  },
  content: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customizeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  customizeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
});
