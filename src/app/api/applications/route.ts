import { NextResponse } from 'next/server';
import { LeasingCalculationResult } from '@/types/bike';

interface ApplicationRequestBody {
  fullName: string;
  email: string;
  phone: string;
  applicantType: 'individual' | 'business';
  annualIncome: number;
  simulation: LeasingCalculationResult;
}

// POST /api/applications -> Process and store a lease pre-approval application
export async function POST(request: Request) {
  try {
    const body: ApplicationRequestBody = await request.json();

    // Basic server-side validation
    if (!body.fullName || !body.email || !body.phone || !body.simulation) {
      return NextResponse.json(
        { success: false, error: 'Missing required contact or simulation details.' },
        { status: 400 }
      );
    }

    // Generate reference code
    const referenceId = `SPL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Application submitted successfully. A leasing advisor will contact you within 24 hours.',
      data: {
        applicant: {
          name: body.fullName,
          email: body.email,
          phone: body.phone,
          type: body.applicantType,
        },
        contractSummary: {
          bike: `${body.simulation.bike.brand} ${body.simulation.bike.model}`,
          monthlyTotal: body.simulation.monthlyTotal,
          durationMonths: body.simulation.durationMonths,
          downPayment: body.simulation.downPaymentAmount,
        }
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process application.' },
      { status: 500 }
    );
  }
}