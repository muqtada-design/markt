import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInAnonymously } from 'firebase/auth';
import { subscribeToAuthChanges, logoutUser } from '../services/authService';
import { auth, isFirebaseConfigured } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured] = useState<boolean>(isFirebaseConfigured());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // تسجيل دخول مجهول تلقائياً خلف الكواليس إذا لم يكن المستخدم مسجلاً
      if (!currentUser && isConfigured) {
        signInAnonymously(auth).catch((err) => {
          console.warn('تنبيه: فشل تسجيل الدخول المجهول التلقائي:', err);
        });
      }
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
