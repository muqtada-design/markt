/**
 * تنسيق السعر بالدينار العراقي (د.ع)
 * مثال: 7500 -> 7,500 د.ع
 */
export function formatPrice(price: number): string {
  if (isNaN(price) || price < 0) return '0 د.ع';
  const formatted = new Intl.NumberFormat('ar-IQ', {
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted} د.ع`;
}

/**
 * تنسيق التاريخ باللغة العربية
 */
export function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * تنظيف وتنسيق الباركود
 */
export function sanitizeBarcode(barcode: string): string {
  return barcode.trim();
}
