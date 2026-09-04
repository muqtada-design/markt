import { compressAndConvertToBase64 } from '../utils/imageCompressor';

/**
 * تحويل وضغط صورة المنتج مباشرة لـ Base64
 * هذا الخيار مجاني 100% ولا يتطلب أي اشتراك في Firebase Storage ولا أي بطاقة فيزا!
 */
export async function uploadProductImage(_productId: string, file: File): Promise<string> {
  try {
    const base64DataUrl = await compressAndConvertToBase64(file);
    return base64DataUrl;
  } catch (error: any) {
    console.error('خطأ في معالجة الصورة:', error);
    throw new Error('فشل معالجة الصورة. يرجى اختيار صورة أخرى ومحاولة الحفظ مجدداً.');
  }
}

/**
 * حذف صورة المنتج (لا يلزم حرق طلبات لأن الصورة مخزنة مجاناً مع المستند)
 */
export async function deleteProductImage(_productId: string): Promise<void> {
  // لا يلزم إجراء حذف منفصل
}
