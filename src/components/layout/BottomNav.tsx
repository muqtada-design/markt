import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Package, PlusCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard />
        <span>الرئيسية</span>
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Package />
        <span>المنتجات</span>
      </NavLink>

      <NavLink
        to="/scan"
        className="bottom-nav-item scan-nav-btn"
        title="قراءة باركود"
      >
        <ScanLine />
      </NavLink>

      <NavLink
        to="/products/add"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <PlusCircle />
        <span>إضافة</span>
      </NavLink>
    </nav>
  );
};
