import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QrCode, LogOut, LayoutDashboard, Package, PlusCircle, ScanLine } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="top-nav">
      <Link to="/dashboard" className="brand-logo">
        <QrCode />
        <span>Smart Barcode</span>
      </Link>

      {user && (
        <nav className="nav-actions">
          <div style={{ display: 'none' }} className="desktop-links">
            <Link
              to="/dashboard"
              className={`btn btn-secondary ${isActive('/dashboard') ? 'active-nav' : ''}`}
            >
              <LayoutDashboard size={18} />
              الرئيسية
            </Link>
            <Link
              to="/scan"
              className={`btn btn-primary ${isActive('/scan') ? 'active-nav' : ''}`}
            >
              <ScanLine size={18} />
              قراءة باركود
            </Link>
            <Link
              to="/products"
              className={`btn btn-secondary ${isActive('/products') ? 'active-nav' : ''}`}
            >
              <Package size={18} />
              المنتجات
            </Link>
            <Link
              to="/products/add"
              className={`btn btn-secondary ${isActive('/products/add') ? 'active-nav' : ''}`}
            >
              <PlusCircle size={18} />
              إضافة منتج
            </Link>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary btn-icon" title="تسجيل الخروج">
            <LogOut size={20} color="var(--danger)" />
          </button>
        </nav>
      )}
    </header>
  );
};
