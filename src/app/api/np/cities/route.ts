import { NextRequest, NextResponse } from 'next/server';
import { novaPoshtaService, mockNovaPoshtaData } from '@/lib/novaposhta';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let cities;
    
    if (process.env.NOVA_POSHTA_API_KEY && process.env.NOVA_POSHTA_API_KEY !== 'demo-api-key') {
      // Используем реальный API
      if (query.trim()) {
        cities = await novaPoshtaService.searchCities(query, limit);
      } else {
        cities = await novaPoshtaService.getCities();
        cities = cities.slice(0, limit); // Ограничиваем количество
      }
    } else {
      // Используем mock данные для разработки
      cities = mockNovaPoshtaData.cities.filter(city => 
        city.Description.toLowerCase().includes(query.toLowerCase()) ||
        city.DescriptionRu.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      query,
      limit,
      cities: cities.map(city => ({
        ref: city.Ref,
        name: city.Description,
        nameRu: city.DescriptionRu,
        area: city.Area,
        areaDescription: city.AreaDescription,
        region: city.Region,
        regionDescription: city.RegionDescription
      }))
    });

  } catch (error) {
    console.error('Cities API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cities',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}