import { TableId } from '@domain/value-objects';

export interface QRParseResult {
  success: boolean;
  tableId?: TableId;
  error?: string;
}

export const parseQRCode = (qrCode: string): QRParseResult => {
  try {
    const tableId = TableId.fromQRCode(qrCode);
    return {
      success: true,
      tableId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid QR code',
    };
  }
};

export const isValidTableQR = (qrCode: string): boolean => {
  return parseQRCode(qrCode).success;
};
