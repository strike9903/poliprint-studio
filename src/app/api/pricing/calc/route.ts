import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Mock pricing calculation
  const { items } = body;
  let total = 0;
  
  // Simple pricing logic for demo
  items.forEach((item: any) => {
    // Base price calculation (simplified)
    const basePrice = item.widthCm * item.heightCm * 0.5;
    total += basePrice;
  });
  
  // Add some fixed costs
  total += 50; // Setup cost
  total *= 1.2; // Markup

  return Response.json({
    currency: "UAH",
    total: Math.round(total),
    breakdown: [
      { description: "Вартість друку", amount: Math.round(total * 0.8) },
      { description: "Вартість підготовки", amount: 50 }
    ]
  });
}