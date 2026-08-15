'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LeasingCalculationResult } from '../types/bike';

interface QuoteSummaryProps {
  referenceId: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    type: string;
  };
  simulation: LeasingCalculationResult;
}

export default function QuoteSummary({ referenceId, applicant, simulation }: QuoteSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const { bike } = simulation;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const content = (
    <>
      <style jsx global>{`
        @media screen {
          #quote-pdf-summary {
            display: none !important;
          }
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          /* Cache tous les éléments directs de body SAUF le devis */
          body > *:not(#quote-pdf-summary) {
            display: none !important;
          }
          html, body {
            background: #ffffff !important;
            color: #171717 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          #quote-pdf-summary {
            display: block !important;
            width: 100% !important;
            max-width: 520px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div id="quote-pdf-summary" className="font-sans text-neutral-900 bg-white">
        <div className="border border-neutral-300 rounded-2xl p-6">
          {/* Header */}
          <div className="flex justify-between items-baseline border-b border-neutral-300 pb-3 mb-5">
            <h1 className="text-xl font-black tracking-tight text-neutral-900">
              SPEED<span className="text-amber-600">LEASING</span>
            </h1>
            <div className="text-right text-xs text-neutral-500">
              <span>Ref: {referenceId}</span> · <span>{currentDate}</span>
            </div>
          </div>

          {/* 1. Selected Motorcycle */}
          <div className="mb-5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Selected Motorcycle
            </span>
            <div className="text-lg font-bold text-neutral-900">
              {bike.brand} {bike.model}
            </div>
            <div className="text-xs text-neutral-500">
              {bike.category} · {bike.engine} · MSRP ${bike.price.toLocaleString('en-US')}
            </div>
          </div>

          {/* 2. Payment Terms */}
          <div className="mb-5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Payment Terms
            </span>
            <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-200 text-xs overflow-hidden">
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-600">Duration</span>
                <span className="font-semibold text-neutral-900">{simulation.durationMonths} Months</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-600">Down Payment ({simulation.downPaymentPercent}%)</span>
                <span className="font-semibold text-neutral-900">${simulation.downPaymentAmount.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50">
                <span className="font-bold text-neutral-900">Monthly Installment</span>
                <span className="font-black text-amber-600 text-sm">${simulation.monthlyTotal} / mo</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-neutral-600">Purchase Option (Residual)</span>
                <span className="font-semibold text-neutral-900">${simulation.residualValue.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-neutral-400 text-center border-t border-neutral-200 pt-3">
            Client: {applicant.fullName} · Speed Leasing Inc.
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}