'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Bike, LeasingCalculationResult } from '../types/bike';
import { BIKES_CATALOG } from '../lib/bikes-data';
import TechSpecsBars from './TechSpecsBars';
import ApplicationModal from './ApplicationModal';

interface LeaseSimulatorProps {
  activeBikeId: string;
  onBikeChange: (bikeId: string) => void;
}

export default function LeaseSimulator({ activeBikeId, onBikeChange }: LeaseSimulatorProps) {
  // Paramètres financiers configurables
  const [durationMonths, setDurationMonths] = useState<24 | 36 | 48>(36);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(15);
  const [annualMiles, setAnnualMiles] = useState<3000 | 6000 | 10000>(6000);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Moto active
  const currentBike: Bike = useMemo(() => {
    return BIKES_CATALOG.find((b) => b.id === activeBikeId) || BIKES_CATALOG[0];
  }, [activeBikeId]);

  // Moteur de calcul financier (APR fixe 4.9%)
  const simulationResult: LeasingCalculationResult = useMemo(() => {
    const msrp = currentBike.price;
    const apr = 0.049;
    const monthlyRate = apr / 12;

    // 1. Apport initial
    const downPaymentAmount = Math.round((msrp * downPaymentPercent) / 100);

    // 2. Facteur de valeur résiduelle (selon durée et kilométrage)
    let residualPercent = 0.55; // 36 mois / standard
    if (durationMonths === 24) residualPercent = 0.65;
    if (durationMonths === 48) residualPercent = 0.45;

    // Ajustement kilométrage
    if (annualMiles === 3000) residualPercent += 0.03;
    if (annualMiles === 10000) residualPercent -= 0.04;

    const residualValue = Math.round(msrp * residualPercent);

    // 3. Amortissement & frais financiers
    const netCapitalizedCost = msrp - downPaymentAmount;
    const depreciationMonthly = (netCapitalizedCost - residualValue) / durationMonths;
    const financeChargeMonthly = (netCapitalizedCost + residualValue) * monthlyRate;
    const monthlyBase = Math.round(Math.max(50, depreciationMonthly + financeChargeMonthly));

    // 4. Options & Services
    let monthlyOptions = 0;
    if (includeMaintenance) monthlyOptions += 45;
    if (includeInsurance) monthlyOptions += 55;

    const monthlyTotal = monthlyBase + monthlyOptions;
    const totalCostOfLease = downPaymentAmount + monthlyTotal * durationMonths;

    return {
      bike: currentBike,
      durationMonths,
      downPaymentPercent,
      downPaymentAmount,
      annualMiles,
      residualValue,
      monthlyBase,
      monthlyOptions,
      monthlyTotal,
      totalCostOfLease,
    };
  }, [currentBike, durationMonths, downPaymentPercent, annualMiles, includeMaintenance, includeInsurance]);

  return (
    <section id="simulator-section" className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Step 2: Financial Simulator
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
          Customize Your Payment Plan
        </h2>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-2">
          Fine-tune contract terms, adjust down payment, and request immediate VIP pre-approval.
        </p>
      </div>

      {/* Model Quick Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-neutral-800">
        {BIKES_CATALOG.map((bike) => {
          const active = bike.id === currentBike.id;
          return (
            <button
              key={bike.id}
              onClick={() => onBikeChange(bike.id)}
              className={`px-4 py-2.5 rounded-xl border text-left whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                active
                  ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/40'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{bike.brand}</div>
              <div className="text-xs font-bold">{bike.model}</div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Visuals & Tech Specs vs Financial Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bike Visual Showcase & Specs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
                  {currentBike.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {currentBike.brand} {currentBike.model}
                </h3>
                <p className="text-xs text-neutral-400">{currentBike.color}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-500 uppercase block">MSRP</span>
                <span className="text-base font-bold text-white font-mono">
                  ${currentBike.price.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-6 flex items-center justify-center">
              <Image
                src={currentBike.image}
                alt={`${currentBike.brand} ${currentBike.model}`}
                fill
                className="object-contain p-4"
                priority
              />
            </div>

            {/* Jauges Techniques Animées */}
            <TechSpecsBars bike={currentBike} />

            {/* Key Features List */}
            <div className="mt-6 pt-4 border-t border-neutral-800/80">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Key Highlights
              </span>
              <ul className="space-y-1.5">
                {currentBike.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2">
                    <span className="text-amber-500 text-xs">◆</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Controls & Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white">Lease Simulation Engine</h3>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
                Fixed 4.9% APR
              </span>
            </div>

            {/* 1. Contract Duration */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-neutral-400">Contract Duration</span>
                <span className="text-amber-400 font-bold">{durationMonths} Months</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[24, 36, 48].map((term) => (
                  <button
                    key={term}
                    onClick={() => setDurationMonths(term as 24 | 36 | 48)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all duration-150 ${
                      durationMonths === term
                        ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {term} mo
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Down Payment Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-neutral-400">Initial Down Payment</span>
                <span className="text-amber-400 font-bold">
                  {downPaymentPercent}% (${simulationResult.downPaymentAmount.toLocaleString('en-US')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>0% ($0)</span>
                <span>15%</span>
                <span>30% (${Math.round(currentBike.price * 0.3).toLocaleString('en-US')})</span>
              </div>
            </div>

            {/* 3. Mileage Tier */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-neutral-400">Annual Mileage Allowance</span>
                <span className="text-amber-400 font-bold">
                  {annualMiles.toLocaleString('en-US')} mi / yr
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[3000, 6000, 10000].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setAnnualMiles(tier as 3000 | 6000 | 10000)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                      annualMiles === tier
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {tier.toLocaleString('en-US')} mi
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Add-on Services Checkboxes */}
            <div className="space-y-3 pt-2">
              <label
                onClick={() => setIncludeMaintenance(!includeMaintenance)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  includeMaintenance
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                      includeMaintenance
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'border-neutral-600'
                    }`}
                  >
                    {includeMaintenance && '✓'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-200">Full Factory Maintenance</div>
                    <div className="text-[10px] text-neutral-400">Scheduled services, oil, wear & tear inspection</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">+$45/mo</span>
              </label>

              <label
                onClick={() => setIncludeInsurance(!includeInsurance)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  includeInsurance
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                      includeInsurance
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'border-neutral-600'
                    }`}
                  >
                    {includeInsurance && '✓'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-200">Comprehensive VIP Rider Insurance</div>
                    <div className="text-[10px] text-neutral-400">Zero deductible, theft, and total road assistance</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">+$55/mo</span>
              </label>
            </div>

            {/* Estimated Output & Call to Action */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Estimated Installment
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                    ${simulationResult.monthlyTotal}
                  </span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
              </div>

              <div className="text-right text-xs text-neutral-400 hidden sm:block">
                <div>Buyout Option: <span className="font-bold text-neutral-200 font-mono">${simulationResult.residualValue.toLocaleString('en-US')}</span></div>
                <div>Total Contract: <span className="font-bold text-neutral-200 font-mono">${simulationResult.totalCostOfLease.toLocaleString('en-US')}</span></div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              Apply For Pre-Approval
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Pré-Approbation */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        simulation={simulationResult}
      />
    </section>
  );
}