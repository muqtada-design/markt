import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { Product, ProductFormData, ProductStats } from '../types/product';
import { uploadProductImage, deleteProductImage } from './storageService';
import { sanitizeBarcode } from '../utils/formatters';

const PRODUCTS_COLLECTION = 'products';

/**
 * التحقق مما إذا كان رقم الباركود موجوداً مسبقاً في Firestore
 */
export async function checkBarcodeExists(barcode: string, excludeId?: string): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;

  const cleanBarcode = sanitizeBarcode(barcode);
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('barcode', '==', cleanBarcode)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;

  if (excludeId) {
    return snapshot.docs.some((d) => d.id !== excludeId);
  }

  return true;
}

/**
 * البحث عن منتج بواسطة رقم الباركود الدقيق
 */
export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  if (!isFirebaseConfigured()) return null;

  const cleanBarcode = sanitizeBarcode(barcode);
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('barcode', '==', cleanBarcode),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    id: docSnap.id,
    name: data.name,
    barcode: data.barcode,
    price: Number(data.price),
    imageUrl: data.imageUrl,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt || Date.now(),
  };
}

/**
 * الحصول على تفاصيل منتج محدد بواسطة ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured()) return null;

  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    barcode: data.barcode,
    price: Number(data.price),
    imageUrl: data.imageUrl,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt || Date.now(),
  };
}

/**
 * جلب جميع المنتجات مع دعم الفلترة والبحث
 */
export async function getProducts(searchQuery: string = ''): Promise<Product[]> {
  if (!isFirebaseConfigured()) return [];

  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const products: Product[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      barcode: data.barcode,
      price: Number(data.price),
      imageUrl: data.imageUrl,
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
      updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt || Date.now(),
    };
  });

  if (!searchQuery.trim()) return products;

  const term = searchQuery.toLowerCase().trim();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.barcode.toLowerCase().includes(term)
  );
}

/**
 * إضافة منتج جديد
 */
export async function addProduct(data: ProductFormData): Promise<Product> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase لم يتم تهيئته بعد');
  }

  const cleanBarcode = sanitizeBarcode(data.barcode);

  // 1. التحقق من وجود الباركود مسبقاً
  const exists = await checkBarcodeExists(cleanBarcode);
  if (exists) {
    throw new Error('هذا الباركود مرتبط بمنتج موجود مسبقاً.');
  }

  if (!data.imageFile) {
    throw new Error('صورة المنتج مطلوبة');
  }

  // 2. إنشاء مستند جديد للحصول على ID
  const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
  const productId = newDocRef.id;

  // 3. رفع الصورة أو الحصول على رابطها
  const imageUrl = await uploadProductImage(productId, data.imageFile, data.imageUrlInput);

  const now = Date.now();
  const productDocData = {
    name: data.name.trim(),
    barcode: cleanBarcode,
    price: Number(data.price),
    imageUrl: imageUrl,
    createdAt: Timestamp.fromMillis(now),
    updatedAt: Timestamp.fromMillis(now),
  };

  // 4. حفظ البيانات في Firestore
  await setDoc(newDocRef, productDocData);

  return {
    id: productId,
    name: productDocData.name,
    barcode: productDocData.barcode,
    price: productDocData.price,
    imageUrl: productDocData.imageUrl,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * تعديل بيانات منتج موجود
 */
export async function updateProduct(
  id: string,
  data: ProductFormData,
  currentImageUrl: string
): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase لم يتم تهيئته بعد');
  }

  const cleanBarcode = sanitizeBarcode(data.barcode);

  // 1. التحقق من عدم تكرار الباركود لمنتج آخر
  const exists = await checkBarcodeExists(cleanBarcode, id);
  if (exists) {
    throw new Error('هذا الباركود مرتبط بمنتج آخر موجود مسبقاً.');
  }

  let imageUrl = currentImageUrl;

  // 2. إذا تم رفع صورة جديدة أو كتابة رابط صورة جديد
  if (data.imageFile || data.imageUrlInput) {
    imageUrl = await uploadProductImage(id, data.imageFile, data.imageUrlInput);
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    name: data.name.trim(),
    barcode: cleanBarcode,
    price: Number(data.price),
    imageUrl: imageUrl,
    updatedAt: Timestamp.fromMillis(Date.now()),
  });
}

/**
 * حذف منتج من Firestore ومن Storage
 */
export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  // 1. حذف المستند من Firestore
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);

  // 2. حذف الصورة من Storage
  await deleteProductImage(id);
}

/**
 * جلب إحصائيات المنتجات للوحة التحكم
 */
export async function getProductStats(): Promise<ProductStats> {
  if (!isFirebaseConfigured()) {
    return { totalCount: 0, lastAddedProduct: null };
  }

  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const totalCount = snapshot.size;

  if (snapshot.empty) {
    return { totalCount: 0, lastAddedProduct: null };
  }

  const firstDoc = snapshot.docs[0];
  const data = firstDoc.data();
  const lastAddedProduct: Product = {
    id: firstDoc.id,
    name: data.name,
    barcode: data.barcode,
    price: Number(data.price),
    imageUrl: data.imageUrl,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt || Date.now(),
  };

  return {
    totalCount,
    lastAddedProduct,
  };
}
