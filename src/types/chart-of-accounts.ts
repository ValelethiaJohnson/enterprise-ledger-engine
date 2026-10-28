export enum AccountType {
  ASSET = 'ASSET',                 // Tiền tại ngân hàng / Cổng thanh toán (Stripe)
  LIABILITY = 'LIABILITY',         // Số dư ví khách hàng / Số dư chờ trả cho người bán
  EQUITY = 'EQUITY',               // Vốn chủ sở hữu nền tảng
  REVENUE = 'REVENUE',             // Doanh thu từ phí xử lý thanh toán (Take Rate)
  EXPENSE = 'EXPENSE',             // Chi phí xử lý mạng lưới thẻ (Interchange Fees)
}

export interface AccountMetadata {
  accountId: string;
  accountType: AccountType;
  currency: string;
  allowNegative: boolean;
}
