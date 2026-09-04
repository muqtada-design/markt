import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProductForm } from '../components/products/ProductForm';
import { addProduct } from '../services/productService';
import { ProductFormData } from '../types/product';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const AddProductPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledBarcode = searchParams.get('barcode') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await addProduct(formData);
      setSuccessMessage('تم حفظ المنتج بنجاح في قاعدة البيانات!');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err: any) {
      throw err; // Form will capture and display error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-icon"
          title="رجوع"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            إضافة منتج جديد ＋
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            أدخل تفاصيل المنتج وارفِع صورته وقارئ الباركود
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      <ProductForm
        initialData={{ name: '', barcode: prefilledBarcode, price: '' }}
        onSubmit={handleSubmit}
        submitButtonText="حفظ المنتج في Firebase"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
