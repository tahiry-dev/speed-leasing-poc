'use client';

import React, { useState } from 'react';
import { LeasingCalculationResult } from '../types/bike';
import QuoteSummary from './QuoteSummary';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: LeasingCalculationResult;
}

export default function ApplicationModal({ isOpen, onClose, simulation }: ApplicationModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [applicantType, setApplicantType] = useState<'individual' | 'business'>('individual');
  const [annualIncome, setAnnualIncome] = useState('85000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          applicantType,
          annualIncome: Number(annualIncome),
          simulation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(data.referenceId);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
        <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>

          {submissionSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-14 w-14 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-amber-500/30">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white">Application Pre-Approved</h3>
              <p className="text-neutral-400 text-sm max-w-sm mx-auto">
                Your dossier has been registered with reference:
              </p>
              <div className="font-mono text-amber-500 font-bold bg-neutral-950 px-4 py-2 rounded-lg border border-neutral-800 inline-block">
                {submissionSuccess}
              </div>
              <p className="text-xs text-neutral-500">
                A confirmation has been prepared for your records.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  🖨️ Download / Print Quote PDF
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold">Lease Pre-Approval Application</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Apply for {simulation.bike.brand} {simulation.bike.model} at{' '}
                <span className="text-amber-500 font-semibold">${simulation.monthlyTotal}/mo</span>
              </p>

              {/* Quick summary strip */}
              <div className="my-4 p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 grid grid-cols-3 text-center text-xs">
                <div>
                  <span className="text-neutral-500">Term</span>
                  <div className="font-semibold text-neutral-200">{simulation.durationMonths} Months</div>
                </div>
                <div>
                  <span className="text-neutral-500">Down Payment</span>
                  <div className="font-semibold text-neutral-200">${simulation.downPaymentAmount.toLocaleString('en-US')}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Allowance</span>
                  <div className="font-semibold text-neutral-200">{simulation.annualMiles.toLocaleString('en-US')} mi</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Account Type */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setApplicantType('individual')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      applicantType === 'individual'
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicantType('business')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      applicantType === 'business'
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    Corporate / Fleet
                  </button>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Miller"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Estimated Annual Income ($)</label>
                  <input
                    type="number"
                    required
                    min="30000"
                    step="5000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying Application...' : 'Submit Pre-Approval Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Printable Quote Sheet (Visible exclusively during window.print()) */}
      {submissionSuccess && (
        <QuoteSummary
          referenceId={submissionSuccess}
          applicant={{ fullName, email, phone, type: applicantType }}
          simulation={simulation}
        />
      )}
    </>
  );
}