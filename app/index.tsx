import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@config/theme';
import { Text } from '@presentation/components/atoms/Text';
import { Button } from '@presentation/components/atoms/Button';
import { LoadingSpinner } from '@presentation/components/atoms/LoadingSpinner';
import { parseQRCode } from '@utils/qr-parser';
import { useCartStore } from '@state/cart-store';

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

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
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
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  if (hasPermission === null) {
    return <LoadingSpinner message="Requesting camera permission..." />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text variant="h2" style={styles.centerText}>
          Camera Permission Required
        </Text>
        <Text variant="body" color="secondary" style={styles.message}>
          Please grant camera access to scan QR codes
        </Text>
        <Button
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text variant="h2" style={styles.title}>
              Scan Table QR Code
            </Text>
            <Text variant="body" style={styles.subtitle}>
              Position the QR code within the frame
            </Text>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>

          {scanned && (
            <View style={styles.footer}>
              <Button variant="secondary" onPress={() => setScanned(false)}>
                Scan Again
              </Button>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  corner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: '#FFFFFF',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    borderLeftWidth: 0,
    borderRightWidth: 4,
    left: undefined,
    right: 0,
  },
  cornerBottomLeft: {
    borderTopWidth: 0,
    borderBottomWidth: 4,
    top: undefined,
    bottom: 0,
  },
  cornerBottomRight: {
    borderTopWidth: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 0,
    borderRightWidth: 4,
    top: undefined,
    bottom: 0,
    left: undefined,
    right: 0,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
