export class TableId {
  private readonly _value: string;
  private static readonly QR_PREFIX = 'ipot://table/';

  private constructor(value: string) {
    this._value = value;
  }

  static fromQRCode(qrCode: string): TableId {
    if (!qrCode.startsWith(this.QR_PREFIX)) {
      throw new Error(`Invalid QR code format. Expected format: ${this.QR_PREFIX}{tableId}`);
    }

    const tableId = qrCode.substring(this.QR_PREFIX.length);
    
    if (!tableId || tableId.trim().length === 0) {
      throw new Error('Table ID cannot be empty');
    }

    return new TableId(tableId);
  }

  static fromString(value: string): TableId {
    if (!value || value.trim().length === 0) {
      throw new Error('Table ID cannot be empty');
    }
    return new TableId(value);
  }

  get value(): string {
    return this._value;
  }

  toQRCode(): string {
    return `${TableId.QR_PREFIX}${this._value}`;
  }

  equals(other: TableId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
