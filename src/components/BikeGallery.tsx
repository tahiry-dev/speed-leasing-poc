'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { BIKES_CATALOG } from '../lib/bikes-data';
import { Bike } from '../types/bike';

interface BikeGalleryProps {
  selectedBikeId: string;
  onSelectBike: (bikeId: string) => void;
}

export default function BikeGallery({ selectedBikeId, onSelectBike }: BikeGalleryProps) {
  const [detailBike, setDetailBike] = useState<Bike | null>(null);
  
  // États des filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(30000);

  // Extraction unique des catégories et marques
  const categories = useMemo(() => {
    const set = new Set(BIKES_CATALOG.map((b) => b.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  const brands = useMemo(() => {
    const set = new Set(BIKES_CATALOG.map((b) => b.brand));
    return ['ALL', ...Array.from(set)];
  }, []);

  // Filtrage réactif
  const filteredBikes = useMemo(() => {
    return BIKES_CATALOG.filter((bike) => {
      const matchesSearch =
        bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || bike.category === selectedCategory;

      const matchesBrand =
        selectedBrand === 'ALL' || bike.brand === selectedBrand;

      const matchesPrice = bike.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedBrand, maxPrice]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setMaxPrice(30000);
  };

  const handleSelectAndScroll = (bikeId: string) => {
    onSelectBike(bikeId);
    if (detailBike) setDetailBike(null);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Step 1: Choose Your Ride
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-3">
          Explore Our Fleet
        </h2>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto mt-1">
          Filter by category, brand, or budget to find your ultimate machine.
        </p>
      </div>

      {/* Barre de Filtres & Recherche */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 mb-8 backdrop-blur-sm shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Recherche texte */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search model or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="absolute left-3.5 top-2.5 text-neutral-500 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Marque */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'ALL' ? 'All Makes & Brands' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Slider Budget Max MSRP */}
          <div className="md:col-span-5 flex flex-col justify-center px-1">
            <div className="flex justify-between text-[11px] font-semibold text-neutral-400 mb-1">
              <span>Max MSRP:</span>
              <span className="text-amber-400 font-mono font-bold">${maxPrice.toLocaleString('en-US')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="30000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Pilules de Catégories */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 shadow-sm shadow-amber-500/20'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-neutral-400">
            Showing <strong className="text-white">{filteredBikes.length}</strong> machine{filteredBikes.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Grid des cartes filtrées */}
      {filteredBikes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBikes.map((bike: Bike) => {
            const isSelected = bike.id === selectedBikeId;

            return (
              <div
                key={bike.id}
                className={`rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                    : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70'
                }`}
              >
                {/* Header carte */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {bike.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      ${bike.price.toLocaleString('en-US')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {bike.brand} {bike.model}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-2">{bike.color}</p>
                </div>

                {/* Image Preview */}
                <div
                  onClick={() => setDetailBike(bike)}
                  className="relative aspect-[16/10] w-full my-2 bg-neutral-950 rounded-2xl border border-neutral-800/60 overflow-hidden flex items-center justify-center cursor-pointer group"
                  title="Click to view specs"
                >
                  <Image
                    src={bike.image}
                    alt={`${bike.brand} ${bike.model}`}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] bg-neutral-900/80 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    🔍 View Specs
                  </span>
                </div>

                {/* Specs compactes */}
                <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-neutral-800/80 text-[11px]">
                  <div className="text-neutral-400 truncate">
                    Power: <span className="font-semibold text-neutral-200">{bike.power}</span>
                  </div>
                  <div className="text-neutral-400 text-right truncate">
                    Torque: <span className="font-semibold text-neutral-200">{bike.torque}</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setDetailBike(bike)}
                    className="py-2.5 px-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all text-center"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAndScroll(bike.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                        : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 border border-amber-500/30'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* État vide si aucun résultat */
        <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-8">
          <span className="text-4xl block mb-3">🏍️</span>
          <h3 className="text-lg font-bold text-white mb-1">No motorcycles matched your criteria</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
            Try adjusting your budget range, changing the selected brand, or clearing the search query.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pop-up Détails Modal */}
      {detailBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setDetailBike(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                {detailBike.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                {detailBike.brand} {detailBike.model}
              </h3>
              <p className="text-xs text-neutral-400">{detailBike.color}</p>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl bg-neutral-950 border border-neutral-800/80 mb-6 flex items-center justify-center overflow-hidden">
              <Image
                src={detailBike.image}
                alt={`${detailBike.brand} ${detailBike.model}`}
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/70">
                <span className="text-[10px] text-neutral-500 uppercase font-medium block">MSRP</span>
                <span className="text-sm font-bold text-white font-mono">${detailBike.price.toLocaleString('en-US')}</span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/70">
                <span className="text-[10px] text-neutral-500 uppercase font-medium block">Engine</span>
                <span className="text-sm font-bold text-white font-mono">{detailBike.engine}</span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/70">
                <span className="text-[10px] text-neutral-500 uppercase font-medium block">Power</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{detailBike.power}</span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/70">
                <span className="text-[10px] text-neutral-500 uppercase font-medium block">Torque</span>
                <span className="text-sm font-bold text-white font-mono">{detailBike.torque}</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                Factory Highlights & Technology
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailBike.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/50">
                    <span className="text-amber-500 text-xs">◆</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setDetailBike(null)}
                className="w-1/3 py-3 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleSelectAndScroll(detailBike.id)}
                className="w-2/3 py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-lg shadow-amber-500/20"
              >
                Configure & Simulate This Machine →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}