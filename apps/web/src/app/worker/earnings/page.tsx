'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  Printer,
  Sparkles,
  CreditCard,
  Building2,
  XCircle,
  QrCode
} from 'lucide-react';

interface GigPayout {
  id: string;
  bookingRef: string;
  date: string;
  customer: string;
  service: string;
  grossAmount: number;
  welfareCess: number;
  netPayout: number;
  payoutStatus: 'SETTLED' | 'PROCESSING';
  payoutMode: string;
  utrNumber: string;
  startOtp: string;
  completionOtp: string;
}

const PAST_GIGS: GigPayout[] = [
  {
    id: 'GIG-4401',
    bookingRef: 'BK-LKO-2026-4401',
    date: 'Today, 02:45 PM',
    customer: 'Ananya Deshmukh',
    service: 'Ceiling Fan Rewinding & Speed Capacitor Replacement',
    grossAmount: 400,
    welfareCess: 28,
    netPayout: 372,
    payoutStatus: 'SETTLED',
    payoutMode: 'UPI / Bank of Baroda',
    utrNumber: 'UTR-20260909-BOB-99214',
    startOtp: '4829',
    completionOtp: '7103',
  },
  {
    id: 'GIG-4398',
    bookingRef: 'BK-LKO-2026-4398',
    date: 'Yesterday, 11:20 AM',
    customer: 'Vikram Seth',
    service: 'Main Distribution MCB 32A Tripping Overhaul',
    grossAmount: 650,
    welfareCess: 45,
    netPayout: 605,
    payoutStatus: 'SETTLED',
    payoutMode: 'UPI / Bank of Baroda',
    utrNumber: 'UTR-20260908-BOB-88319',
    startOtp: '5192',
    completionOtp: '3341',
  },
  {
    id: 'GIG-4391',
    bookingRef: 'BK-LKO-2026-4391',
    date: '06 Sep 2026, 04:15 PM',
    customer: 'Sunita Mehra',
    service: 'Inverter Dual Battery Terminal De-oxidation',
    grossAmount: 450,
    welfareCess: 31,
    netPayout: 419,
    payoutStatus: 'SETTLED',
    payoutMode: 'UPI / Bank of Baroda',
    utrNumber: 'UTR-20260906-BOB-77412',
    startOtp: '8820',
    completionOtp: '4912',
  },
];

