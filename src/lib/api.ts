import type { Product, ApiResponse } from '@/types';

export async function fetchProducts(filters?: any): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  
  const response = await fetch(`/api/products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  
  const data: ApiResponse<Product[]> = await response.json();
  return data.data;
}