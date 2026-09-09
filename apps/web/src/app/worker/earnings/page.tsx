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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/worker/dashboard"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Worker Dashboard
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              Member Earnings & Cooperative Passbook
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Ramesh Kumar • Lucknow Labour Cooperative Society Ltd. • Member ID: #COOP-LKO-992
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> e-Shram & PMSBY Linked
            </span>
          </div>
        </div>

        {/* Top Earnings & Welfare Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Net Take-Home */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs text-slate-400 font-medium flex justify-between items-center">
              <span>This Month's Take-Home Earnings</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">₹18,450</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 100% Statutory Fair Wage Guaranteed
            </div>
          </div>

          {/* Card 2: 7% Welfare Passbook */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/20 space-y-3">
            <div className="text-xs text-purple-300 font-medium flex justify-between items-center">
              <span>Your Section 70 Welfare Reserve</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-200">₹1,291.50</div>
            <div className="text-xs text-purple-300 flex items-center gap-1.5">
              <span>7% auto-accrued for health & emergency relief</span>
            </div>
          </div>

          {/* Card 3: Cooperative Commission Comparison */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-500/20 space-y-3">
            <div className="text-xs text-blue-300 font-medium flex justify-between items-center">
              <span>Middleman Commission Saved</span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-200">₹4,612.50</div>
            <div className="text-xs text-slate-400">
              Money kept in your family instead of 25% aggregator cut
            </div>
          </div>
        </div>

        {/* Bank & Payout Destination */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-white">Direct Benefit Transfer (DBT) Account</div>
              <div className="text-slate-400">Bank of Baroda • A/c: •••• •••• 4091 • IFSC: BARB0HAZRAT</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              Instant T+0 Settlement
            </span>
          </div>
        </div>

        {/* Payout History & Invoices */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Settled Gigs & Digital Tax Invoices
            </h2>
            <span className="text-xs text-slate-400">3 recent payouts shown</span>
          </div>

          <div className="space-y-3">
            {PAST_GIGS.map((gig) => (
              <div
                key={gig.id}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">{gig.bookingRef}</span>
                    <span className="text-xs text-slate-400">• {gig.date}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      {gig.payoutStatus}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">{gig.service}</div>
                  <div className="text-xs text-slate-400">
                    Customer: <span className="text-slate-300">{gig.customer}</span> • Ref: {gig.utrNumber}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-400">+₹{gig.netPayout}</div>
                    <div className="text-[11px] text-slate-500">Gross: ₹{gig.grossAmount} (Cess: ₹{gig.welfareCess})</div>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(gig)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" /> View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Invoice Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-emerald-400 font-bold tracking-wider uppercase">
                    Cooperative Digital Service Invoice
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Invoice #{selectedInvoice.bookingRef}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Invoice Body */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Issuing Cooperative:</span>
                  <strong className="text-white">Lucknow Labour Cooperative Society Ltd.</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cooperative Registration:</span>
                  <span className="text-slate-300">UP-COOP-LKO-4401 (Section 70 Act)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Technician:</span>
                  <span className="text-slate-300">Ramesh Kumar (Level 4 Certified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-slate-300">{selectedInvoice.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Rendered:</span>
                  <span className="text-slate-300">{selectedInvoice.service}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Doorstep Start OTP Handshake:</span>
                  <strong className="text-emerald-400 font-mono">Verified [{selectedInvoice.startOtp}]</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Completion Handshake:</span>
                  <strong className="text-emerald-400 font-mono">Verified [{selectedInvoice.completionOtp}]</strong>
                </div>
              </div>

              {/* Price Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Fair Wage (100% to Member):</span>
                  <span className="text-white font-medium">₹{selectedInvoice.grossAmount}.00</span>
                </div>
                <div className="flex justify-between text-purple-300">
                  <span>Section 70 Cooperative Welfare Cess (7%):</span>
                  <span>-₹{selectedInvoice.welfareCess}.00</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2 text-sm">
                  <span>Net Direct Bank Deposit:</span>
                  <span>₹{selectedInvoice.netPayout}.00</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span>Digitally Signed & Blockchain-ready by ShramSetu Protocol</span>
                </div>
                <span className="text-emerald-400 font-mono">PAID</span>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
