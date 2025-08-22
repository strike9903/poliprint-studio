import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Mock tracking data
  return Response.json({
    orderId: body.orderId || "ORDER-001",
    ttn: body.ttn || "TTN-000000001",
    status: "В дорозі",
    timeline: [
      { status: "Замовлення прийнято", date: "2023-05-01T10:00:00Z" },
      { status: "Передано в Нову Пошту", date: "2023-05-01T15:00:00Z" },
      { status: "В дорозі", date: "2023-05-02T08:00:00Z" }
    ]
  });
}