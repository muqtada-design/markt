export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProductFormData {
  name: string;
  barcode: string;
  price: number | string;
  imageFile?: File | null;
}

export interface ProductStats {
  totalCount: number;
  lastAddedProduct?: Product | null;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}
