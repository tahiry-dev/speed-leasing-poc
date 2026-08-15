import { Bike, LeasingCalculationRequest, LeasingCalculationResult } from '@/types/bike';

export const BIKES_CATALOG: Bike[] = [
  {
    id: 'harley-fat-boy',
    brand: 'Harley-Davidson',
    model: 'Fat Boy 114',
    year: 2025,
    engine: '1,868 cc (Milwaukee-Eight 114)',
    torque: '119 ft-lb @ 3,000 rpm',
    power: '94 HP',
    category: 'Cruiser',
    price: 21999,
    monthlyEstimate: 395,
    color: 'Vivid Black / Chrome',
    accent: '#f59e0b',
    image: '/bikes/harley-fat-boy.svg',
    features: [
      'Machined solid-disc Lakester aluminum wheels',
      'Staggered dual chrome exhaust with slash-cut mufflers',
      'Signature high-output LED forward lighting',
      'Reflex Linked Brembo electronic ABS braking system'
    ]
  },
  {
    id: 'harley-breakout-117',
    brand: 'Harley-Davidson',
    model: 'Breakout 117',
    year: 2025,
    engine: '1,923 cc (Milwaukee-Eight 117)',
    torque: '124 ft-lb @ 3,500 rpm',
    power: '102 HP',
    category: 'Custom Chopper',
    price: 22499,
    monthlyEstimate: 425,
    color: 'Baja Orange Chrome',
    accent: '#ea580c',
    image: '/bikes/harley-breakout-117.svg',
    features: [
      'Massive 240mm wide profile rear tire',
      'Forward-facing Heavy Breather intake manifold',
      '34-degree custom-raked front fork suspension',
      'Switchable Traction Control System (TCS)'
    ]
  },
  {
    id: 'indian-scout-bobber',
    brand: 'Indian Motorcycle',
    model: 'Scout Bobber Twenty',
    year: 2025,
    engine: '1,133 cc (Liquid-Cooled V-Twin)',
    torque: '72 ft-lb @ 5,600 rpm',
    power: '100 HP',
    category: 'Bobber',
    price: 13999,
    monthlyEstimate: 265,
    color: 'Black Smoke Matte',
    accent: '#38bdf8',
    image: '/bikes/indian-scout-bobber.svg',
    features: [
      '10-inch authentic mini-ape style handlebars',
      'Suspended genuine weathered leather solo seat',
      'Retro-styled blacked-out wire-spoked wheels',
      'Sleek bar-end inverted side mirrors'
    ]
  },
  {
    id: 'ducati-diavel-v4',
    brand: 'Ducati',
    model: 'Diavel V4',
    year: 2025,
    engine: '1,158 cc (V4 Granturismo)',
    torque: '93 ft-lb @ 7,500 rpm',
    power: '168 HP',
    category: 'Power Cruiser',
    price: 26995,
    monthlyEstimate: 479,
    color: 'Ducati Red',
    accent: '#ef4444',
    image: '/bikes/ducati-diavel-v4.svg',
    features: [
      'Aggressive quad-pipe side exhaust layout',
      '5-inch full-color TFT display with multimedia connectivity',
      'Ducati Quick Shift (DQS) Up/Down EVO system',
      'Retractable point-matrix rear LED tail lamp'
    ]
  },
  {
    id: 'bmw-r18-transcontinental',
    brand: 'BMW Motorrad',
    model: 'R 18 Transcontinental',
    year: 2025,
    engine: '1,802 cc (Big Boxer)',
    torque: '116 ft-lb @ 3,000 rpm',
    power: '91 HP',
    category: 'Grand Tourer',
    price: 23995,
    monthlyEstimate: 435,
    color: 'Black Storm Metallic',
    accent: '#0ea5e9',
    image: '/bikes/bmw-r18-transcontinental.svg',
    features: [
      'Marshall Gold Series premium 4-speaker audio system',
      'Active Cruise Control (ACC) with radar distance sensors',
      'Integrated color-matched 27L hard saddlebags & top case',
      'Factory electric reverse gear assistance'
    ]
  },
  {
    id: 'triumph-rocket-3-gt',
    brand: 'Triumph',
    model: 'Rocket 3 GT',
    year: 2025,
    engine: '2,458 cc (Inline 3-Cylinder)',
    torque: '163 ft-lb @ 4,000 rpm',
    power: '167 HP',
    category: 'Muscle Roadster',
    price: 24995,
    monthlyEstimate: 449,
    color: 'Sapphire Black / Silver Ice',
    accent: '#a855f7',
    image: '/bikes/triumph-rocket-3-gt.svg',
    features: [
      'Largest production motorcycle engine displacement (2,458 cc)',
      'Sculpted brushed aluminum single-sided swingarm',
      '3-position adjustable forward foot controls',
      'Standard heated hand grips & touring windscreen'
    ]
  }
];

export function calculateLease(params: LeasingCalculationRequest): LeasingCalculationResult {
  const bike = BIKES_CATALOG.find((b) => b.id === params.bikeId) || BIKES_CATALOG[0];
  
  // Down payment calculation ($)
  const downPaymentAmount = Math.round(bike.price * (params.downPaymentPercent / 100));
  
  // Residual value estimation (52% for 24 months, 44% for 36 months, 36% for 48 months)
  const residualRate = params.durationMonths === 24 ? 0.52 : params.durationMonths === 36 ? 0.44 : 0.36;
  const residualValue = Math.round(bike.price * residualRate);
  
  // Net capitalized cost to amortize
  const amountToFinance = bike.price - downPaymentAmount - residualValue;
  
  // Fixed annual money factor / interest rate (4.9% APR)
  const monthlyRate = 0.049 / 12;
  const monthlyBase = Math.round(
    (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -params.durationMonths)) +
    (residualValue * monthlyRate)
  );

  // Optional add-on services ($/month)
  let monthlyOptions = 0;
  if (params.includeMaintenance) monthlyOptions += 45; // Factory scheduled maintenance & tire care
  if (params.includeInsurance) monthlyOptions += 55; // Full comprehensive VIP rider insurance
  if (params.annualMiles === 6000) monthlyOptions += 25; // Tier 2 mileage allowance
  if (params.annualMiles === 10000) monthlyOptions += 50; // Unlimited / Tier 3 mileage allowance

  const monthlyTotal = monthlyBase + monthlyOptions;
  const totalCostOfLease = downPaymentAmount + (monthlyTotal * params.durationMonths);

  return {
    bike,
    durationMonths: params.durationMonths,
    downPaymentPercent: params.downPaymentPercent,
    downPaymentAmount,
    annualMiles: params.annualMiles,
    residualValue,
    monthlyBase,
    monthlyOptions,
    monthlyTotal,
    totalCostOfLease,
  };
}