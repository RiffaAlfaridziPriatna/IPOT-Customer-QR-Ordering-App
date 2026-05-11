import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { Badge } from '@presentation/components/atoms/Badge';
import { LoadingSpinner } from '@presentation/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@presentation/components/atoms/ErrorMessage';
import { useOrderStatus } from '@presentation/hooks/useOrderStatus';
import { OrderStatus } from '@domain/entities';
import { formatDateTime, formatEstimatedTime } from '@utils/formatters';

type BadgeVariant = 'default' | 'info' | 'warning' | 'success';

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: BadgeVariant; icon: string }> = {
  pending: { label: 'Pending', variant: 'default', icon: '\u23F3' },
  confirmed: { label: 'Confirmed', variant: 'info', icon: '\u2705' },
  preparing: { label: 'Preparing', variant: 'warning', icon: '\uD83D\uDC68\u200D\uD83C\uDF73' },
  ready: { label: 'Ready', variant: 'success', icon: '\uD83C\uDF7D\uFE0F' },
  served: { label: 'Served', variant: 'success', icon: '\u2728' },
  cancelled: { label: 'Cancelled', variant: 'default', icon: '\u274C' },
};

const TIMELINE: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { data: order, isLoading, error, refetch } = useOrderStatus(orderId);

  if (isLoading) return <LoadingSpinner message="Loading order..." />;

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message={error?.message || 'Failed to load order'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const cfg = STATUS_CONFIG[order.status];
  const isCompleted = order.status === 'served' || order.status === 'cancelled';
  const currentIdx = TIMELINE.indexOf(order.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{cfg.icon}</Text>
          <Text variant="h1" align="center">
            {isCompleted ? 'Order Complete' : 'Order Placed'}
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.heroSub}>
            {isCompleted ? 'Thank you for dining with us' : 'Your order is being prepared'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <Text variant="caption" color="tertiary">
                ORDER
              </Text>
              <Text variant="h3" style={{ marginTop: spacing.xxs }}>
                {order.id}
              </Text>
            </View>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailGrid}>
            <DetailPair label="Table" value={order.tableId} />
            <DetailPair label="Placed" value={formatDateTime(order.createdAt)} />
            {order.estimatedPrepTime && !isCompleted && (
              <DetailPair label="Est. Time" value={formatEstimatedTime(order.estimatedPrepTime)} />
            )}
          </View>

          {order.customerNote ? (
            <>
              <View style={styles.cardDivider} />
              <View>
                <Text variant="caption" color="tertiary" style={{ marginBottom: spacing.xs }}>
                  NOTE
                </Text>
                <Text variant="bodySmall" style={{ fontStyle: 'italic' }}>
                  {order.customerNote}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.timelineSection}>
          <Text variant="caption" color="secondary" style={styles.timelineTitle}>
            ORDER PROGRESS
          </Text>
          {TIMELINE.map((status, idx) => {
            const isActive = currentIdx >= idx;
            const isCurrent = order.status === status;
            const isLast = idx === TIMELINE.length - 1;

            return (
              <View key={status} style={styles.timelineRow}>
                <View style={styles.timelineGutter}>
                  <View
                    style={[
                      styles.dot,
                      isActive && styles.dotActive,
                      isCurrent && styles.dotCurrent,
                    ]}
                  >
                    {isActive && <View style={styles.dotInner} />}
                  </View>
                  {!isLast && (
                    <View style={[styles.line, isActive && styles.lineActive]} />
                  )}
                </View>
                <Text
                  variant="body"
                  style={[
                    styles.timelineLabel,
                    isActive && styles.timelineLabelActive,
                    isCurrent && styles.timelineLabelCurrent,
                  ]}
                >
                  {STATUS_CONFIG[status].label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {isCompleted && (
        <View style={styles.footer}>
          <Button variant="primary" size="large" fullWidth onPress={() => router.push('/')}>
            Start New Order
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

function DetailPair({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text variant="caption" color="tertiary">
        {label}
      </Text>
      <Text variant="bodySmall" style={{ marginTop: spacing.xxs }}>
        {value}
      </Text>
    </View>
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
  scrollContent: {
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  heroSub: {
    marginTop: spacing.sm,
  },
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  detailGrid: {
    gap: spacing.md,
  },
  timelineSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  timelineTitle: {
    marginBottom: spacing.lg,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 56,
  },
  timelineGutter: {
    alignItems: 'center',
    width: 28,
    marginRight: spacing.md,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surfaceHighlight,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    borderColor: colors.primary,
  },
  dotCurrent: {
    borderWidth: 2.5,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 1,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  timelineLabel: {
    color: colors.text.tertiary,
    paddingTop: 1,
  },
  timelineLabelActive: {
    color: colors.text.primary,
  },
  timelineLabelCurrent: {
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
});
