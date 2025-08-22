import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = formData.get('data') as string;
    const signature = formData.get('signature') as string;

    if (!data || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing webhook data'
      }, { status: 400 });
    }

    // Верифицируем webhook
    const verification = paymentService.verifyWebhook(data, signature);
    
    if (!verification.isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({
        success: false,
        error: 'Invalid signature'
      }, { status: 403 });
    }

    const paymentData = verification.paymentData!;
    
    console.log('Payment webhook received:', {
      orderId: paymentData.order_id,
      status: paymentData.status,
      amount: paymentData.amount,
      transactionId: paymentData.transaction_id
    });

    // Здесь должна быть логика обработки платежа:
    // 1. Найти заказ по order_id
    // 2. Обновить статус заказа
    // 3. Отправить уведомления клиенту
    // 4. Запустить процессы выполнения заказа

    // TODO: Integrate with database and order processing system
    const orderProcessingResult = await processPaymentWebhook(paymentData);

    return NextResponse.json({
      success: true,
      orderId: paymentData.order_id,
      status: paymentData.status,
      processed: orderProcessingResult.processed,
      message: orderProcessingResult.message
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Функция обработки webhook платежа
async function processPaymentWebhook(paymentData: any): Promise<{
  processed: boolean;
  message: string;
}> {
  try {
    const { order_id, status, amount, transaction_id } = paymentData;

    // Mock обработка - в реальном приложении здесь будет работа с БД
    switch (status) {
      case 'success':
        console.log(`✅ Payment successful for order ${order_id}: ${amount} UAH`);
        // TODO: 
        // - Update order status to 'paid'
        // - Send confirmation email to customer
        // - Trigger production workflow
        // - Update inventory if needed
        // - Generate invoice
        return {
          processed: true,
          message: 'Payment processed successfully'
        };

      case 'failure':
      case 'error':
        console.log(`❌ Payment failed for order ${order_id}`);
        // TODO:
        // - Update order status to 'payment_failed'
        // - Send failure notification to customer
        // - Log payment failure for analysis
        return {
          processed: true,
          message: 'Payment failure processed'
        };

      case 'processing':
        console.log(`🔄 Payment processing for order ${order_id}`);
        // TODO:
        // - Update order status to 'payment_processing'
        // - Send processing notification to customer
        return {
          processed: true,
          message: 'Payment processing status updated'
        };

      default:
        console.log(`📋 Payment status '${status}' for order ${order_id}`);
        return {
          processed: true,
          message: `Status '${status}' processed`
        };
    }

  } catch (error) {
    console.error('Order processing error:', error);
    return {
      processed: false,
      message: 'Order processing failed'
    };
  }
}