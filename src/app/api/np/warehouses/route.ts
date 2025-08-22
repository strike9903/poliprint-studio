import { NextRequest, NextResponse } from 'next/server';
import { novaPoshtaService, mockNovaPoshtaData } from '@/lib/novaposhta';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Київ';
    const cityRef = searchParams.get('cityRef');
    
    let warehouses;
    
    if (process.env.NOVA_POSHTA_API_KEY && process.env.NOVA_POSHTA_API_KEY !== 'demo-api-key') {
      // Используем реальный API
      if (cityRef) {
        warehouses = await novaPoshtaService.getWarehouses(cityRef);
      } else {
        warehouses = await novaPoshtaService.getWarehousesByCity(city);
      }
    } else {
      // Используем mock данные для разработки
      warehouses = mockNovaPoshtaData.warehouses;
    }

    return NextResponse.json({
      success: true,
      city,
      cityRef,
      warehouses: warehouses.map(warehouse => ({
        ref: warehouse.Ref,
        siteKey: warehouse.SiteKey,
        number: warehouse.Number,
        description: warehouse.Description,
        shortAddress: warehouse.ShortAddress,
        phone: warehouse.Phone,
        typeOfWarehouse: warehouse.TypeOfWarehouse,
        schedule: warehouse.Schedule
      }))
    });

  } catch (error) {
    console.error('Warehouses API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch warehouses',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}