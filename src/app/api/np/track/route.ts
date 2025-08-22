import { NextRequest, NextResponse } from 'next/server';
import { novaPoshtaService } from '@/lib/novaposhta';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('number');
    
    if (!trackingNumber) {
      return NextResponse.json({
        success: false,
        error: 'Missing tracking number',
        message: 'Tracking number is required'
      }, { status: 400 });
    }

    let trackingData;

    if (process.env.NOVA_POSHTA_API_KEY && process.env.NOVA_POSHTA_API_KEY !== 'demo-api-key') {
      // Используем реальный API
      trackingData = await novaPoshtaService.trackDocument(trackingNumber);
    } else {
      // Mock данные для разработки
      const mockStatuses = [
        'Створена',
        'Відправлена з міста відправника',
        'Прибула до міста отримувача',
        'Готова до отримання',
        'Видана отримувачу'
      ];
      
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      trackingData = [{
        Number: trackingNumber,
        Status: randomStatus,
        StatusCode: '1',
        DateCreated: '2024-12-20',
        CitySender: 'Київ',
        CityRecipient: 'Харків',
        WarehouseRecipient: 'Відділення №15',
        ActualDeliveryDate: randomStatus === 'Видана отримувачу' ? '2024-12-21' : null,
        RecipientFullName: 'Іваненко Марія Петрівна',
        Phone: '+380991234567'
      }];
    }

    const result = trackingData[0];
    
    return NextResponse.json({
      success: true,
      trackingNumber,
      status: {
        number: result.Number,
        status: result.Status,
        statusCode: result.StatusCode,
        dateCreated: result.DateCreated,
        citySender: result.CitySender,
        cityRecipient: result.CityRecipient,
        warehouseRecipient: result.WarehouseRecipient,
        actualDeliveryDate: result.ActualDeliveryDate,
        recipientFullName: result.RecipientFullName,
        phone: result.Phone,
        isDelivered: result.Status === 'Видана отримувачу' || result.Status === 'Delivered'
      }
    });

  } catch (error) {
    console.error('Tracking API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track package',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}