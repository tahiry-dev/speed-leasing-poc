'use client';

import React, { useState } from 'react';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTradeIn: (estimatedValue: number) => void;
  currentMSRP: number;
}

export default function TradeInModal({
  isOpen,
  onClose,
  onApplyTradeIn,
  currentMSRP,
}: TradeInModalProps) {
  const [brand, setBrand] = useState('Harley-Davidson');
  const [year, setYear] = useState(2021);
  const [mileage, setMileage] = useState(12000);
  const [condition, setCondition] = useState<'excellent' | 'good' | 'fair'>('good');
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  if (!isOpen) return null;

  const calculateTradeIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base de calcul selon la marque et l'âge
    const currentYear = 2026;
    const age = Math.max(0, currentYear - year);
    
    let baseVal = 14000;
    if (brand === 'Harley-Davidson') baseVal = 16000;
    if (brand === 'Ducati') baseVal = 17500;
    if (brand === 'BMW') baseVal = 15500;
    if (brand === 'Indian') baseVal = 14500;
    if (brand === 'Yamaha' || brand === 'Honda') baseVal = 9500;

    // Dépréciation annuelle (approx 7% par an)
    let val = baseVal * Math.pow(0.93, age);

    // Ajustement kilométrage
    const excessMiles = Math.max(0, mileage - age * 4000);
    val -= (excessMiles / 1000) * 80;

    // Facteur d'état
    if (condition === 'excellent') val *= 1.08;
    if (condition === 'fair') val *= 0.85;

    // Plafond minimum réaliste
    const finalVal = Math.max(1500, Math.round(val / 50) * 50);
    setEstimatedValue(finalVal);
  };

  const handleApply = () => {
    if (estimatedValue) {
      onApplyTradeIn(estimatedValue);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {/* Titre */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            Trade-In Valuation Engine
          </span>
          <h3 className="text-2xl font-black text-white mt-2">
            Value Your Current Ride
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Get an instant valuation credit and use it directly as your lease down payment.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={calculateTradeIn} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Make</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Harley-Davidson">Harley-Davidson</option>
                <option value="Ducati">Ducati</option>
                <option value="BMW">BMW</option>
                <option value="Indian">Indian</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Honda">Honda</option>
                <option value="Other">Other Make</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Model Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-neutral-400 mb-1">
              <span>Odometer Mileage</span>
              <span className="text-white font-mono">{mileage.toLocaleString('en-US')} miles</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">Vehicle Condition</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'excellent', label: 'Excellent', sub: 'Showroom condition' },
                { id: 'good', label: 'Good', sub: 'Minor wear' },
                { id: 'fair', label: 'Fair', sub: 'Noticeable wear' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCondition(c.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    condition === c.id
                      ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold">{c.label}</div>
                  <div className="text-[9px] text-neutral-500">{c.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            Calculate Estimated Credit
          </button>
        </form>

        {/* Résultat de l'estimation */}
        {estimatedValue !== null && (
          <div className="mt-6 p-4 bg-neutral-950 border border-amber-500/40 rounded-2xl animate-in fade-in">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Estimated Trade-In Credit
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ${estimatedValue.toLocaleString('en-US')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
              >
                Apply to Lease Plan →
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 mt-2">
              *Preliminary instant appraisal subject to final physical check at the Speed Leasing VIP Lounge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}