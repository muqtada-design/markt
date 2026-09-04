import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, LayoutDashboard, Package, PlusCircle, ScanLine } from 'lucide-react';

export const TopNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="top-nav">
      <Link to="/dashboard" className="brand-logo">
        <QrCode />
        <span>Smart Barcode</span>
      </Link>

      <nav className="nav-actions">
        <div style={{ display: 'flex', gap: '8px' }} className="desktop-links">
          <Link
            to="/dashboard"
            className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <LayoutDashboard size={16} />
            <span className="hide-mobile">الرئيسية</span>
          </Link>

          <Link
            to="/scan"
            className={`btn ${isActive('/scan') ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <ScanLine size={16} />
            <span className="hide-mobile">قراءة باركود</span>
          </Link>

          <Link
            to="/products"
            className={`btn ${isActive('/products') ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <Package size={16} />
            <span className="hide-mobile">المنتجات</span>
          </Link>

          <Link
            to="/products/add"
            className={`btn ${isActive('/products/add') ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <PlusCircle size={16} />
            <span className="hide-mobile">إضافة منتج</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};
