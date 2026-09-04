import React, { useState, useRef, useEffect } from 'react';
import { ProductFormData } from '../../types/product';
import { Camera, Upload, ScanLine, AlertCircle, Save, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { CameraScannerModal } from '../scanner/CameraScannerModal';

interface ProductFormProps {
  initialData?: {
    name: string;
    barcode: string;
    price: number | string;
    imageUrl?: string;
  };
  onSubmit: (formData: ProductFormData) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'حفظ المنتج',
  isSubmitting = false,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [barcode, setBarcode] = useState(initialData?.barcode || '');
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : ''
  );

  // نمط إضافة الصورة (رفع/التقاط من الجهاز أو رابط صورة مباشر)
  const isInitialUrl = initialData?.imageUrl && !initialData.imageUrl.startsWith('data:');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(isInitialUrl ? 'url' : 'upload');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>(
    isInitialUrl ? initialData.imageUrl! : ''
  );
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const [formError, setFormError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديث القيم إذا تغيّرت البيانات الابتدائية (مثل القدوم من مسح باركود)
  useEffect(() => {
    if (initialData?.barcode && !barcode) {
      setBarcode(initialData.barcode);
    }
  }, [initialData?.barcode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormError(null);
    }
  };

  const handleUrlInputChange = (val: string) => {
    setImageUrlInput(val);
    setImagePreview(val.trim() ? val.trim() : null);
  };

  const handleBarcodeScanned = (scannedCode: string) => {
    setBarcode(scannedCode);
    setIsScannerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('اسم المنتج مطلوب');
      return;
    }
    if (!barcode.trim()) {
      setFormError('رقم الباركود مطلوب');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setFormError('يرجى إدخال سعر صالح (أرقام فقط)');
      return;
    }

    if (imageMode === 'upload' && !imagePreview && !imageFile) {
      setFormError('صورة المنتج مطلوبة (يرجى اختيار صورة من الجهاز أو إضافة رابط مباشر)');
      return;
    }
    if (imageMode === 'url' && !imageUrlInput.trim() && !imagePreview) {
      setFormError('يرجى إدخال رابط صورة مباشر أو التبديل لخيار رفع الصورة');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        barcode: barcode.trim(),
        price: Number(price),
        imageFile: imageMode === 'upload' ? imageFile : null,
        imageUrlInput: imageMode === 'url' ? imageUrlInput.trim() : '',
      });
    } catch (err: any) {
      setFormError(err.message || 'حدث خطأ أثناء حفظ البيانات');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {formError && (
          <div className="alert alert-danger">
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {/* 1. Product Image Picker with Dual Mode (Upload/Camera vs Direct URL) */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>صورة المنتج *</span>
          </label>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setImageMode('upload');
                setFormError(null);
              }}
              className={`btn ${imageMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <Camera size={16} />
              <span>رفع / كاميرا الجهاز</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImageMode('url');
                setFormError(null);
              }}
              className={`btn ${imageMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <LinkIcon size={16} />
              <span>رابط صورة مباشر (URL)</span>
            </button>
          </div>

          {/* Mode 1: File Upload / Camera Capture */}
          {imageMode === 'upload' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                height: '200px',
                borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="معاينة المنتج"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => {
                      setFormError('فشل تحميل المعاينة للصورة');
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Camera size={14} />
                    تغيير الصورة
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                  <Upload size={36} color="var(--primary)" style={{ marginBottom: '8px' }} />
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>اختر صورة من الجهاز أو التقط من الكاميرا</p>
                  <span style={{ fontSize: '0.8rem' }}>انقر هنا لرفع الصورة</span>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Direct Image URL */}
          {imageMode === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="url"
                className="form-input"
                placeholder="ضع رابط الصورة المباشر (مثال: https://example.com/image.jpg)"
                value={imageUrlInput}
                onChange={(e) => handleUrlInputChange(e.target.value)}
                style={{ direction: 'ltr', textAlign: 'left' }}
              />

              {/* Live Preview for URL */}
              {imagePreview && (
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="معاينة الصورة"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
        </div>

        {/* 2. Product Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-name">اسم المنتج *</label>
          <input
            id="product-name"
            type="text"
            className="form-input"
            placeholder="مثال: عصير رند عنب 250 مل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* 3. Barcode + Scan Button */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-barcode">رقم الباركود *</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="product-barcode"
              type="text"
              className="form-input"
              placeholder="مثال: 6281234567890"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              style={{ direction: 'ltr', textAlign: 'left', flex: 1 }}
              required
            />
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="btn btn-secondary"
              title="مسح الباركود بالكاميرا"
              style={{ whiteSpace: 'nowrap' }}
            >
              <ScanLine size={18} color="var(--primary)" />
              <span className="hide-mobile">قراءة بالكاميرا</span>
            </button>
          </div>
        </div>

        {/* 4. Price Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-price">السعر (د.ع) *</label>
          <input
            id="product-price"
            type="number"
            step="any"
            min="0"
            className="form-input"
            placeholder="مثال: 7500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          {price && !isNaN(Number(price)) && Number(price) > 0 && (
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '4px' }}>
              المعاينة: {formatPrice(Number(price))}
            </span>
          )}
        </div>

        {/* 5. Save Button */}
        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-full"
            style={{ padding: '14px', fontSize: '1.05rem' }}
          >
            {isSubmitting ? (
              <span>جاري الحفظ والمعالجة...</span>
            ) : (
              <>
                <Save size={20} />
                <span>{submitButtonText}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal for Camera Barcode Scanner within the Form */}
      {isScannerOpen && (
        <CameraScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onDetected={handleBarcodeScanned}
        />
      )}
    </>
  );
};
