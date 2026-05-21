export function formatPrice(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatPriceDecimal(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const FREE_DELIVERY_THRESHOLD = 999;
export const SHIPPING_COST = 79;
export const TAX_RATE = 0.18; // 18% GST
