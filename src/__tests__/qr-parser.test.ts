import { parseQRCode, isValidTableQR } from '@utils/qr-parser';
import { TableId } from '@domain/value-objects/TableId';

describe('QR Code Parser', () => {
  describe('parseQRCode', () => {
    it('should parse valid QR code', () => {
      const result = parseQRCode('ipot://table/T001');
      expect(result.success).toBe(true);
      expect(result.tableId).toBeDefined();
      expect(result.tableId?.value).toBe('T001');
    });

    it('should parse QR code with different table ID', () => {
      const result = parseQRCode('ipot://table/TABLE-123');
      expect(result.success).toBe(true);
      expect(result.tableId?.value).toBe('TABLE-123');
    });

    it('should reject QR code with wrong prefix', () => {
      const result = parseQRCode('https://example.com/table/T001');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid QR code format');
    });

    it('should reject QR code with empty table ID', () => {
      const result = parseQRCode('ipot://table/');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Table ID cannot be empty');
    });

    it('should reject QR code with only whitespace as table ID', () => {
      const result = parseQRCode('ipot://table/   ');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Table ID cannot be empty');
    });

    it('should reject completely invalid format', () => {
      const result = parseQRCode('random-string');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject empty string', () => {
      const result = parseQRCode('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('isValidTableQR', () => {
    it('should return true for valid QR code', () => {
      expect(isValidTableQR('ipot://table/T001')).toBe(true);
    });

    it('should return false for invalid QR code', () => {
      expect(isValidTableQR('invalid-qr-code')).toBe(false);
    });

    it('should return false for QR code with wrong format', () => {
      expect(isValidTableQR('ipot://room/T001')).toBe(false);
    });
  });

  describe('TableId value object', () => {
    it('should create TableId from valid QR code', () => {
      const tableId = TableId.fromQRCode('ipot://table/T001');
      expect(tableId.value).toBe('T001');
    });

    it('should create TableId from string', () => {
      const tableId = TableId.fromString('T001');
      expect(tableId.value).toBe('T001');
    });

    it('should generate QR code from TableId', () => {
      const tableId = TableId.fromString('T001');
      expect(tableId.toQRCode()).toBe('ipot://table/T001');
    });

    it('should throw error for invalid QR code format', () => {
      expect(() => TableId.fromQRCode('invalid')).toThrow(
        'Invalid QR code format'
      );
    });

    it('should throw error for empty string', () => {
      expect(() => TableId.fromString('')).toThrow('Table ID cannot be empty');
    });

    it('should compare TableIds correctly', () => {
      const tableId1 = TableId.fromString('T001');
      const tableId2 = TableId.fromString('T001');
      const tableId3 = TableId.fromString('T002');

      expect(tableId1.equals(tableId2)).toBe(true);
      expect(tableId1.equals(tableId3)).toBe(false);
    });

    it('should convert to string correctly', () => {
      const tableId = TableId.fromString('T001');
      expect(tableId.toString()).toBe('T001');
    });
  });
});