export default function WorkerEarningsPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<GigPayout | null>(null);

  return (
    <div className="min-h-screen text-cream-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/worker/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-champagne-300 hover:text-champagne-200 transition-colors mb-2 font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Worker Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-champagne-400" />
              Member Earnings & Cooperative Passbook
            </h1>
            <p className="text-cream-200/60 text-xs mt-1 font-sans">
              Ramesh Kumar • Lucknow Labour Cooperative Society Ltd. • Member ID: #COOP-LKO-992
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 flex items-center gap-1.5 font-display font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> e-Shram & PMSBY Linked
            </span>
          </div>
        </div>

        {/* Top Earnings & Welfare Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Net Take-Home */}
          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
            <div className="text-xs text-champagne-300 font-bold uppercase tracking-wider flex justify-between items-center font-display">
              <span>This Month's Take-Home</span>
              <CreditCard className="w-4 h-4 text-champagne-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-cream-100 font-display">₹18,450</div>
            <div className="text-xs text-champagne-300 flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-4 h-4" /> 100% Fair Wage Guaranteed
            </div>
          </div>

          {/* Card 2: 7% Welfare Passbook */}
          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-rose-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
            <div className="text-xs text-rose-300 font-bold uppercase tracking-wider flex justify-between items-center font-display">
              <span>Section 70 Welfare Pool</span>
              <ShieldCheck className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black gradient-text-rose font-display">₹1,291.50</div>
            <div className="text-xs text-rose-300/80 flex items-center gap-1.5 font-sans">
              <span>7% auto-accrued for health & emergency relief</span>
            </div>
          </div>

          {/* Card 3: Cooperative Commission Comparison */}
          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
            <div className="text-xs text-champagne-300 font-bold uppercase tracking-wider flex justify-between items-center font-display">
              <span>Middleman Commission Saved</span>
              <Sparkles className="w-4 h-4 text-champagne-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black gradient-text-gold font-display">₹4,612.50</div>
            <div className="text-xs text-cream-200/60 font-sans">
              Retained in your family instead of 25% aggregator deduction
            </div>
          </div>
        </div>

        {/* Bank & Payout Destination */}
        <div className="relative p-5 rounded-2xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-champagne-500/15 text-champagne-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-cream-100 font-display">Direct Benefit Transfer (DBT) Account</div>
              <div className="text-cream-200/60 font-mono mt-0.5">Bank of Baroda • A/c: •••• •••• 4091 • IFSC: BARB0HAZRAT</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 font-bold font-mono">
              Instant T+0 Settlement
            </span>
          </div>
        </div>

        {/* Payout History & Invoices */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-cream-100 font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-champagne-400" />
              Settled Gigs & Digital Tax Invoices
            </h2>
            <span className="text-xs text-cream-300/50 font-mono">3 recent payouts shown</span>
          </div>

          <div className="space-y-3">
            {PAST_GIGS.map((gig) => (
              <div
                key={gig.id}
                className="p-5 rounded-2xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/15 hover:border-champagne-400/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-champagne-300">{gig.bookingRef}</span>
                    <span className="text-xs text-cream-300/50">• {gig.date}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 font-bold font-mono">
                      {gig.payoutStatus}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-cream-100 font-display">{gig.service}</div>
                  <div className="text-xs text-cream-200/60 font-sans">
                    Customer: <span className="text-cream-100">{gig.customer}</span> • Ref: <span className="font-mono">{gig.utrNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-bold gradient-text-gold font-mono">+₹{gig.netPayout}</div>
                    <div className="text-[11px] text-cream-300/40 font-mono">Gross: ₹{gig.grossAmount} (Cess: ₹{gig.welfareCess})</div>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(gig)}
                    className="px-4 py-2 bg-navy-950 hover:bg-navy-800 text-cream-100 border border-navy-700 hover:border-champagne-400/40 rounded-xl text-xs font-bold flex items-center gap-2 transition-all font-display"
                  >
                    <Printer className="w-3.5 h-3.5 text-champagne-400" /> View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Invoice Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative bg-navy-900/95 border border-champagne-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-navy-800 pb-4">
                <div>
                  <div className="text-xs text-champagne-300 font-bold tracking-wider uppercase font-display">
                    Cooperative Digital Service Invoice
                  </div>
                  <h3 className="text-lg font-black text-cream-100 mt-0.5 font-display">
                    Invoice #{selectedInvoice.bookingRef}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-cream-300/60 hover:text-cream-100 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Invoice Body */}
              <div className="p-4 bg-navy-950 rounded-2xl border border-champagne-500/15 space-y-3 text-xs">
                <div className="flex justify-between border-b border-navy-800 pb-2">
                  <span className="text-cream-300/50 font-sans">Issuing Cooperative:</span>
                  <strong className="text-cream-100 font-display">Lucknow Labour Cooperative Society Ltd.</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/50 font-sans">Registration Number:</span>
                  <span className="text-cream-200 font-mono">UP-COOP-LKO-4401 (Section 70 Act)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/50 font-sans">Technician:</span>
                  <span className="text-cream-200">Ramesh Kumar (Level 4 Certified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/50 font-sans">Customer:</span>
                  <span className="text-cream-200">{selectedInvoice.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/50 font-sans">Service Rendered:</span>
                  <span className="text-cream-200">{selectedInvoice.service}</span>
                </div>
                <div className="flex justify-between border-t border-navy-800 pt-2">
                  <span className="text-cream-300/50 font-sans">Start OTP Handshake:</span>
                  <strong className="text-champagne-300 font-mono">Verified [{selectedInvoice.startOtp}]</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/50 font-sans">Completion Handshake:</span>
                  <strong className="text-rose-300 font-mono">Verified [{selectedInvoice.completionOtp}]</strong>
                </div>
              </div>

              {/* Price Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-cream-200/70 font-sans">
                  <span>Base Fair Wage (100% to Member):</span>
                  <span className="text-cream-100 font-mono font-medium">₹{selectedInvoice.grossAmount}.00</span>
                </div>
                <div className="flex justify-between text-rose-300 font-sans">
                  <span>Section 70 Welfare Cess (7%):</span>
                  <span className="font-mono">-₹{selectedInvoice.welfareCess}.00</span>
                </div>
                <div className="flex justify-between text-champagne-300 font-bold border-t border-navy-800 pt-2 text-sm font-display">
                  <span>Net Direct Bank Deposit:</span>
                  <span className="font-mono">₹{selectedInvoice.netPayout}.00</span>
                </div>
              </div>

              <div className="p-3 bg-navy-950 rounded-xl border border-champagne-500/15 flex items-center justify-between text-[11px] text-cream-200/70 font-sans">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-champagne-400" />
                  <span>Digitally Signed & Blockchain-ready by WorkLink Protocol</span>
                </div>
                <span className="text-champagne-300 font-mono font-bold">PAID</span>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-cream-200/80 border border-navy-700 rounded-xl text-xs font-bold font-display"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-glow-rose font-display"
                >
                  <Printer className="w-4 h-4 text-navy-950" /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
