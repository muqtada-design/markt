import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../services/productService';

export function useProducts(initialSearch: string = '') {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  const fetchProducts = useCallback(async (queryStr: string = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(queryStr);
      setProducts(data);
    } catch (err: any) {
      console.error('خطأ في جلب المنتجات:', err);
      setError('حدث خطأ أثناء الاتصال بقاعدة البيانات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery, fetchProducts]);

  return {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refetch: fetchProducts,
  };
}
