'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Bike } from '../types/bike';
import { BIKES_CATALOG } from '../lib/bikes-data';

interface BikeComparisonProps {
  onSelectBike: (bikeId: string) => void;
}

export default function BikeComparison({ onSelectBike }: BikeComparisonProps) {
  const [selectedBikeIds, setSelectedBikeIds] = useState<string[]>([
    BIKES_CATALOG[0].id,
    BIKES_CATALOG[3].id,
  ]);

  const handleSelectChange = (slotIndex: number, bikeId: string) => {
    const updated = [...selectedBikeIds];
    updated[slotIndex] = bikeId;
    setSelectedBikeIds(updated);
  };

  const comparedBikes: Bike[] = selectedBikeIds.map(
    (id) => BIKES_CATALOG.find((b) => b.id === id) || BIKES_CATALOG[0]
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Step 1: Discover & Compare
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
          Compare Premium Fleet Machines
        </h2>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-1">
          Evaluate technical attributes and baseline rates side-by-side, then jump straight into configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparedBikes.map((bike, idx) => (
          <div
            key={idx}
            className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between"
          >
            <div>
              {/* Bike Selector Dropdown */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Slot #{idx + 1} Model
                </label>
                <select
                  value={bike.id}
                  onChange={(e) => handleSelectChange(idx, e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                >
                  {BIKES_CATALOG.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.brand} — {b.model} (${b.price.toLocaleString('en-US')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Visual Card */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-5">
                <Image
                  src={bike.image}
                  alt={`${bike.brand} ${bike.model}`}
                  fill
                  className="object-contain p-3"
                />
              </div>

              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-neutral-800 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
                    {bike.category}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {bike.brand} {bike.model}
                  </h3>
                  <span className="text-xs text-neutral-400">{bike.color}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-500">Starting at</span>
                  <div className="text-lg font-bold text-amber-500">
                    ${bike.monthlyEstimate} <span className="text-xs text-neutral-400 font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">MSRP</span>
                  <span className="font-semibold text-white">${bike.price.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Powertrain</span>
                  <span className="font-semibold text-white">{bike.engine}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Peak Torque</span>
                  <span className="font-semibold text-white">{bike.torque}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Output</span>
                  <span className="font-semibold text-white">{bike.power}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Equipment Standard
                </span>
                <ul className="mt-2 space-y-1.5">
                  {bike.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-xs text-neutral-300 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-amber-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Link to Simulator Button */}
            <button
              onClick={() => onSelectBike(bike.id)}
              className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white font-semibold text-xs transition-all duration-200"
            >
              Configure {bike.model} in Simulator ↓
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}