import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Missing order ID',
        message: 'Order ID is required'
      }, { status: 400 });
    }

    // Проверяем статус платежа
    const statusResult = await paymentService.checkPaymentStatus(orderId);

    return NextResponse.json({
      success: statusResult.success,
      orderId,
      payment: {
        status: statusResult.status,
        amount: statusResult.amount,
        currency: statusResult.currency,
        transactionId: statusResult.transaction_id,
        paymentId: statusResult.payment_id,
        isPaid: statusResult.status === 'success',
        isFailed: statusResult.status === 'failure' || statusResult.status === 'error',
        isProcessing: statusResult.status === 'processing' || statusResult.status === 'prepared'
      },
      error: statusResult.error
    });

  } catch (error) {
    console.error('Payment status error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check payment status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}