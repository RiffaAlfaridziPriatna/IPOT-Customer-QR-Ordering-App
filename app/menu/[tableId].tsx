import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { SearchInput } from '@presentation/components/atoms/SearchInput';
import { LoadingSpinner } from '@presentation/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@presentation/components/atoms/ErrorMessage';
import { MenuItemCard } from '@presentation/components/molecules/MenuItemCard';
import { CustomizationGroupSelector } from '@presentation/components/molecules/CustomizationGroupSelector';
import { PriceTag } from '@presentation/components/atoms/PriceTag';
import { Badge } from '@presentation/components/atoms/Badge';
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

    if (selectedCategory) {
      items = items.filter((item) => item.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return items;
  }, [data, selectedCategory, searchQuery]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const allCustomizations = Object.values(customizations).flat();
    
    const validationErrors: string[] = [];
    selectedItem.customizationGroups.forEach((group) => {
      const selections = customizations[group.id] || [];
      const validation = CustomizationValidator.validate(
        selections,
        group.required,
        group.maxSelections
      );
      if (!validation.valid && validation.error) {
        validationErrors.push(`${group.name}: ${validation.error}`);
      }
    });

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    addItem(selectedItem, quantity, allCustomizations);
    setSelectedItem(null);
    setQuantity(1);
    setCustomizations({});
  };

  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setCustomizations({});
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading menu..." />;
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error?.message || 'Failed to load menu'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">{data.restaurant.name}</Text>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search menu..."
          style={styles.search}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              variant="body"
              style={!selectedCategory && styles.categoryChipTextActive}
            >
              All
            </Text>
          </TouchableOpacity>
          {data.categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                variant="body"
                style={
                  selectedCategory === category.id && styles.categoryChipTextActive
                }
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onPress={() => openItemDetail(item)} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="body" color="secondary">
              No items found
            </Text>
          </View>
        }
      />

      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
        >
          <Text variant="button" style={styles.cartButtonText}>
            View Cart ({itemCount})
          </Text>
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
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedItem(null)}>
                <Text variant="h3" style={styles.closeButton}>
                  ✕
                </Text>
              </TouchableOpacity>
              <Text variant="h2">{selectedItem.name}</Text>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text variant="body" color="secondary" style={styles.description}>
                {selectedItem.description}
              </Text>

              <View style={styles.priceRow}>
                <Text variant="h3">Price</Text>
                <PriceTag price={selectedItem.price} size="large" />
              </View>

              {selectedItem.customizationGroups.map((group) => (
                <CustomizationGroupSelector
                  key={group.id}
                  group={group}
                  selections={customizations[group.id] || []}
                  onChange={(selections) =>
                    setCustomizations((prev) => ({
                      ...prev,
                      [group.id]: selections,
                    }))
                  }
                />
              ))}

              <View style={styles.quantitySection}>
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
              <Button
                variant="primary"
                size="large"
                fullWidth
                onPress={handleAddToCart}
              >
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
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  search: {
    marginTop: spacing.md,
  },
  categories: {
    marginTop: spacing.md,
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: spacing.md,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  cartButton: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    marginRight: spacing.md,
    color: colors.text.secondary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  description: {
    marginBottom: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  modalFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
