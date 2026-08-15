'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Bike, LeasingCalculationRequest } from '../types/bike';
import { BIKES_CATALOG, calculateLease } from '../lib/bikes-data';

export default function LeaseSimulator() {
  const [selectedBikeId, setSelectedBikeId] = useState<string>(BIKES_CATALOG[0].id);
  const [durationMonths, setDurationMonths] = useState<24 | 36 | 48>(36);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(15);
  const [annualMiles, setAnnualMiles] = useState<3000 | 6000 | 10000>(6000);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);

  // Active selected bike object
  const selectedBike = useMemo(() => {
    return BIKES_CATALOG.find((b) => b.id === selectedBikeId) || BIKES_CATALOG[0];
  }, [selectedBikeId]);

  // Compute live leasing calculation
  const leaseResult = useMemo(() => {
    const request: LeasingCalculationRequest = {
      bikeId: selectedBike.id,
      durationMonths,
      downPaymentPercent,
      annualMiles,
      includeMaintenance,
      includeInsurance,
    };
    return calculateLease(request);
  }, [selectedBike.id, durationMonths, downPaymentPercent, annualMiles, includeMaintenance, includeInsurance]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Executive Motorcycle Leasing
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
          Configure Your Dream Ride
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Select a premium machine, customize your lease parameters, and get instant monthly installment simulations.
        </p>
      </div>

      {/* Model selector horizontal tab / pill list */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {BIKES_CATALOG.map((bike) => {
          const isSelected = bike.id === selectedBike.id;
          return (
            <button
              key={bike.id}
              onClick={() => setSelectedBikeId(bike.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              <div className="text-xs opacity-75">{bike.brand}</div>
              <div>{bike.model}</div>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bike Visual Showcase & Specs */}
        <div className="lg:col-span-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80">
            <Image
              src={selectedBike.image}
              alt={`${selectedBike.brand} ${selectedBike.model}`}
              fill
              className="object-contain p-4 transition-all duration-300"
              priority
            />
          </div>

          <div className="mt-6 flex items-baseline justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {selectedBike.category}
              </span>
              <h3 className="text-2xl font-bold text-white mt-0.5">
                {selectedBike.brand} {selectedBike.model}
              </h3>
              <p className="text-neutral-400 text-sm">{selectedBike.color}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500">MSRP</span>
              <div className="text-xl font-bold text-white">
                ${selectedBike.price.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          {/* Technical specifications grid */}
          <div className="grid grid-cols-3 gap-3 my-4 py-2 text-center bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/50">
            <div>
              <div className="text-xs text-neutral-500 uppercase">Displacement</div>
              <div className="text-sm font-semibold text-neutral-200 mt-0.5">{selectedBike.engine.split('(')[0]}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 uppercase">Torque</div>
              <div className="text-sm font-semibold text-neutral-200 mt-0.5">{selectedBike.torque.split('@')[0]}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 uppercase">Power Output</div>
              <div className="text-sm font-semibold text-neutral-200 mt-0.5">{selectedBike.power}</div>
            </div>
          </div>

          {/* Key Features Bullet List */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Key Highlights</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedBike.features.map((feat, idx) => (
                <li key={idx} className="text-xs text-neutral-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Lease Controls & Live Estimation */}
        <div className="lg:col-span-6 bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Lease Simulation Engine</h3>
              <span className="text-xs text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-md">Fixed 4.9% APR</span>
            </div>

            {/* Contract Duration Selector */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-300 font-medium">Contract Duration</span>
                <span className="text-amber-500 font-bold">{durationMonths} Months</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([24, 36, 48] as const).map((months) => (
                  <button
                    key={months}
                    onClick={() => setDurationMonths(months)}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      durationMonths === months
                        ? 'bg-neutral-100 text-neutral-950 border-neutral-100'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {months} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-300 font-medium">Initial Down Payment</span>
                <span className="text-amber-500 font-bold">
                  {downPaymentPercent}% (${leaseResult.downPaymentAmount.toLocaleString('en-US')})
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
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>0% ($0)</span>
                <span>15%</span>
                <span>30% (${Math.round(selectedBike.price * 0.3).toLocaleString('en-US')})</span>
              </div>
            </div>

            {/* Annual Mileage Tier */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-300 font-medium">Annual Mileage Allowance</span>
                <span className="text-amber-500 font-bold">{annualMiles.toLocaleString('en-US')} mi / yr</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([3000, 6000, 10000] as const).map((miles) => (
                  <button
                    key={miles}
                    onClick={() => setAnnualMiles(miles)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      annualMiles === miles
                        ? 'bg-neutral-100 text-neutral-950 border-neutral-100'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {miles >= 10000 ? '10,000+ mi' : `${miles.toLocaleString('en-US')} mi`}
                  </button>
                ))}
              </div>
            </div>

            {/* Add-on Services Checklist */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeMaintenance}
                    onChange={(e) => setIncludeMaintenance(e.target.checked)}
                    className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 accent-amber-500 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Full Factory Maintenance</div>
                    <div className="text-xs text-neutral-500">Scheduled services, oil, wear & tear inspection</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-neutral-300">+$45/mo</span>
              </label>

              <label className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 accent-amber-500 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Comprehensive VIP Rider Insurance</div>
                    <div className="text-xs text-neutral-500">Zero deductible, theft, and total road assistance</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-neutral-300">+$55/mo</span>
              </label>
            </div>
          </div>

          {/* Pricing Summary Output Box */}
          <div className="mt-8 pt-6 border-t border-neutral-800 bg-neutral-950/80 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Estimated Installment</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-4xl font-extrabold text-amber-500">
                    ${leaseResult.monthlyTotal}
                  </span>
                  <span className="text-sm text-neutral-400 font-medium">/ month</span>
                </div>
              </div>
              <div className="text-right text-xs text-neutral-400 space-y-1">
                <div>Buyout Option: <span className="text-white font-semibold">${leaseResult.residualValue.toLocaleString('en-US')}</span></div>
                <div>Total Contract: <span className="text-white font-semibold">${leaseResult.totalCostOfLease.toLocaleString('en-US')}</span></div>
              </div>
            </div>

            <button
              onClick={() => alert(`Application initiated for ${selectedBike.brand} ${selectedBike.model} at $${leaseResult.monthlyTotal}/month.`)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              Apply For Pre-Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}