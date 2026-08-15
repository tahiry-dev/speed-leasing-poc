export interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  torque: string;
  power: string;
  category: 'Cruiser' | 'Custom Chopper' | 'Bobber' | 'Power Cruiser' | 'Grand Tourer' | 'Muscle Roadster';
  price: number; // Purchase price in USD ($)
  monthlyEstimate: number; // Starting monthly payment in USD ($/month)
  color: string;
  accent: string;
  image: string;
  features: string[];
}

export interface LeasingCalculationRequest {
  bikeId: string;
  durationMonths: 24 | 36 | 48;
  downPaymentPercent: number; // Range: 0% to 30%
  annualMiles: 3000 | 6000 | 10000; // Annual mileage tier in miles
  includeMaintenance: boolean;
  includeInsurance: boolean;
}

export interface LeasingCalculationResult {
  bike: Bike;
  durationMonths: number;
  downPaymentPercent: number;
  downPaymentAmount: number; // Down payment amount in USD ($)
  annualMiles: number;
  residualValue: number; // Guaranteed buyout value at lease maturity ($)
  monthlyBase: number; // Base monthly installment ($)
  monthlyOptions: number; // Add-on services monthly cost ($)
  monthlyTotal: number; // Total monthly installment ($)
  totalCostOfLease: number; // Total lease contract commitment ($)
}