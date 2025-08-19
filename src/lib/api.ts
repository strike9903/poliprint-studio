import type { Product } from '@/types';
import { products } from '@/data/products';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchProducts(filters?: any): Promise<Product[]> {
  // When running on the server during build, read from the local dataset
  if (typeof window === 'undefined') {
    let result = products;
    if (filters?.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.ua.toLowerCase().includes(q) ||
        p.title.ru?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`${baseUrl}/api/products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data.data;
}

export async function fetchProduct(slug: string): Promise<Product> {
  if (typeof window === 'undefined') {
    const product = products.find(p => p.slug === slug);
    if (!product) throw new Error('Product not found');
    return product;
  }

  const response = await fetch(`${baseUrl}/api/products/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  return data.data;
}