import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, comment } = body;

    // Валидация обязательных параметров
    if (!orderId || !amount) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        message: 'orderId and amount are required'
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

    // Выполняем возврат
    const refundResult = await paymentService.refundPayment({
      orderId,
      amount,
      comment
    });

    if (!refundResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Refund failed',
        message: refundResult.error || 'Unknown refund error'
      }, { status: 400 });
    }

    // TODO: Update order status in database
    // TODO: Send refund notification to customer
    // TODO: Log refund for accounting

    return NextResponse.json({
      success: true,
      refund: {
        orderId,
        amount,
        refundId: refundResult.refund_id,
        comment: comment || 'Refund processed',
        processedAt: new Date().toISOString()
      },
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Refund error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process refund',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}