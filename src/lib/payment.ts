import crypto from 'crypto';

// LiqPay Payment Service
const LIQPAY_PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY || 'demo-public-key';
const LIQPAY_PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY || 'demo-private-key';
const LIQPAY_API_URL = 'https://www.liqpay.ua/api/';

export interface PaymentData {
  version: number;
  public_key: string;
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  result_url?: string;
  server_url?: string;
  language?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  product_category?: string;
  product_description?: string;
  product_name?: string;
  product_url?: string;
}

export interface PaymentResponse {
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  status: string;
  transaction_id: number;
  sender_phone?: string;
  sender_card_mask2?: string;
  sender_card_bank?: string;
  payment_id: number;
}

export interface PaymentCheckResult {
  success: boolean;
  status: string;
  amount: number;
  currency: string;
  order_id: string;
  transaction_id?: number;
  payment_id?: number;
  error?: string;
}

class PaymentService {
  private createSignature(data: string): string {
    const signString = LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY;
    return crypto.createHash('sha1').update(signString, 'utf8').digest('base64');
  }

  private encodeData(data: any): string {
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
  }

  private decodeData(data: string): any {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
  }

  // Создание платежной формы
  createPayment(params: {
    amount: number;
    currency?: string;
    description: string;
    orderId: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    resultUrl?: string;
    serverUrl?: string;
    productName?: string;
    productCategory?: string;
  }) {
    const paymentData: PaymentData = {
      version: 3,
      public_key: LIQPAY_PUBLIC_KEY,
      action: 'pay',
      amount: params.amount,
      currency: params.currency || 'UAH',
      description: params.description,
      order_id: params.orderId,
      language: 'uk',
      result_url: params.resultUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      server_url: params.serverUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      product_name: params.productName,
      product_category: params.productCategory || 'printing',
      product_description: params.description
    };

    if (params.customerEmail || params.customerName || params.customerPhone) {
      paymentData.customer = {
        email: params.customerEmail,
        name: params.customerName,
        phone: params.customerPhone
      };
    }

    const encodedData = this.encodeData(paymentData);
    const signature = this.createSignature(encodedData);

    return {
      data: encodedData,
      signature,
      action: 'https://www.liqpay.ua/api/3/checkout',
      paymentData,
      formHtml: this.generatePaymentForm(encodedData, signature)
    };
  }

  // Генерация HTML формы для оплаты
  private generatePaymentForm(data: string, signature: string): string {
    return `
      <form method="post" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
        <input type="submit" value="Оплатить" style="
          background: #00A651;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
        " />
      </form>
    `;
  }

  // Проверка статуса платежа
  async checkPaymentStatus(orderId: string): Promise<PaymentCheckResult> {
    try {
      if (!LIQPAY_PUBLIC_KEY || LIQPAY_PUBLIC_KEY === 'demo-public-key') {
        // Mock response для разработки
        return {
          success: true,
          status: 'success',
          amount: 1000,
          currency: 'UAH',
          order_id: orderId,
          transaction_id: Math.floor(Math.random() * 1000000),
          payment_id: Math.floor(Math.random() * 1000000)
        };
      }

      const requestData = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: 'status',
        order_id: orderId
      };

      const encodedData = this.encodeData(requestData);
      const signature = this.createSignature(encodedData);

      const response = await fetch(LIQPAY_API_URL + 'request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodedData}&signature=${signature}`
      });

      const result = await response.json();
      
      return {
        success: result.status === 'success',
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        order_id: result.order_id,
        transaction_id: result.transaction_id,
        payment_id: result.payment_id
      };

    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        success: false,
        status: 'error',
        amount: 0,
        currency: 'UAH',
        order_id: orderId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Верификация webhook от LiqPay
  verifyWebhook(data: string, signature: string): { isValid: boolean; paymentData?: PaymentResponse } {
    try {
      const expectedSignature = this.createSignature(data);
      
      if (signature !== expectedSignature) {
        return { isValid: false };
      }

      const paymentData = this.decodeData(data) as PaymentResponse;
      
      return {
        isValid: true,
        paymentData
      };

    } catch (error) {
      console.error('Webhook verification error:', error);
      return { isValid: false };
    }
  }

  // Возврат платежа
  async refundPayment(params: {
    orderId: string;
    amount: number;
    comment?: string;
  }): Promise<{ success: boolean; refund_id?: number; error?: string }> {
    try {
      const requestData = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: 'refund',
        order_id: params.orderId,
        amount: params.amount,
        comment: params.comment || 'Refund'
      };

      const encodedData = this.encodeData(requestData);
      const signature = this.createSignature(encodedData);

      if (!LIQPAY_PUBLIC_KEY || LIQPAY_PUBLIC_KEY === 'demo-public-key') {
        // Mock response для разработки
        return {
          success: true,
          refund_id: Math.floor(Math.random() * 1000000)
        };
      }

      const response = await fetch(LIQPAY_API_URL + 'request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodedData}&signature=${signature}`
      });

      const result = await response.json();
      
      return {
        success: result.status === 'success',
        refund_id: result.refund_id,
        error: result.status !== 'success' ? result.err_description : undefined
      };

    } catch (error) {
      console.error('Refund error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Экспорт единого экземпляра сервиса
export const paymentService = new PaymentService();

// Типы статусов платежей
export const PaymentStatuses = {
  SANDBOX: 'sandbox',
  SUCCESS: 'success',
  FAILURE: 'failure',
  ERROR: 'error',
  REVERSED: 'reversed',
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  PROCESSING: 'processing',
  PREPARED: 'prepared',
  HOLD_WAIT: 'hold_wait',
  INVOICE_WAIT: 'invoice_wait'
} as const;

export type PaymentStatus = typeof PaymentStatuses[keyof typeof PaymentStatuses];