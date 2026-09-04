import { compressAndConvertToBase64 } from '../utils/imageCompressor';

/**
 * معالجة صورة المنتج: إما عبر رابط مباشر أو ضغط الملف لـ Base64
 */
export async function uploadProductImage(
  _productId: string,
  file?: File | null,
  imageUrlInput?: string
): Promise<string> {
  // 1. إذا تم استخدام رابط صورة مباشر
  if (imageUrlInput && imageUrlInput.trim()) {
    return imageUrlInput.trim();
  }

  // 2. إذا تم اختيار/التقاط صورة من الجهاز
  if (file) {
    try {
      const base64DataUrl = await compressAndConvertToBase64(file);
      return base64DataUrl;
    } catch (error: any) {
      console.error('خطأ في معالجة الصورة:', error);
      throw new Error('فشل معالجة الصورة. يرجى اختيار صورة أخرى ومحاولة الحفظ مجدداً.');
    }
  }

  return '';
}

/**
 * حذف صورة المنتج (لا يلزم حرق طلبات لأن الصورة مخزنة مجاناً مع المستند)
 */
export async function deleteProductImage(_productId: string): Promise<void> {
  // لا يلزم إجراء حذف منفصل
}
