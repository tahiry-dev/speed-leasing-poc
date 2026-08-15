'use client';

import React, { useEffect, useState } from 'react';
import { Bike } from '../types/bike';

interface TechSpecsBarsProps {
  bike: Bike;
}

type ActiveMetric = 'engine' | 'power' | 'torque' | null;

// Hook utilitaire pour faire défiler les chiffres de 0 à la valeur cible
function useAnimatedCounter(targetValue: number, durationMs: number = 800) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Easing out quadratic
      const easeOut = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.round(startVal + (targetValue - startVal) * easeOut));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue, durationMs]);

  return displayValue;
}

export default function TechSpecsBars({ bike }: TechSpecsBarsProps) {
  const [animate, setAnimate] = useState(false);
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('power');

  // Extraction numérique
  const parseDisplacement = (engine: string) => {
    const match = engine.match(/([\d,]+)\s*cc/);
    return match ? parseInt(match[1].replace(',', ''), 10) : 1200;
  };

  const parsePower = (power: string) => {
    const match = power.match(/(\d+)\s*HP/);
    return match ? parseInt(match[1], 10) : 100;
  };

  const parseTorque = (torque: string) => {
    const match = torque.match(/(\d+)\s*ft-lb/);
    return match ? parseInt(match[1], 10) : 100;
  };

  const targetDisplacement = parseDisplacement(bike.engine);
  const targetPower = parsePower(bike.power);
  const targetTorque = parseTorque(bike.torque);

  // Compteurs animés
  const countDisplacement = useAnimatedCounter(targetDisplacement, 900);
  const countPower = useAnimatedCounter(targetPower, 900);
  const countTorque = useAnimatedCounter(targetTorque, 900);

  // Pourcentages
  const displacementPct = Math.min(100, Math.round((targetDisplacement / 2000) * 100));
  const powerPct = Math.min(100, Math.round((targetPower / 200) * 100));
  const torquePct = Math.min(100, Math.round((targetTorque / 150) * 100));

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(timer);
  }, [bike.id]);

  const toggleMetric = (metric: ActiveMetric) => {
    setActiveMetric((prev) => (prev === metric ? null : metric));
  };

  return (
    <div className="space-y-3">
      {/* 3 Cartes Interactives */}
      <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-neutral-950/90 border border-neutral-800/90 rounded-2xl">
        {/* 1. Engine / Cylindrée */}
        <button
          type="button"
          onClick={() => toggleMetric('engine')}
          className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-300 transform active:scale-95 cursor-pointer ${
            activeMetric === 'engine'
              ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10 -translate-y-0.5'
              : 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-700 hover:bg-neutral-900/80'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Engine
            </span>
            <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activeMetric === 'engine' ? 'bg-amber-400 shadow-sm shadow-amber-400 scale-125' : 'bg-neutral-700'
            }`} />
          </div>
          <div className="text-base sm:text-lg font-black text-white font-mono my-1.5 tabular-nums">
            {countDisplacement} <span className="text-[10px] font-normal text-neutral-400">cc</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-400 to-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: animate ? `${displacementPct}%` : '0%' }}
            />
          </div>
        </button>

        {/* 2. Power */}
        <button
          type="button"
          onClick={() => toggleMetric('power')}
          className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-300 transform active:scale-95 cursor-pointer ${
            activeMetric === 'power'
              ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10 -translate-y-0.5'
              : 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-700 hover:bg-neutral-900/80'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Power
            </span>
            <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activeMetric === 'power' ? 'bg-amber-400 shadow-sm shadow-amber-400 scale-125' : 'bg-neutral-700'
            }`} />
          </div>
          <div className="text-base sm:text-lg font-black text-amber-400 font-mono my-1.5 tabular-nums">
            {countPower} <span className="text-[10px] font-normal text-amber-500/80">HP</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 rounded-full transition-all duration-1000 ease-out"
              style={{ width: animate ? `${powerPct}%` : '0%' }}
            />
          </div>
        </button>

        {/* 3. Torque */}
        <button
          type="button"
          onClick={() => toggleMetric('torque')}
          className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-300 transform active:scale-95 cursor-pointer ${
            activeMetric === 'torque'
              ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10 -translate-y-0.5'
              : 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-700 hover:bg-neutral-900/80'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Torque
            </span>
            <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activeMetric === 'torque' ? 'bg-amber-400 shadow-sm shadow-amber-400 scale-125' : 'bg-neutral-700'
            }`} />
          </div>
          <div className="text-base sm:text-lg font-black text-white font-mono my-1.5 tabular-nums">
            {countTorque} <span className="text-[10px] font-normal text-neutral-400">ft-lb</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-400 to-amber-300 rounded-full transition-all duration-1000 ease-out"
              style={{ width: animate ? `${torquePct}%` : '0%' }}
            />
          </div>
        </button>
      </div>

      {/* Explication Contextuelle avec transition de fondu */}
      {activeMetric && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-neutral-200 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
          {activeMetric === 'engine' && (
            <p>
              <strong className="text-amber-400">Powertrain Architecture:</strong> {bike.engine}. Represents{' '}
              <span className="text-white font-bold">{displacementPct}%</span> of our maximum displacement tier.
            </p>
          )}
          {activeMetric === 'power' && (
            <p>
              <strong className="text-amber-400">Peak Output:</strong> {bike.power}. High rev-band horsepower tuned for rapid acceleration and highway cruising.
            </p>
          )}
          {activeMetric === 'torque' && (
            <p>
              <strong className="text-amber-400">Low-End Pull:</strong> {bike.torque}. Instant torque delivery straight off idle for effortless overtakes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}