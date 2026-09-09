'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';

export default function CooperativeAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('7D');

  // Daily Booking Trend Data for 7 days
  const dailyData = [
    { day: 'Mon', bookings: 42, gmv: 23500, height: 60 },
    { day: 'Tue', bookings: 58, gmv: 31200, height: 80 },
    { day: 'Wed', bookings: 65, gmv: 38400, height: 90 },
    { day: 'Thu', bookings: 54, gmv: 29800, height: 74 },
    { day: 'Fri', bookings: 78, gmv: 44200, height: 100 },
    { day: 'Sat', bookings: 92, gmv: 52600, height: 120 },
    { day: 'Sun', bookings: 86, gmv: 49100, height: 112 },
  ];

  // Trade breakdown
  const tradeBreakdown = [
    { trade: 'Electrical & Power', percent: 38, count: 182, color: 'bg-amber-400', textColor: 'text-amber-400' },
    { trade: 'Plumbing & Sanitation', percent: 28, count: 134, color: 'bg-blue-400', textColor: 'text-blue-400' },
    { trade: 'Appliance Repair', percent: 18, count: 86, color: 'bg-purple-400', textColor: 'text-purple-400' },
    { trade: 'Carpentry & Woodwork', percent: 16, count: 77, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
  ];

  // Zonal Utilization
  const zones = [
    { name: 'Hazratganj Zone A', activeWorkers: 42, utilization: 92, status: 'HIGH_DEMAND' },
    { name: 'Gomti Nagar Zone B', activeWorkers: 56, utilization: 84, status: 'OPTIMAL' },
    { name: 'Aliganj Zone C', activeWorkers: 28, utilization: 76, status: 'BALANCED' },
    { name: 'Charbagh / South Zone', activeWorkers: 22, utilization: 71, status: 'AVAILABLE' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cooperative Admin
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-emerald-400" />
              Executive Analytics & Predictive Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time operational audit for Lucknow Labour Cooperative Society Ltd. (Reg. #UP-COOP-LKO-4401).
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  timeRange === r
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7D' ? 'Last 7 Days' : r === '30D' ? 'Last 30 Days' : 'Last Quarter'}
              </button>
            ))}
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Total Member Workforce</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">148</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12 new verified members this month
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Active Bookings (This Week)</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">475</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 99.1% on-time arrival rate
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Gross Marketplace GMV</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">₹2,68,800</div>
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">100% base wage</span> kept by workers
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Section 70 Welfare Fund</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">₹1,25,060</div>
            <div className="text-xs text-purple-300">
              Audited reserve • 3 claims disbursed
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart: 7-Day Velocity & Volume */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                7-Day Booking Velocity & Daily GMV Revenue
              </h2>
              <p className="text-xs text-slate-400">
                Peak service volume concentrated on Friday evening and weekend morning slots.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span> Bookings Count
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span> GMV (₹)
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-4 border-b border-slate-800 px-2">
            {dailyData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-800 border border-slate-700 text-white text-[11px] rounded-md px-2.5 py-1 whitespace-nowrap pointer-events-none shadow-xl z-10">
                  <div className="font-bold">{item.bookings} Bookings</div>
                  <div className="text-emerald-400">₹{item.gmv.toLocaleString()} GMV</div>
                </div>

                {/* Bars Container */}
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Bookings Bar */}
                  <div
                    style={{ height: `${item.height}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md group-hover:brightness-110 transition-all"
                  />
                  {/* GMV Bar */}
                  <div
                    style={{ height: `${item.height * 0.85}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md group-hover:brightness-110 transition-all opacity-80"
                  />
                </div>

                {/* Day Label */}
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Average Daily Run Rate: <strong>68 Bookings / Day</strong></span>
            <span className="text-emerald-400 font-semibold">Weekly Growth: +18.4% WoW</span>
          </div>
        </div>

        {/* Lower Grid: Trade Breakdown & Zonal Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Service Demand Split by Trade
            </h3>

            <div className="space-y-4">
              {tradeBreakdown.map((t) => (
                <div key={t.trade} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{t.trade}</span>
                    <span className={t.textColor}>
                      {t.percent}% ({t.count} jobs)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${t.percent}%` }}
                      className={`h-full ${t.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Statutory Wage Floor Adherence:</span>
              <strong className="text-emerald-400">100% (UP State Gazette Compliant)</strong>
            </div>
          </div>

          {/* Zonal Workforce Utilization */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              Zonal Workforce Deployment & Utilization
            </h3>

            <div className="space-y-3">
              {zones.map((z) => (
                <div
                  key={z.name}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{z.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {z.activeWorkers} On-Duty Craftsmen Deployed
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{z.utilization}%</div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {z.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>AI Allocation Optimizer Active:</strong> Machine learning forecasts demand surges in Hazratganj zone 24 hours in advance.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
