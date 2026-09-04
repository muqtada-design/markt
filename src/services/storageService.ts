import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';
import { compressProductImage } from '../utils/imageCompressor';

/**
 * رفع صورة المنتج بعد ضغطها وإرجاع رابط التنزيل
 */
export async function uploadProductImage(productId: string, file: File): Promise<string> {
  try {
    // ضغط الصورة قبل الرفع
    const compressed = await compressProductImage(file);
    const storageRef = ref(storage, `products/${productId}/image`);
    
    // رفع الصورة إلى Storage
    const snapshot = await uploadBytes(storageRef, compressed);
    
    // الحصول على رابط التحميل
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error: any) {
    console.error('خطأ في رفع صورة المنتج:', error);
    throw new Error('فشل رفع الصورة إلى Firebase Storage. يرجى التحقق من الاتصال بالإنترنت ومحاولة الرفع مجدداً.');
  }
}

/**
 * حذف صورة المنتج من Firebase Storage
 */
export async function deleteProductImage(productId: string): Promise<void> {
  try {
    const storageRef = ref(storage, `products/${productId}/image`);
    await deleteObject(storageRef);
  } catch (error) {
    // قد لا توجد صورة أو تم حذفها بالفعل
    console.warn('لم يتم حذف الصورة من Storage أو غير موجودة:', error);
  }
}
