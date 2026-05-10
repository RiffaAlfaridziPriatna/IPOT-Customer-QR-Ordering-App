import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { CartItemRow } from '@presentation/components/molecules/CartItemRow';
import { PriceTag } from '@presentation/components/atoms/PriceTag';
import { useCartStore } from '@state/cart-store';
import { useSubmitOrder } from '@presentation/hooks/useOrder';
import { formatCurrency } from '@utils/formatters';

export default function CartScreen() {
  const router = useRouter();
  const {
    getCartItems,
    getSubtotal,
    updateQuantity,
    removeItem,
    clearCart,
    tableId,
  } = useCartStore();

  const cartItems = getCartItems();
  const subtotal = getSubtotal();
  const [customerNote, setCustomerNote] = useState('');
  
  const submitOrder = useSubmitOrder();

  const handleSubmitOrder = async () => {
    if (!tableId) {
      Alert.alert('Error', 'Table ID not found');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    const orderItems = cartItems.map((item) => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      customizations: item.customizations,
    }));

    try {
      const order = await submitOrder.mutateAsync({
        tableId,
        items: orderItems,
        customerNote: customerNote.trim(),
      });

      clearCart();
      router.replace(`/order/${order.id}`);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to submit order'
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="h2" style={styles.emptyTitle}>
            Your cart is empty
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyMessage}>
            Add items from the menu to get started
          </Text>
          <Button variant="primary" onPress={() => router.back()}>
            Browse Menu
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.itemsSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Your Items
          </Text>
          {cartItems.map((item, index) => (
            <CartItemRow
              key={`${item.menuItem.id}-${index}`}
              item={item}
              onQuantityChange={(quantity) =>
                updateQuantity(
                  item.menuItem.id,
                  item.customizations,
                  quantity
                )
              }
              onRemove={() =>
                removeItem(item.menuItem.id, item.customizations)
              }
            />
          ))}
        </View>

        <View style={styles.noteSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Special Instructions
          </Text>
          <TextInput
            style={styles.noteInput}
            value={customerNote}
            onChangeText={setCustomerNote}
            placeholder="Any allergies or special requests?"
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.summarySection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Order Summary
          </Text>
          <View style={styles.summaryRow}>
            <Text variant="body" color="secondary">
              Subtotal ({cartItems.length}{' '}
              {cartItems.length === 1 ? 'item' : 'items'})
            </Text>
            <Text variant="body">{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text variant="h2">Total</Text>
            <PriceTag price={subtotal} size="large" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSubmitOrder}
          loading={submitOrder.isPending}
        >
          Place Order
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  itemsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  noteSection: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  noteInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  summarySection: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
