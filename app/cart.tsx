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
import { colors, spacing, borderRadius, shadows } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { CartItemRow } from '@presentation/components/molecules/CartItemRow';
import { PriceTag } from '@presentation/components/atoms/PriceTag';
import { useCartStore } from '@state/cart-store';
import { useSubmitOrder } from '@presentation/hooks/useOrder';
import { formatCurrency } from '@utils/formatters';

export default function CartScreen() {
  const router = useRouter();
  const { getCartItems, getSubtotal, updateQuantity, removeItem, clearCart, tableId } =
    useCartStore();

  const cartItems = getCartItems();
  const subtotal = getSubtotal();
  const [customerNote, setCustomerNote] = useState('');
  const submitOrder = useSubmitOrder();

  const handleSubmitOrder = async () => {
    if (!tableId) return Alert.alert('Error', 'Table ID not found');
    if (cartItems.length === 0) return Alert.alert('Error', 'Your cart is empty');

    try {
      const order = await submitOrder.mutateAsync({
        tableId,
        items: cartItems.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          customizations: i.customizations,
        })),
        customerNote: customerNote.trim(),
      });
      clearCart();
      router.replace(`/order/${order.id}`);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 48 }}>{'\uD83D\uDED2'}</Text>
          </View>
          <Text variant="h2" align="center">
            Your cart is empty
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.emptyBody}>
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text variant="caption" color="secondary" style={styles.sectionLabel}>
            YOUR ITEMS
          </Text>
          {cartItems.map((item, index) => (
            <CartItemRow
              key={`${item.menuItem.id}-${index}`}
              item={item}
              onQuantityChange={(qty) =>
                updateQuantity(item.menuItem.id, item.customizations, qty)
              }
              onRemove={() => removeItem(item.menuItem.id, item.customizations)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text variant="caption" color="secondary" style={styles.sectionLabel}>
            SPECIAL INSTRUCTIONS
          </Text>
          <TextInput
            style={styles.noteInput}
            value={customerNote}
            onChangeText={setCustomerNote}
            placeholder="Allergies, preferences..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.section, styles.summaryCard]}>
          <View style={styles.summaryRow}>
            <Text variant="body" color="secondary">
              Items ({cartItems.length})
            </Text>
            <Text variant="body">{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text variant="h3">Total</Text>
            <PriceTag price={subtotal} size="large" />
          </View>
        </View>

        <View style={{ height: 120 }} />
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
    padding: spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: spacing.xxl,
  },
  emptyBody: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    maxWidth: 240,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.md,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  noteInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 80,
    ...shadows.sm,
  },
  summaryCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
});
