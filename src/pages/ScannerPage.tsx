import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraScanner } from '../components/scanner/CameraScanner';
import { getProductByBarcode } from '../services/productService';
import { Product } from '../types/product';
import { formatPrice } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ScanLine, PlusCircle, AlertTriangle, CheckCircle2, Barcode as BarcodeIcon } from 'lucide-react';

export const ScannerPage: React.FC = () => {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleScanSuccess = async (barcodeStr: string) => {
    if (loading || isPaused) return;

    setIsPaused(true);
    setScannedBarcode(barcodeStr);
    setLoading(true);
    setHasSearched(false);
    setProduct(null);

    try {
      const result = await getProductByBarcode(barcodeStr);
      setProduct(result);
    } catch (err) {
      console.error('خطأ أثناء البحث عن الباركود:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleScanAnother = () => {
    setScannedBarcode(null);
    setProduct(null);
    setHasSearched(false);
    setLoading(false);
    setIsPaused(false);
  };

  const handleAddProductWithBarcode = () => {
    if (scannedBarcode) {
      navigate(`/products/add?barcode=${encodeURIComponent(scannedBarcode)}`);
    } else {
      navigate('/products/add');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <ScanLine color="var(--primary)" />
          ماسح الباركود
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          وجه الكاميرا نحو الباركود لقراءة بيانات المنتج مباشرة
        </p>
      </div>

      {/* Live Camera Feed (Hidden when showing result or searching) */}
      {!hasSearched && !loading && (
        <CameraScanner onScanSuccess={handleScanSuccess} paused={isPaused} />
      )}

      {/* Loading state during Firestore search */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <LoadingSpinner size="lg" text={`جاري البحث عن الباركود: ${scannedBarcode}...`} />
        </div>
      )}

      {/* Result Card: Product Found */}
      {hasSearched && !loading && product && (
        <div className="card fade-in" style={{ padding: '24px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={16} />
            تم العثور على المنتج
          </div>

          {/* Large Image */}
          <div
            style={{
              width: '100%',
              maxHeight: '260px',
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-surface)',
              marginBottom: '16px',
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Product Details */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            {product.name}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              direction: 'ltr',
              marginBottom: '12px',
            }}
          >
            <BarcodeIcon size={18} />
            <span>{product.barcode}</span>
          </div>

          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--primary)',
              marginBottom: '24px',
            }}
          >
            {formatPrice(product.price)}
          </div>

          {/* Action button to scan another product */}
          <button
            onClick={handleScanAnother}
            className="btn btn-primary btn-full"
            style={{ padding: '14px', fontSize: '1.05rem' }}
          >
            <ScanLine size={20} />
            قراءة منتج آخر
          </button>
        </div>
      )}

      {/* Result Card: Product NOT Found */}
      {hasSearched && !loading && !product && (
        <div className="card fade-in" style={{ padding: '28px 20px', textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            ⚠️ المنتج غير موجود
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '12px' }}>
            هذا الباركود غير مسجل في النظام.
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'inline-block',
              fontFamily: 'monospace',
              fontSize: '1rem',
              direction: 'ltr',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '24px',
            }}
          >
            {scannedBarcode}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleAddProductWithBarcode}
              className="btn btn-primary btn-full"
              style={{ padding: '14px', fontSize: '1rem' }}
            >
              <PlusCircle size={20} />
              إضافة هذا المنتج الآن
            </button>

            <button
              onClick={handleScanAnother}
              className="btn btn-secondary btn-full"
              style={{ padding: '12px', fontSize: '0.95rem' }}
            >
              <ScanLine size={18} />
              إلغاء وقراءة باركود آخر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
