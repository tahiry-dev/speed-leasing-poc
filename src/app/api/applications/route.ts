import { NextResponse } from 'next/server';

// Base de données en mémoire pour le POC
interface ApplicationRecord {
  referenceId: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    type: string;
    annualIncome: number;
  };
  simulation: any;
  status: 'pre_approved' | 'underwriting' | 'contract_ready' | 'delivered';
  createdAt: string;
  statusHistory: Array<{
    step: string;
    date: string;
    completed: boolean;
    active: boolean;
  }>;
}

// Données initiales avec un dossier de démonstration pré-rempli
const applicationsDB: Map<string, ApplicationRecord> = new Map([
  [
    'SPL-DEMO1',
    {
      referenceId: 'SPL-DEMO1',
      applicant: {
        fullName: 'Alex Vance',
        email: 'alex@example.com',
        phone: '+1 (555) 234-5678',
        type: 'individual',
        annualIncome: 95000,
      },
      simulation: {
        bike: {
          id: 'ducati-diavel-v4',
          brand: 'Ducati',
          model: 'Diavel V4',
          price: 26995,
          color: 'Ducati Red',
          category: 'Power Cruiser',
          engine: '1,158 cc (V4 Granturismo)',
          power: '168 HP',
          torque: '93 ft-lb',
          image: '/bikes/ducati-diavel.svg',
          features: ['Monocoque Aluminum Frame', 'Turn-by-Turn Navigation'],
        },
        durationMonths: 36,
        downPaymentPercent: 15,
        downPaymentAmount: 4049,
        annualMiles: 6000,
        residualValue: 14847,
        monthlyBase: 442,
        monthlyOptions: 45,
        monthlyTotal: 487,
        totalCostOfLease: 21581,
      },
      status: 'underwriting',
      createdAt: '2026-08-14T10:00:00Z',
      statusHistory: [
        { step: 'Pre-Approval Request Submitted', date: 'Aug 14, 2026', completed: true, active: false },
        { step: 'Credit & Underwriting Assessment', date: 'In Progress', completed: false, active: true },
        { step: 'Formal Digital Contract Signature', date: 'Pending', completed: false, active: false },
        { step: 'VIP Dealership Delivery', date: 'Pending', completed: false, active: false },
      ],
    },
  ],
]);

// 1. POST : New inquiry submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, applicantType, annualIncome, simulation } = body;

    if (!fullName || !email || !simulation) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // unique reference SPL-XXXXX creation
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referenceId = `SPL-${randomSuffix}`;

    const newRecord: ApplicationRecord = {
      referenceId,
      applicant: {
        fullName,
        email,
        phone,
        type: applicantType || 'individual',
        annualIncome: Number(annualIncome) || 0,
      },
      simulation,
      status: 'pre_approved',
      createdAt: new Date().toISOString(),
      statusHistory: [
        { step: 'Pre-Approval Request Submitted', date: 'Just now', completed: true, active: false },
        { step: 'Credit & Underwriting Assessment', date: 'Within 24h', completed: false, active: true },
        { step: 'Formal Digital Contract Signature', date: 'Pending', completed: false, active: false },
        { step: 'VIP Dealership Delivery', date: 'Pending', completed: false, active: false },
      ],
    };

    applicationsDB.set(referenceId, newRecord);

    return NextResponse.json({
      success: true,
      referenceId,
      status: newRecord.status,
      message: 'Application successfully registered',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. GET : customer application dossier retrieval by reference ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref')?.trim().toUpperCase();

  if (!ref) {
    return NextResponse.json({ success: false, error: 'Reference ID is required' }, { status: 400 });
  }

  const record = applicationsDB.get(ref);

  if (!record) {
    return NextResponse.json({ success: false, error: 'Application dossier not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, application: record });
}