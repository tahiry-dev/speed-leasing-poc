import { NextResponse } from 'next/server';
import { BIKES_CATALOG, calculateLease } from '@/lib/bikes-data';
import { LeasingCalculationRequest } from '@/types/bike';

// GET /api/bikes -> Returns the complete list of premium motorcycles
export async function GET() {
  return NextResponse.json({
    success: true,
    count: BIKES_CATALOG.length,
    currency: 'USD',
    bikes: BIKES_CATALOG
  });
}

// POST /api/bikes -> Calculates a real-time lease simulation
export async function POST(request: Request) {
  try {
    const body: LeasingCalculationRequest = await request.json();
    
    // Validate required fields
    if (!body.bikeId || !body.durationMonths) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: bikeId and durationMonths are mandatory.' },
        { status: 400 }
      );
    }

    // Perform lease estimation computation
    const simulation = calculateLease(body);

    return NextResponse.json({
      success: true,
      simulation,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process lease calculation request.' },
      { status: 500 }
    );
  }
}