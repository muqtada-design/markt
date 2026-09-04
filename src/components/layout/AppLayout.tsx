import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, isConfigured } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav />

      {!isConfigured && (
        <div className="alert alert-warning" style={{ margin: '16px auto', maxWidth: '800px', width: '90%' }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>تنبيه: لم يتم ضبط مفاتيح Firebase الحقيقية بعد!</strong>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              يرجى فتح ملف <code>.env</code> في جذر المشروع واستبدال المتغيرات بمفاتيح Firebase الخاصة بك.
            </p>
          </div>
        </div>
      )}

      <main className="app-container" style={{ flex: 1 }}>
        <Outlet />
      </main>

      {user && <BottomNav />}
    </div>
  );
};
