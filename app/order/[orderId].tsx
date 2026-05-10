import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { Badge } from '@presentation/components/atoms/Badge';
import { LoadingSpinner } from '@presentation/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@presentation/components/atoms/ErrorMessage';
import { useOrderStatus } from '@presentation/hooks/useOrderStatus';
import { OrderStatus } from '@domain/entities';
import { formatDateTime, formatEstimatedTime } from '@utils/formatters';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'info' | 'warning' | 'success' }
> = {
  pending: { label: 'Pending', variant: 'default' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  preparing: { label: 'Preparing', variant: 'warning' },
  ready: { label: 'Ready', variant: 'success' },
  served: { label: 'Served', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { data: order, isLoading, error, refetch } = useOrderStatus(orderId);

  if (isLoading) {
    return <LoadingSpinner message="Loading order..." />;
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage
          message={error?.message || 'Failed to load order'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];
  const isCompleted = order.status === 'served' || order.status === 'cancelled';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.successSection}>
          <Text variant="h1" style={styles.successIcon}>
            {isCompleted ? '✓' : '🍽️'}
          </Text>
          <Text variant="h2" style={styles.successTitle}>
            {isCompleted ? 'Order Complete!' : 'Order Received'}
          </Text>
          <Text variant="body" color="secondary" style={styles.successMessage}>
            {isCompleted
              ? 'Thank you for your order!'
              : 'Your order is being prepared'}
          </Text>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text variant="caption" color="secondary">
                Order ID
              </Text>
              <Text variant="h3">{order.id}</Text>
            </View>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text variant="body" color="secondary">
                Table
              </Text>
              <Text variant="body">{order.tableId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="body" color="secondary">
                Placed at
              </Text>
              <Text variant="body">{formatDateTime(order.createdAt)}</Text>
            </View>
            {order.estimatedPrepTime && !isCompleted && (
              <View style={styles.detailRow}>
                <Text variant="body" color="secondary">
                  Estimated time
                </Text>
                <Text variant="body">
                  {formatEstimatedTime(order.estimatedPrepTime)}
                </Text>
              </View>
            )}
          </View>

          {order.customerNote && (
            <>
              <View style={styles.divider} />
              <View style={styles.noteSection}>
                <Text variant="bodySmall" color="secondary">
                  Special Instructions
                </Text>
                <Text variant="body" style={styles.note}>
                  {order.customerNote}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.statusSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Order Status
          </Text>
          <View style={styles.statusTimeline}>
            {(['pending', 'confirmed', 'preparing', 'ready', 'served'] as const).map(
              (status, index, array) => {
                const isActive = array.indexOf(order.status) >= index;
                const isCurrent = order.status === status;

                return (
                  <View key={status} style={styles.timelineItem}>
                    <View style={styles.timelineIndicator}>
                      <View
                        style={[
                          styles.timelineDot,
                          isActive && styles.timelineDotActive,
                          isCurrent && styles.timelineDotCurrent,
                        ]}
                      >
                        {isActive && (
                          <View style={styles.timelineDotInner} />
                        )}
                      </View>
                      {index < array.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            isActive && styles.timelineLineActive,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text
                        variant="body"
                        style={[
                          styles.timelineLabel,
                          isActive && styles.timelineLabelActive,
                        ]}
                      >
                        {STATUS_CONFIG[status].label}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>
      </ScrollView>

      {isCompleted && (
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/')}
          >
            Start New Order
          </Button>
        </View>
      )}
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
  successSection: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  successTitle: {
    marginBottom: spacing.sm,
  },
  successMessage: {
    textAlign: 'center',
  },
  orderCard: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  orderDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteSection: {
    gap: spacing.xs,
  },
  note: {
    fontStyle: 'italic',
  },
  statusSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  statusTimeline: {
    paddingLeft: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    borderColor: colors.primary,
  },
  timelineDotCurrent: {
    borderWidth: 3,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  timelineLineActive: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineLabel: {
    color: colors.text.secondary,
  },
  timelineLabelActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
