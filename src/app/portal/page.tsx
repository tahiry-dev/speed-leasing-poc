'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import QuoteSummary from '../../components/QuoteSummary';

export default function PortalPage() {
  const [referenceId, setReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setApplicationData(null);

    try {
      const res = await fetch(`/api/applications?ref=${encodeURIComponent(referenceId)}`);
      const data = await res.json();

      if (data.success && data.application) {
        setApplicationData(data.application);
      } else {
        setErrorMsg(data.error || 'Dossier not found. Please verify your reference code.');
      }
    } catch {
      setErrorMsg('Failed to connect to the portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-extrabold tracking-tight text-lg text-white">
              SPEED<span className="text-amber-500">LEASING</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ← Back to Simulator
            </Link>
          </div>
        </div>
      </header>

      {/* Portal Container */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            Client Dossier Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Track Your Lease Application
          </h1>
          <p className="text-neutral-400 text-sm max-w-md mx-auto mt-2">
            Enter your Speed Leasing reference code to view real-time status and financial documents.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-neutral-900/60 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. SPL-DEMO1 or SPL-XXXXX"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-neutral-600 uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Searching...' : 'Track Dossier'}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Demo Reference: <button type="button" onClick={() => setReferenceId('SPL-DEMO1')} className="text-amber-500 font-mono hover:underline">SPL-DEMO1</button></span>
            <span>24/7 Concierge Support</span>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Application Result Details */}
        {applicationData && (
          <div className="bg-neutral-900/60 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top Bar Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Dossier</span>
                  <span className="font-mono text-sm font-bold text-amber-500 bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-800">
                    {applicationData.referenceId}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {applicationData.applicant.fullName}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="py-2 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  🖨️ Re-print PDF Quote
                </button>
              </div>
            </div>

            {/* Stepper Progression Timeline */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-4">
                Application Timeline & Status
              </span>
              <div className="space-y-4">
                {applicationData.statusHistory.map((hist: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    {/* Step Dot & Connecting Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                          hist.completed
                            ? 'bg-amber-500 text-neutral-950'
                            : hist.active
                            ? 'bg-neutral-900 border-2 border-amber-500 text-amber-500 animate-pulse'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {hist.completed ? '✓' : index + 1}
                      </div>
                      {index < applicationData.statusHistory.length - 1 && (
                        <div
                          className={`w-0.5 h-8 my-1 ${
                            hist.completed ? 'bg-amber-500' : 'bg-neutral-800'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Description */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex justify-between items-baseline">
                        <span
                          className={`text-sm font-semibold ${
                            hist.active || hist.completed ? 'text-white' : 'text-neutral-500'
                          }`}
                        >
                          {hist.step}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {hist.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle & Financial Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80">
                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
                  Contract Machine
                </span>
                <div className="text-base font-bold text-white">
                  {applicationData.simulation.bike.brand} {applicationData.simulation.bike.model}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {applicationData.simulation.bike.category} · {applicationData.simulation.bike.engine}
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80">
                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
                  Agreed Installment
                </span>
                <div className="text-base font-extrabold text-amber-400 font-mono">
                  ${applicationData.simulation.monthlyTotal} <span className="text-xs font-normal text-neutral-400">/ month</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {applicationData.simulation.durationMonths} Months · ${applicationData.simulation.downPaymentAmount.toLocaleString('en-US')} Down
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Quote Sheet (Triggered exclusively by window.print()) */}
      {applicationData && (
        <QuoteSummary
          referenceId={applicationData.referenceId}
          applicant={applicationData.applicant}
          simulation={applicationData.simulation}
        />
      )}
    </main>
  );
}