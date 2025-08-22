import { NextRequest } from 'next/server';

// Mock data for a single product
const mockProduct = {
  id: 1,
  slug: 'canvas-1',
  title: 'Холст 30x40 см',
  description: 'Високоякісний холст для друку з чудовою кольоропередачею.',
  priceFrom: 450,
  category: 'canvas'
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // In a real app, you would fetch the product by slug
  // For now, we'll just return the mock product
  return Response.json({ data: mockProduct, success: true });
}