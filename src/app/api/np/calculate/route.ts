import { NextRequest, NextResponse } from 'next/server';
import { novaPoshtaService } from '@/lib/novaposhta';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      citySender,
      cityRecipient,
      weight,
      serviceType = 'WarehouseWarehouse', // WarehouseDoors, DoorsWarehouse, DoorsDoors
      cost,
      cargoType = '1', // Cargo
      seatsAmount = 1
    } = body;

    // Валидация обязательных параметров
    if (!citySender || !cityRecipient || !weight || !cost) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        message: 'citySender, cityRecipient, weight, and cost are required'
      }, { status: 400 });
    }

    let calculation;

    if (process.env.NOVA_POSHTA_API_KEY && process.env.NOVA_POSHTA_API_KEY !== 'demo-api-key') {
      // Используем реальный API
      calculation = await novaPoshtaService.calculateDelivery({
        citySender,
        cityRecipient,
        weight,
        serviceType,
        cost,
        cargoType,
        seatsAmount
      });
    } else {
      // Mock расчет для разработки
      const baseDeliveryPrice = 45; // базовая стоимость
      const weightMultiplier = weight > 2 ? (weight - 2) * 5 : 0;
      const serviceMultiplier = serviceType.includes('Doors') ? 20 : 0;
      const mockCost = baseDeliveryPrice + weightMultiplier + serviceMultiplier;

      calculation = {
        AssessedCost: cost.toString(),
        Cost: mockCost.toString(),
        CostRedelivery: '0',
        CostPack: '5',
        TZone: '1'
      };
    }

    return NextResponse.json({
      success: true,
      calculation: {
        assessedCost: parseFloat(calculation.AssessedCost),
        deliveryCost: parseFloat(calculation.Cost),
        redeliveryCost: parseFloat(calculation.CostRedelivery || '0'),
        packagingCost: parseFloat(calculation.CostPack || '0'),
        zone: calculation.TZone,
        totalCost: parseFloat(calculation.Cost) + parseFloat(calculation.CostPack || '0')
      },
      parameters: {
        citySender,
        cityRecipient,
        weight,
        serviceType,
        cost,
        cargoType,
        seatsAmount
      }
    });

  } catch (error) {
    console.error('Delivery calculation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate delivery cost',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}