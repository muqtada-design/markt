import imageCompression from 'browser-image-compression';

/**
 * ضغط الصورة قبل رفعها إلى Firebase Storage
 */
export async function compressProductImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.8, // الحد الأقصى للحجم ~800 كيلوبايت
    maxWidthOrHeight: 1200, // أقصى عرض أو ارتفاع 1200 بكسل
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.warn('فشل ضغط الصورة بواسطة الحزمة، استخدام الملف الأصلي:', error);
    return file;
  }
}
