"use client";

import Link from 'next/link';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Sliders, 
  TrendingUp, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export default function CooperativeAdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black">Lucknow Labour Cooperative Society Ltd.</h1>
          </div>
          <p className="text-xs text-slate-400">Reg: UP-LKO-COOP-2024-001 | Executive Cooperative Management Portal</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link href="/admin/verification" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors">
            Verification Queue (2 Pending)
          </Link>
          <Link href="/admin/welfare" className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl transition-colors">
            Welfare Fund Ledger
          </Link>
          <Link href="/admin/workers" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors">
            Member Directory
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Total Registered Members</span>
          <span className="text-3xl font-black text-slate-900">45</span>
          <p className="text-[10px] text-emerald-600 font-bold">100% ITI/NSDC Verified</p>
        </div>

        <Link href="/admin/welfare" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-500 transition-all block">
          <span className="text-xs font-semibold text-slate-500">Pooled Member Welfare Reserve</span>
          <span className="text-3xl font-black text-emerald-600">₹1,25,060</span>
          <p className="text-[10px] text-slate-500">7% automatically retained per job ➔</p>
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Monthly Completed Jobs</span>
          <span className="text-3xl font-black text-slate-900">384</span>
          <p className="text-[10px] text-slate-500">Gross Value: ₹1,53,600</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Verification Pending</span>
          <span className="text-3xl font-black text-amber-600">2</span>
          <p className="text-[10px] text-slate-500">Aadhaar & ITI certificates awaiting review</p>
        </div>
      </div>

      {/* Verification Queue & FairMatch Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Worker Verification Queue */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Worker Verification Queue <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Mahesh Verma</h3>
                <p className="text-xs text-slate-500">Category: Plumber | ITI Kanpur Certificate</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => alert('Approved')} className="p-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => alert('Rejected')} className="p-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FairMatch Weight Configuration */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            FairMatch Algorithmic Weight Configuration <Sliders className="w-5 h-5 text-emerald-600" />
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Skill Match Weight</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[30%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Distance Proximity Weight</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Worker Availability Weight</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[20%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
