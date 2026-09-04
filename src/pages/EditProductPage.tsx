import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../components/products/ProductForm';
import { getProductById, updateProduct } from '../services/productService';
import { Product, ProductFormData } from '../types/product';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (!data) {
          setError('لم يتم العثور على المنتج المطلوب في النظام');
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات المنتج من قاعدة البيانات');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    if (!id || !product) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await updateProduct(id, formData, product.imageUrl);
      setSuccessMessage('تم تحديث بيانات المنتج بنجاح!');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err: any) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="جاري تحميل بيانات المنتج..." />;
  }

  if (error || !product) {
    return (
      <div className="card fade-in" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '500px', margin: '40px auto' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>خطأ</h3>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px' }}>{error || 'المنتج غير موجود'}</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          العودة لقائمة المنتجات
        </button>
      </div>
    );
  }

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
            تعديل المنتج ✏️
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            تعديل اسم المنتج، الباركود، السعر، أو الصورة
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
        initialData={{
          name: product.name,
          barcode: product.barcode,
          price: product.price,
          imageUrl: product.imageUrl,
        }}
        onSubmit={handleSubmit}
        submitButtonText="تحديث بيانات المنتج"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
