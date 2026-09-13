"use client";

import Link from 'next/link';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Sliders, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ArrowRight,
  Clock,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function CooperativeAdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="relative bg-navy-900/80 backdrop-blur-2xl text-cream-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl border border-champagne-500/20 overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-champagne-500/15 text-champagne-300 flex items-center justify-center shadow-glow-champagne">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-champagne-300 tracking-wider font-display">
                Cooperative Society Management
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero">
                Lucknow Labour Cooperative Society Ltd.
              </h1>
            </div>
          </div>
          <p className="text-xs text-cream-200/60 font-sans">
            Reg: <span className="font-mono text-cream-200/80">UP-LKO-COOP-2024-001</span> • Section 70 Audited Executive Command Center
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <Link 
            href="/admin/verification" 
            className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 hover:from-rose-400 hover:to-champagne-300 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose transition-all font-display"
          >
            Verification Queue (2 Pending)
          </Link>
          <Link 
            href="/admin/welfare" 
            className="px-4 py-2.5 bg-champagne-500/15 hover:bg-champagne-500/25 text-champagne-300 border border-champagne-400/30 font-bold text-xs rounded-xl transition-all font-display"
          >
            Welfare Fund Ledger
          </Link>
          <Link 
            href="/admin/analytics" 
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-cream-200 border border-navy-700 hover:border-champagne-400/40 font-bold text-xs rounded-xl transition-all font-display"
          >
            Executive Analytics
          </Link>
          <Link 
            href="/admin/complaints" 
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-cream-200 border border-navy-700 hover:border-champagne-400/40 font-bold text-xs rounded-xl transition-all font-display"
          >
            Grievance Redressal
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Registered Members</span>
            <Users className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-cream-100 font-display block">45</span>
          <p className="text-[10px] text-champagne-400 font-bold font-sans">100% ITI / NSDC Certified</p>
        </div>

        <Link 
          href="/admin/welfare" 
          className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-rose-500/20 shadow-xl space-y-2 hover:border-rose-400/50 transition-all block overflow-hidden group"
        >
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-display">Welfare Reserve Pool</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black gradient-text-rose font-display block">₹1,25,060</span>
          <p className="text-[10px] text-rose-300/70 font-sans group-hover:text-rose-200 transition-colors">
            7% automatically retained per job ➔
          </p>
        </Link>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Monthly Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-cream-100 font-display block">384</span>
          <p className="text-[10px] text-cream-300/50 font-sans">Gross Value: ₹1,53,600</p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-display">Verification Pending</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black gradient-text-rose font-display block">2</span>
          <p className="text-[10px] text-cream-300/50 font-sans">Aadhaar & ITI certificates in review</p>
        </div>
      </div>

      {/* Verification Queue & FairMatch Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Worker Verification Queue */}
        <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl overflow-hidden">
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-cream-100 font-display flex items-center gap-2">
              <span>Worker Verification Queue</span>
              <ShieldCheck className="w-5 h-5 text-champagne-400" />
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-champagne-300 text-[10px] font-mono font-bold">
              2 Submissions
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-champagne-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-cream-100 text-sm font-display">Mahesh Verma</h3>
                <p className="text-xs text-cream-200/60 font-sans mt-0.5">Category: Plumber • ITI Kanpur Certificate (Reg: ITI-2024-819)</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => alert('Approved')} 
                  className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-glow-rose font-display"
                >
                  <CheckCircle2 className="w-4 h-4 text-navy-950" /> Approve
                </button>
                <button 
                  onClick={() => alert('Reviewing documentation')} 
                  className="px-3.5 py-2 bg-navy-900 text-cream-200 border border-navy-700 hover:border-champagne-400/40 rounded-xl text-xs font-bold font-display"
                >
                  Review
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-champagne-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-cream-100 text-sm font-display">Satish Chandra</h3>
                <p className="text-xs text-cream-200/60 font-sans mt-0.5">Category: Electrician • National Skill Dev Corp Certificate (NSDC-902)</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => alert('Approved')} 
                  className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-glow-rose font-display"
                >
                  <CheckCircle2 className="w-4 h-4 text-navy-950" /> Approve
                </button>
                <button 
                  onClick={() => alert('Reviewing documentation')} 
                  className="px-3.5 py-2 bg-navy-900 text-cream-200 border border-navy-700 hover:border-champagne-400/40 rounded-xl text-xs font-bold font-display"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FairMatch Weight Configuration */}
        <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl overflow-hidden">
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-cream-100 font-display flex items-center gap-2">
              <span>FairMatch™ Algorithmic Weights</span>
              <Sliders className="w-5 h-5 text-champagne-400" />
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[10px] font-mono font-bold">
              Auditable Open Policy
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-cream-100 mb-1 font-sans">
                <span>Skill Match Repertoire</span>
                <span className="text-champagne-300 font-mono">30%</span>
              </div>
              <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
                <div className="bg-gradient-to-r from-rose-500 to-champagne-400 h-full w-[30%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-cream-100 mb-1 font-sans">
                <span>Distance Proximity & Haversine Decay</span>
                <span className="text-champagne-300 font-mono">25%</span>
              </div>
              <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
                <div className="bg-gradient-to-r from-champagne-400 to-rose-400 h-full w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-cream-100 mb-1 font-sans">
                <span>Immediate Availability</span>
                <span className="text-champagne-300 font-mono">20%</span>
              </div>
              <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
                <div className="bg-gradient-to-r from-rose-400 to-champagne-500 h-full w-[20%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-cream-100 mb-1 font-sans">
                <span>Cooperative Verification & Trust</span>
                <span className="text-champagne-300 font-mono">15%</span>
              </div>
              <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
                <div className="bg-gradient-to-r from-champagne-500 to-rose-500 h-full w-[15%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-cream-100 mb-1 font-sans">
                <span>Member Track Record</span>
                <span className="text-champagne-300 font-mono">10%</span>
              </div>
              <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
                <div className="bg-gradient-to-r from-rose-500 to-champagne-400 h-full w-[10%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
