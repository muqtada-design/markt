import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

export const loginUser = async (email: string, pass: string): Promise<User> => {
  if (!isFirebaseConfigured()) {
    throw new Error('لم يتم ضبط إعدادات Firebase بعد. يرجى إضافة مفاتيح API الخاصة بك في ملف .env');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    console.error('فشل تسجيل الدخول:', error);
    if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
      throw new Error('لم يتم تفعيل طريقة تسجيل الدخول (Email/Password) في لوحة التحكم Firebase لمشروع markali-ec8d5 بعد. يرجى تفعيلها من Firebase Console -> Authentication -> Sign-in method.');
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('تم حظر المحاولات مؤقتا لكثرة المحاولات الخاطئة. حاول لاحقاً');
    }
    throw new Error(error.message || 'حدث خطأ أثناء الاتصال بقاعدة البيانات. حاول مرة أخرى.');
  }
};

export const logoutUser = async (): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('خطأ أثناء تسجيل الخروج:', error);
    throw new Error('فشل تسجيل الخروج، يرجى المحاولة مرة أخرى.');
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
