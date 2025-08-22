import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Mock preflight check
  return Response.json({
    ok: true,
    dpi: 180,
    bleedMm: 2,
    issues: []
  });
}