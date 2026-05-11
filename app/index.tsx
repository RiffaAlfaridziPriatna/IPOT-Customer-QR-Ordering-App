import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, SCAN_FRAME_SIZE } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { LoadingSpinner } from '@presentation/components/atoms/LoadingSpinner';
import { parseQRCode } from '@utils/qr-parser';
import { useCartStore } from '@state/cart-store';

const CORNER_SIZE = 28;
const CORNER_THICKNESS = 4;
const CORNER_RADIUS = 4;

function ScanCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isTop = position.startsWith('t');
  const isLeft = position.endsWith('l');

  return (
    <View
      style={[
        cornerStyles.base,
        isTop ? { top: -1 } : { bottom: -1 },
        isLeft ? { left: -1 } : { right: -1 },
        {
          borderTopWidth: isTop ? CORNER_THICKNESS : 0,
          borderBottomWidth: !isTop ? CORNER_THICKNESS : 0,
          borderLeftWidth: isLeft ? CORNER_THICKNESS : 0,
          borderRightWidth: !isLeft ? CORNER_THICKNESS : 0,
          borderTopLeftRadius: isTop && isLeft ? CORNER_RADIUS : 0,
          borderTopRightRadius: isTop && !isLeft ? CORNER_RADIUS : 0,
          borderBottomLeftRadius: !isTop && isLeft ? CORNER_RADIUS : 0,
          borderBottomRightRadius: !isTop && !isLeft ? CORNER_RADIUS : 0,
        },
      ]}
    />
  );
}

const cornerStyles = StyleSheet.create({
  base: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#FFFFFF',
  },
});

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const setTableId = useCartStore((state) => state.setTableId);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const result = parseQRCode(data);

    if (result.success && result.tableId) {
      const tableIdValue = result.tableId.value;
      setTableId(tableIdValue);
      router.push(`/menu/${tableIdValue}`);
    } else {
      Alert.alert(
        'Invalid QR Code',
        result.error || 'Please scan a valid table QR code',
        [{ text: 'Try Again', onPress: () => setScanned(false) }]
      );
    }
  };

  if (hasPermission === null) {
    return <LoadingSpinner message="Requesting camera permission..." />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Text style={{ fontSize: 40 }}>{'\uD83D\uDCF7'}</Text>
          </View>
          <Text variant="h2" align="center" style={styles.permissionTitle}>
            Camera Access
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.permissionBody}>
            We need camera permission to scan the QR code on your table
          </Text>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            }}
          >
            Allow Camera
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topSection}>
          <View style={styles.pill}>
            <Text variant="caption" style={styles.pillText}>
              IPOT Ordering
            </Text>
          </View>
          <Text variant="h1" style={styles.title}>
            Scan QR Code
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Point your camera at the code on your table
          </Text>
        </View>

        <View style={styles.frameWrapper}>
          <View style={styles.frame}>
            <ScanCorner position="tl" />
            <ScanCorner position="tr" />
            <ScanCorner position="bl" />
            <ScanCorner position="br" />
          </View>
        </View>

        <View style={styles.bottomSection}>
          {scanned ? (
            <Button variant="outline" onPress={() => setScanned(false)}>
              <Text variant="button" style={{ color: '#FFFFFF' }}>
                Tap to Scan Again
              </Text>
            </Button>
          ) : (
            <Text variant="bodySmall" style={styles.hint}>
              Make sure the QR code is clearly visible
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: spacing.xxl,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  pillText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  frameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.xs,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 80 : 48,
    paddingHorizontal: spacing.xxl,
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  permissionCard: {
    alignItems: 'center',
  },
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  permissionTitle: {
    marginBottom: spacing.sm,
  },
  permissionBody: {
    marginBottom: spacing.xxxl,
    maxWidth: 280,
  },
});
