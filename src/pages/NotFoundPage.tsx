import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '24px' }}>
      <div className="card fade-in" style={{ maxWidth: '440px', width: '100%', padding: '40px 24px' }}>
        <AlertCircle size={64} color="var(--warning)" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>الصفحة غير موجودة</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله.
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-full">
          <Home size={18} />
          العودة للوحة التحكم
        </Link>
      </div>
    </div>
  );
};
