import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { SearchInput } from '@presentation/components/atoms/SearchInput';
import { LoadingSpinner } from '@presentation/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@presentation/components/atoms/ErrorMessage';
import { MenuItemCard } from '@presentation/components/molecules/MenuItemCard';
import { CustomizationGroupSelector } from '@presentation/components/molecules/CustomizationGroupSelector';
import { PriceTag } from '@presentation/components/atoms/PriceTag';
import { QuantityControl } from '@presentation/components/atoms/QuantityControl';
import { useMenu } from '@presentation/hooks/useMenu';
import { useCartStore } from '@state/cart-store';
import { MenuItem } from '@domain/entities';
import { CustomizationSelection, CustomizationValidator } from '@domain/value-objects';

export default function MenuScreen() {
  const { tableId } = useLocalSearchParams<{ tableId: string }>();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useMenu(tableId);
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.getItemCount());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<
    Record<number, CustomizationSelection[]>
  >({});

  const filteredItems = useMemo(() => {
    if (!data) return [];
    let items = data.items;
    if (selectedCategory) items = items.filter((i) => i.categoryId === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [data, selectedCategory, searchQuery]);

  const handleAddToCart = useCallback(() => {
    if (!selectedItem) return;
    const allCustomizations = Object.values(customizations).flat();

    const errors: string[] = [];
    selectedItem.customizationGroups.forEach((g) => {
      const sels = customizations[g.id] || [];
      const v = CustomizationValidator.validate(sels, g.required, g.maxSelections);
      if (!v.valid && v.error) errors.push(`${g.name}: ${v.error}`);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    addItem(selectedItem, quantity, allCustomizations);
    setSelectedItem(null);
    setQuantity(1);
    setCustomizations({});
  }, [selectedItem, customizations, quantity, addItem]);

  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setCustomizations({});
  };

  if (isLoading) return <LoadingSpinner message="Loading menu..." />;

  if (error || !data) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error?.message || 'Failed to load menu'} onRetry={refetch} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">{data.restaurant.name}</Text>
        <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xxs }}>
          Table {tableId}
        </Text>

        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search menu..."
          style={styles.search}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categories}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedCategory && styles.chipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              variant="bodySmall"
              style={{ color: !selectedCategory ? '#FFF' : colors.text.secondary, fontWeight: '600' }}
            >
              All
            </Text>
          </TouchableOpacity>
          {data.categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  variant="bodySmall"
                  style={{ color: active ? '#FFF' : colors.text.secondary, fontWeight: '600' }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onPress={() => openItemDetail(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="body" color="tertiary" align="center">
              No items found
            </Text>
          </View>
        }
      />

      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/cart')}
          activeOpacity={0.85}
        >
          <View style={styles.fabContent}>
            <Text variant="button" style={{ color: '#FFF' }}>
              View Cart
            </Text>
            <View style={styles.fabBadge}>
              <Text variant="caption" style={{ color: colors.primary, fontWeight: '700' }}>
                {itemCount}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={!!selectedItem}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHandle}>
              <View style={styles.handleBar} />
            </View>

            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="h2">{selectedItem.name}</Text>
                <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.xs }}>
                  {selectedItem.description}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedItem(null)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeBtnText}>{'\u2715'}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.priceRow}>
                <Text variant="h3">Base Price</Text>
                <PriceTag price={selectedItem.price} size="medium" />
              </View>

              {selectedItem.customizationGroups.map((group) => (
                <CustomizationGroupSelector
                  key={group.id}
                  group={group}
                  selections={customizations[group.id] || []}
                  onChange={(sels) =>
                    setCustomizations((prev) => ({ ...prev, [group.id]: sels }))
                  }
                />
              ))}

              <View style={styles.quantityRow}>
                <Text variant="h3">Quantity</Text>
                <QuantityControl
                  value={quantity}
                  onIncrement={() => setQuantity(quantity + 1)}
                  onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
                  min={1}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button variant="primary" size="large" fullWidth onPress={handleAddToCart}>
                Add to Cart
              </Button>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  search: {
    marginTop: spacing.md,
  },
  categories: {
    marginTop: spacing.md,
    flexGrow: 0,
  },
  categoriesContent: {
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  empty: {
    padding: spacing.huge,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.lg,
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fabBadge: {
    backgroundColor: '#FFF',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.card,
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceHighlight,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: spacing.xl,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  modalFooter: {
    padding: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
});
