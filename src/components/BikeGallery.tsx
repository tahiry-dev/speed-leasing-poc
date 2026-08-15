'use client';

import React from 'react';
import Image from 'next/image';
import { BIKES_CATALOG } from '../lib/bikes-data';
import { Bike } from '../types/bike';

interface BikeGalleryProps {
  selectedBikeId: string;
  onSelectBike: (bikeId: string) => void;
}

export default function BikeGallery({ selectedBikeId, onSelectBike }: BikeGalleryProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Step 1: Choose Your Ride
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-3">
          Explore Our Fleet
        </h2>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto mt-1">
          Select an iconic motorcycle to configure your custom lease program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BIKES_CATALOG.map((bike: Bike) => {
          const isSelected = bike.id === selectedBikeId;

          return (
            <div
              key={bike.id}
              onClick={() => onSelectBike(bike.id)}
              className={`group relative rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              {/* Badge & Prix indicatif */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {bike.category}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  ${bike.price.toLocaleString('en-US')}
                </span>
              </div>

              {/* Titre & Marque */}
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {bike.brand} {bike.model}
                </h3>
                <p className="text-xs text-neutral-500 mb-4">{bike.color}</p>
              </div>

              {/* Image Moto */}
              <div className="relative aspect-[16/10] w-full my-2 bg-neutral-950 rounded-2xl border border-neutral-800/60 overflow-hidden flex items-center justify-center">
                <Image
                  src={bike.image}
                  alt={`${bike.brand} ${bike.model}`}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Spécifications rapides */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-[11px]">
                <div className="text-neutral-400">
                  Power: <span className="font-semibold text-neutral-200">{bike.power}</span>
                </div>
                <div className="text-neutral-400 text-right">
                  Torque: <span className="font-semibold text-neutral-200">{bike.torque}</span>
                </div>
              </div>

              {/* Bouton de sélection */}
              <button
                type="button"
                className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700'
                }`}
              >
                {isSelected ? 'Selected' : 'Select Bike'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}