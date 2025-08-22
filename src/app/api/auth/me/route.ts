import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Decode JWT token (in real app, use proper JWT library)
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        cookieStore.delete('auth-token');
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }

      // TODO: Fetch user from database using decoded.userId
      // For now, return mock user data
      const mockUser = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.email === 'demo@poliprint.ua' ? 'Demo User' : decoded.email.split('@')[0],
        phone: '+380 XX XXX XX XX',
        avatar: null,
        role: 'user' as const,
        preferences: {
          language: 'uk',
          notifications: true,
          newsletter: true
        },
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          memberSince: '2024-01-01'
        }
      };

      return NextResponse.json({
        success: true,
        user: mockUser
      });

    } catch (decodeError) {
      // Invalid token format
      cookieStore.delete('auth-token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}