import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/products/ProductCard';
import { deleteProduct } from '../services/productService';
import { Product } from '../types/product';
import { Skeleton } from '../components/common/Skeleton';
import { Modal } from '../components/common/Modal';
import { Search, PlusCircle, Package, AlertCircle, Trash2 } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, loading, error, searchQuery, setSearchQuery, refetch } = useProducts();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      await refetch();
    } catch (err: any) {
      setDeleteError('فشل حذف المنتج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Title & Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
            قائمة المنتجات 📦
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            عرض وإدارة كافة المنتجات المسجلة في النظام
          </p>
        </div>

        <Link to="/products/add" className="btn btn-primary">
          <PlusCircle size={18} />
          إضافة منتج جديد
        </Link>
      </div>

      {/* Search Input */}
      <div className="form-group" style={{ marginBottom: '8px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="ابحث باسم المنتج أو رقم الباركود (مثال: Shampoo أو 628123)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '42px', fontSize: '0.95rem' }}
          />
          <Search
            size={20}
            color="var(--text-muted)"
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <Skeleton height="180px" />
              <div style={{ padding: '16px' }}>
                <Skeleton width="80%" height="20px" />
                <Skeleton width="45%" height="16px" style={{ marginTop: '8px' }} />
                <Skeleton width="60%" height="24px" style={{ marginTop: '12px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => navigate(`/products/${p.id}/edit`)}
              onDelete={(p) => setProductToDelete(p)}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Package size={54} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            {searchQuery ? 'لم يتم العثور على أي نتائج طابق البحث' : 'لا توجد منتجات مسجلة في النظام'}
          </h3>
          <p style={{ fontSize: '0.9rem' }}>
            {searchQuery ? 'تأكد من كتابة اسم المنتج أو رقم الباركود بشكل صحيح' : 'بدء إضافة المنتجات وتصنيفها بالباركود بسهولة'}
          </p>
          {!searchQuery && (
            <Link to="/products/add" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <PlusCircle size={18} />
              إضافة منتج جديد
            </Link>
          )}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="تأكيد حذف المنتج"
      >
        <div>
          {deleteError && (
            <div className="alert alert-danger" style={{ marginBottom: '12px' }}>
              <AlertCircle size={18} />
              <span>{deleteError}</span>
            </div>
          )}

          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '12px' }}>
            هل أنت متأكد من أنك تريد حذف المنتج التالي من النظام؟
          </p>

          {productToDelete && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'var(--bg-surface)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              <img
                src={productToDelete.imageUrl}
                alt={productToDelete.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{productToDelete.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {productToDelete.barcode}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setProductToDelete(null)}
              className="btn btn-secondary"
              disabled={isDeleting}
            >
              إلغاء
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn btn-danger"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span>جاري الحذف...</span>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>حذف المنتج</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
