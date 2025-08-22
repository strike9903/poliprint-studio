import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'UAH',
      description,
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      productName,
      productCategory,
      resultUrl,
      serverUrl
    } = body;

    // Валидация обязательных параметров
    if (!amount || !description || !orderId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        message: 'amount, description, and orderId are required'
      }, { status: 400 });
    }

    // Проверяем корректность суммы
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      }, { status: 400 });
    }

    // Создаем платеж
    const paymentData = paymentService.createPayment({
      amount,
      currency,
      description,
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      productName,
      productCategory,
      resultUrl,
      serverUrl
    });

    return NextResponse.json({
      success: true,
      payment: {
        data: paymentData.data,
        signature: paymentData.signature,
        action: paymentData.action,
        formHtml: paymentData.formHtml
      },
      order: {
        orderId,
        amount,
        currency,
        description
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}