import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, PlusCircle, Package, Layers, Sparkles, ArrowLeft } from 'lucide-react';
import { getProductStats, getProducts } from '../services/productService';
import { Product, ProductStats } from '../types/product';
import { ProductCard } from '../components/products/ProductCard';
import { Skeleton } from '../components/common/Skeleton';
import { formatPrice } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<ProductStats>({ totalCount: 0, lastAddedProduct: null });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [statsData, allProducts] = await Promise.all([
          getProductStats(),
          getProducts(''),
        ]);
        setStats(statsData);
        setRecentProducts(allProducts.slice(0, 4));
      } catch (err) {
        console.error('فشل تحميل بيانات لوحة التحكم:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Smart Barcode
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          إدارة المنتجات وقراءة الباركود بسهولة ورصد المبيعات
        </p>
      </div>

      {/* Prominent Scan Button (Top Priority Element on Mobile & Desktop) */}
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <Link to="/scan" className="btn btn-scan-prominent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <ScanLine size={28} />
          <span>📷 قراءة باركود</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h4>إجمالي المنتجات</h4>
            <p>{loading ? <Skeleton width="60px" height="28px" /> : stats.totalCount.toLocaleString('ar-EG')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <Sparkles size={24} />
          </div>
          <div className="stat-info" style={{ overflow: 'hidden' }}>
            <h4>آخر منتج تمت إضافته</h4>
            <p style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {loading ? (
                <Skeleton width="120px" height="24px" />
              ) : stats.lastAddedProduct ? (
                `${stats.lastAddedProduct.name} (${formatPrice(stats.lastAddedProduct.price)})`
              ) : (
                'لا يوجد منتجات بعد'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <Link to="/products/add" className="btn btn-secondary" style={{ padding: '14px', fontSize: '1rem' }}>
          <PlusCircle size={20} color="var(--primary)" />
          <span>＋ إضافة منتج</span>
        </Link>

        <Link to="/products" className="btn btn-secondary" style={{ padding: '14px', fontSize: '1rem' }}>
          <Package size={20} color="var(--primary)" />
          <span>📦 المنتجات</span>
        </Link>
      </div>

      {/* Recent Products Section */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>أحدث المنتجات</h2>
          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            عرض الكل
            <ArrowLeft size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <Skeleton height="180px" />
                <div style={{ padding: '16px' }}>
                  <Skeleton width="70%" height="20px" />
                  <Skeleton width="40%" height="16px" style={{ marginTop: '8px' }} />
                  <Skeleton width="50%" height="24px" style={{ marginTop: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="product-grid">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(p) => navigate(`/products/${p.id}/edit`)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Package size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <p style={{ fontWeight: 700 }}>لا توجد منتجات مسجلة في النظام حتى الآن</p>
            <Link to="/products/add" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <PlusCircle size={18} />
              أضف أول منتج الآن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
