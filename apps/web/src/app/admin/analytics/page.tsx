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
    { trade: 'Electrical & Power', percent: 38, count: 182, color: 'bg-champagne-400', textColor: 'text-champagne-300' },
    { trade: 'Plumbing & Sanitation', percent: 28, count: 134, color: 'bg-rose-400', textColor: 'text-rose-300' },
    { trade: 'Appliance Repair', percent: 18, count: 86, color: 'bg-amber-400', textColor: 'text-amber-300' },
    { trade: 'Carpentry & Woodwork', percent: 16, count: 77, color: 'bg-teal-400', textColor: 'text-teal-300' },
  ];

  // Zonal Utilization
  const zones = [
    { name: 'Hazratganj Zone A', activeWorkers: 42, utilization: 92, status: 'HIGH_DEMAND' },
    { name: 'Gomti Nagar Zone B', activeWorkers: 56, utilization: 84, status: 'OPTIMAL' },
    { name: 'Aliganj Zone C', activeWorkers: 28, utilization: 76, status: 'BALANCED' },
    { name: 'Charbagh / South Zone', activeWorkers: 22, utilization: 71, status: 'AVAILABLE' },
  ];

  return (
    <div className="min-h-screen text-cream-100 p-6 md:p-10 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-champagne-300 hover:text-champagne-200 transition-colors mb-2 font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cooperative Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-champagne-400" />
              Executive Analytics & Predictive Intelligence
            </h1>
            <p className="text-cream-200/60 text-xs mt-1 font-sans">
              Real-time operational audit for Lucknow Labour Cooperative Society Ltd. (Reg. #UP-COOP-LKO-4401).
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-navy-900/80 border border-champagne-500/20 rounded-2xl p-1 text-xs">
            {(['7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all font-display ${
                  timeRange === r
                    ? 'bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 shadow-glow-rose'
                    : 'text-cream-200/60 hover:text-cream-100'
                }`}
              >
                {r === '7D' ? 'Last 7 Days' : r === '30D' ? 'Last 30 Days' : 'Last Quarter'}
              </button>
            ))}
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
            <div className="flex justify-between items-center text-champagne-300 text-xs font-bold uppercase tracking-wider font-display">
              <span>Total Member Workforce</span>
              <Users className="w-4 h-4 text-champagne-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-cream-100 font-display">148</div>
            <div className="text-xs text-champagne-300 flex items-center gap-1 font-sans">
              <TrendingUp className="w-3.5 h-3.5" /> +12 verified members this month
            </div>
          </div>

          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-rose-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
            <div className="flex justify-between items-center text-rose-300 text-xs font-bold uppercase tracking-wider font-display">
              <span>Active Bookings</span>
              <Briefcase className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black gradient-text-rose font-display">475</div>
            <div className="text-xs text-rose-300/80 flex items-center gap-1 font-sans">
              <TrendingUp className="w-3.5 h-3.5" /> 99.1% on-time arrival rate
            </div>
          </div>

          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
            <div className="flex justify-between items-center text-champagne-300 text-xs font-bold uppercase tracking-wider font-display">
              <span>Marketplace GMV</span>
              <DollarSign className="w-4 h-4 text-champagne-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black gradient-text-gold font-display">₹2,68,800</div>
            <div className="text-xs text-cream-200/60 font-sans">
              <span className="text-champagne-300 font-semibold">100% base wage</span> kept by workers
            </div>
          </div>

          <div className="relative p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 shadow-xl space-y-3 overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
            <div className="flex justify-between items-center text-champagne-300 text-xs font-bold uppercase tracking-wider font-display">
              <span>Section 70 Welfare Fund</span>
              <ShieldCheck className="w-4 h-4 text-champagne-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-cream-100 font-display">₹1,25,060</div>
            <div className="text-xs text-cream-300/50 font-sans">
              Audited reserve • 3 claims disbursed
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart: 7-Day Velocity & Volume */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 shadow-2xl space-y-6 overflow-hidden">
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-black text-cream-100 font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-champagne-400" />
                7-Day Booking Velocity & Daily GMV Revenue
              </h2>
              <p className="text-xs text-cream-200/60 font-sans">
                Peak service volume concentrated on Friday evening and weekend morning slots.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans">
              <span className="flex items-center gap-1.5 text-cream-200/80">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-rose-500 to-rose-400 inline-block"></span> Bookings Count
              </span>
              <span className="flex items-center gap-1.5 text-cream-200/80">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-champagne-400 to-champagne-300 inline-block"></span> GMV (₹)
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-4 border-b border-navy-800 px-2">
            {dailyData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-navy-950 border border-champagne-400/40 text-cream-100 text-[11px] rounded-xl px-3 py-1.5 whitespace-nowrap pointer-events-none shadow-2xl z-10 font-sans">
                  <div className="font-bold text-cream-100">{item.bookings} Bookings</div>
                  <div className="text-champagne-300 font-mono">₹{item.gmv.toLocaleString()} GMV</div>
                </div>

                {/* Bars Container */}
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Bookings Bar */}
                  <div
                    style={{ height: `${item.height}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md group-hover:brightness-125 transition-all shadow-glow-rose"
                  />
                  {/* GMV Bar */}
                  <div
                    style={{ height: `${item.height * 0.85}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-champagne-600 to-champagne-400 rounded-t-md group-hover:brightness-125 transition-all opacity-90 shadow-glow-champagne"
                  />
                </div>

                {/* Day Label */}
                <span className="text-xs font-bold text-cream-300/60 group-hover:text-champagne-300 transition-colors font-display">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-cream-200/60 font-sans">
            <span>Average Daily Run Rate: <strong className="text-cream-100">68 Bookings / Day</strong></span>
            <span className="text-champagne-300 font-bold font-mono">Weekly Growth: +18.4% WoW</span>
          </div>
        </div>

        {/* Lower Grid: Trade Breakdown & Zonal Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Breakdown */}
          <div className="p-6 sm:p-7 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 space-y-5 shadow-xl">
            <h3 className="text-base font-black text-cream-100 font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-champagne-400" />
              Service Demand Split by Trade
            </h3>

            <div className="space-y-4">
              {tradeBreakdown.map((t) => (
                <div key={t.trade} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-cream-200">{t.trade}</span>
                    <span className={`${t.textColor} font-mono`}>
                      {t.percent}% ({t.count} jobs)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                    <div
                      style={{ width: `${t.percent}%` }}
                      className={`h-full ${t.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-navy-950 rounded-2xl border border-champagne-500/15 text-xs text-cream-200/70 flex items-center justify-between font-sans">
              <span>Statutory Wage Floor Adherence:</span>
              <strong className="text-champagne-300 font-display">100% (UP Gazette Compliant)</strong>
            </div>
          </div>

          {/* Zonal Workforce Utilization */}
          <div className="p-6 sm:p-7 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 space-y-5 shadow-xl">
            <h3 className="text-base font-black text-cream-100 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              Zonal Workforce Deployment & Utilization
            </h3>

            <div className="space-y-3">
              {zones.map((z) => (
                <div
                  key={z.name}
                  className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-cream-100 font-display">{z.name}</div>
                    <div className="text-[11px] text-cream-200/60 font-sans mt-0.5">
                      {z.activeWorkers} On-Duty Craftsmen Deployed
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black gradient-text-gold font-mono">{z.utilization}%</div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-navy-900 text-champagne-300 border border-navy-700 font-mono">
                      {z.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-navy-950 border border-champagne-500/20 rounded-2xl flex items-center gap-3 text-xs text-cream-200/80 font-sans">
              <Sparkles className="w-5 h-5 text-champagne-400 flex-shrink-0" />
              <span>
                <strong>AI Allocation Optimizer:</strong> Neural forecasting projects high demand surges in Hazratganj corridor 24 hours ahead.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
