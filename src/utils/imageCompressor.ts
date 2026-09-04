import imageCompression from 'browser-image-compression';

/**
 * تحويل وضغط الصورة إلى Base64 بحجم خفيف جداً (~30-50 كيلوبايت)
 * يُتيح حفظ الصورة مجاناً وبشكل مباشر داخل Firestore دون الحاجة لاشتراك Firebase Storage أو أي فيزا
 */
export async function compressAndConvertToBase64(file: File): Promise<string> {
  // 1. ضغط أول بالمكتبة إن أمكن
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, {
      maxSizeMB: 0.1, // حجم أقصى 100 كيلوبايت
      maxWidthOrHeight: 600, // أقصى أبعاد 600 بكسل
      useWebWorker: true,
      fileType: 'image/jpeg',
    });
  } catch (e) {
    console.warn('استخدام ضغط القماش (Canvas):', e);
  }

  // 2. التحويل لـ Canvas وزيادة الضغط لـ 600px ليكون الحجم خفيفاً جداً
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // ضغط الصورة بدقة JPEG وتحديد جودة 0.65 لتقليل الحجم للغاية
        const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.onerror = () => resolve('');
  });
}
