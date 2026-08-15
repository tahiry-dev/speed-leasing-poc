'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BikeGallery from '../components/BikeGallery';
import LeaseSimulator from '../components/LeaseSimulator';
import { BIKES_CATALOG } from '../lib/bikes-data';

export default function HomePage() {
  const [selectedBikeId, setSelectedBikeId] = useState<string>(BIKES_CATALOG[0].id);

  const handleSelectBike = (bikeId: string) => {
    setSelectedBikeId(bikeId);
    // Défilement fluide vers la section simulateur
    const simSection = document.getElementById('simulator-section');
    if (simSection) {
      simSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-extrabold tracking-tight text-lg text-white">
              SPEED<span className="text-amber-500">LEASING</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-semibold">
            <a
              href="#gallery-section"
              className="text-neutral-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Fleet Catalog
            </a>
            <a
              href="#simulator-section"
              className="text-neutral-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Lease Calculator
            </a>
            <Link
              href="/portal"
              className="px-3.5 py-1.5 rounded-lg border border-neutral-700 text-white hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              Client Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative pt-16 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          Next-Gen Motorcycle Financing
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mt-6 leading-tight">
          Ride The Icon. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            Tailored Premium Leasing.
          </span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Bespoke monthly payment plans for Harley-Davidson, Ducati, Indian, and BMW. 
          Instant digital simulation with fixed 4.9% APR and direct pre-approval.
        </p>
      </section>

      {/* Step 1: Model Selection Gallery */}
      <div id="gallery-section">
        <BikeGallery
          selectedBikeId={selectedBikeId}
          onSelectBike={handleSelectBike}
        />
      </div>

      {/* Step 2: Financial Simulator & Pre-Approval Flow */}
      <LeaseSimulator
        activeBikeId={selectedBikeId}
        onBikeChange={setSelectedBikeId}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-850 py-10 mt-16 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Speed Leasing Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/portal" className="text-neutral-400 hover:text-amber-400">Track Dossier</Link>
            <span className="text-neutral-700">·</span>
            <span>Terms of Service</span>
            <span className="text-neutral-700">·</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </main>
  );
}