"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  Layers,
  MapPin,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DistrictStat {
  name: string;
  cooperativesCount: number;
  workersCount: number;
  activeDutyRate: string;
  monthlyGmv: number;
  averageHourlyWage: number;
  wageCompliance: string;
  healthFundBalance: number;
}

export default function FederationDashboard() {
  const [districts, setDistricts] = useState<DistrictStat[]>([
    {
      name: 'Lucknow',
      cooperativesCount: 6,
      workersCount: 450,
      activeDutyRate: '91%',
      monthlyGmv: 1845000,
      averageHourlyWage: 410,
      wageCompliance: '100%',
      healthFundBalance: 125060,
    },
    {
      name: 'Kanpur',
      cooperativesCount: 4,
      workersCount: 380,
      activeDutyRate: '88%',
      monthlyGmv: 1280000,
      averageHourlyWage: 395,
      wageCompliance: '99.1%',
      healthFundBalance: 84000,
    },
    {
      name: 'Varanasi',
      cooperativesCount: 4,
      workersCount: 290,
      activeDutyRate: '87%',
      monthlyGmv: 920000,
      averageHourlyWage: 380,
      wageCompliance: '98.8%',
      healthFundBalance: 61500,
    },
    {
      name: 'Agra',
      cooperativesCount: 2,
      workersCount: 180,
      activeDutyRate: '86%',
      monthlyGmv: 510000,
      averageHourlyWage: 375,
      wageCompliance: '98.4%',
      healthFundBalance: 42000,
    },
    {
      name: 'Gorakhpur',
      cooperativesCount: 2,
      workersCount: 120,
      activeDutyRate: '84%',
      monthlyGmv: 265000,
      averageHourlyWage: 360,
      wageCompliance: '98.2%',
      healthFundBalance: 28500,
    },
  ]);

  const [reallocationDispatched, setReallocationDispatched] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Executive Federation Banner */}
      <div className="relative bg-gradient-to-r from-navy-950 via-navy-900 to-espresso-950 text-cream-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-champagne-500/20 overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-[10px] uppercase tracking-wider font-display shadow-glow-rose">
                Apex State Federation
              </span>
              <span className="text-xs text-cream-300/50 font-mono">Reg: UP-STATE-FED-2022-004</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-display gradient-text-hero">
              Uttar Pradesh Labour Cooperative Federation
            </h1>
            <p className="text-xs text-cream-200/70 font-sans max-w-2xl">
              Executive Command Center: Multi-district cooperative governance, statutory wage benchmarking, and institutional procurement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/federation/contracts"
              className="px-5 py-3 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs rounded-2xl shadow-glow-rose transition-all flex items-center gap-2 font-display"
            >
              <Briefcase className="w-4 h-4 text-navy-950" /> 
              <span>Institutional Tenders & Contracts</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-4 py-3 bg-navy-950 hover:bg-navy-800 text-cream-100 font-bold text-xs rounded-2xl border border-navy-700 hover:border-champagne-400/40 transition-all font-display"
            >
              District Society View
            </Link>
          </div>
        </div>
      </div>

      {/* Statewide Macro Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between text-champagne-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Affiliated Societies</span>
            <Building className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-cream-100 font-display block">18</span>
          <p className="text-[10px] text-cream-300/50 font-sans">Operating across 12 UP Districts</p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between text-champagne-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Verified Workforce</span>
            <Users className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-cream-100 font-display block">1,420</span>
          <p className="text-[10px] text-champagne-300 font-bold font-sans">89.2% Active Duty Deployment</p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-rose-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Cumulative GMV</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black gradient-text-rose font-display block">₹48.2 Lakh</span>
          <p className="text-[10px] text-rose-300/70 font-sans">100% Retained by Member Workers</p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between text-champagne-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Solvency Index</span>
            <ShieldCheck className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black gradient-text-gold font-display block">98.6%</span>
          <p className="text-[10px] text-cream-300/50 font-sans">₹2.41L Pooled Inter-Coop Reserve</p>
        </div>
      </div>

      {/* AI Demand Forecast & Zonal Deficit Reallocation */}
      <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-cream-100 font-display flex items-center gap-2">
              <span>AI Workforce Demand Forecasting & Zonal Deficit Alerts</span>
              <Sparkles className="w-5 h-5 text-champagne-400" />
            </h2>
            <p className="text-xs text-cream-200/60 font-sans mt-0.5">
              RandomForest ML model predicting hourly household and community service demand shifts.
            </p>
          </div>
          <span className="px-3 py-1 bg-champagne-500/15 text-champagne-300 font-mono font-bold text-xs rounded-xl border border-champagne-400/30 shrink-0">
            ML Prediction Active
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-950 border border-champagne-500/25 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-champagne-400 shrink-0" />
              <span className="font-black text-cream-100 text-sm font-display">
                Zone Deficit Warning: Hazratganj / Aliganj Corridor (Lucknow)
              </span>
            </div>
            <p className="text-xs text-cream-200/80 font-sans">
              Projected Plumbing Requests (Next 48h): <strong className="text-champagne-300 font-mono">120</strong> | Available Active Plumbers: <strong className="text-rose-300 font-mono">70</strong> (Deficit: -50)
            </p>
            <p className="text-[11px] text-cream-300/60 leading-relaxed font-sans">
              <strong>ML Mobilization Suggestion:</strong> Dispatch temporary workforce reallocation recommendation to mobilize 20 certified plumbers from Gomti Nagar Zone B with a +₹50/visit cooperative transit allowance.
            </p>
          </div>

          <button
            onClick={() => setReallocationDispatched(true)}
            disabled={reallocationDispatched}
            className={`px-6 py-3 rounded-2xl font-black text-xs shadow-lg transition-all shrink-0 flex items-center gap-2 font-display ${
              reallocationDispatched
                ? 'bg-navy-900 border border-champagne-400/40 text-champagne-300 cursor-default'
                : 'bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 shadow-glow-rose cursor-pointer'
            }`}
          >
            {reallocationDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-champagne-400" />
                <span>Directive Sent to District Societies</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4 text-navy-950" />
                <span>Issue Mobilization Directive</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* District Performance & FairWage Compliance Matrix */}
      <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-cream-100 font-display">District Cooperative Performance Matrix</h2>
            <p className="text-xs text-cream-200/60 font-sans mt-0.5">
              Real-time audit tracking of statutory minimum wage floor adherence and healthcare reserve solvency.
            </p>
          </div>
          <span className="text-xs font-bold text-champagne-300 bg-champagne-500/15 px-3 py-1 rounded-xl border border-champagne-400/30 font-mono">
            State Gazette Compliance: 99.2%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-navy-800 text-cream-300/40 font-bold uppercase tracking-wider text-[10px] font-display">
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Affiliated Coops</th>
                <th className="py-3.5 px-4">Active Members</th>
                <th className="py-3.5 px-4">Duty Readiness</th>
                <th className="py-3.5 px-4">Monthly GMV</th>
                <th className="py-3.5 px-4">Avg. Wage</th>
                <th className="py-3.5 px-4">Gazette Audit</th>
                <th className="py-3.5 px-4 text-right">Health Pool Reserve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/80 text-cream-200/80 font-sans">
              {districts.map((d) => (
                <tr key={d.name} className="hover:bg-navy-950/60 transition-colors">
                  <td className="py-3.5 px-4 font-black text-cream-100 flex items-center gap-1.5 font-display">
                    <MapPin className="w-3.5 h-3.5 text-champagne-400" /> {d.name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-cream-200">
                    {d.cooperativesCount} Societies
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cream-100 font-mono">
                    {d.workersCount}
                  </td>
                  <td className="py-3.5 px-4 text-champagne-300 font-bold font-mono">
                    {d.activeDutyRate}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-cream-100">
                    ₹{d.monthlyGmv.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cream-100 font-mono">
                    ₹{d.averageHourlyWage}/hr
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 font-bold text-[10px] flex items-center gap-1 w-fit font-mono">
                      <ShieldCheck className="w-3 h-3" /> {d.wageCompliance}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold gradient-text-gold">
                    ₹{d.healthFundBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Contracts Banner Card */}
      <div className="relative bg-gradient-to-r from-navy-950 to-espresso-950 text-cream-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl border border-champagne-500/20 overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-champagne-500/20 text-champagne-300 text-[10px] font-black uppercase font-display border border-champagne-400/30">
              B2B & Government Contracting
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero">
            Institutional Bulk Workforce Procurement Hub
          </h3>
          <p className="text-xs text-cream-200/70 max-w-2xl leading-relaxed font-sans">
            Connect Municipal Corporations (Nagar Nigam), Housing Societies (RWAs), and District Hospitals directly to certified Labour Cooperative Federations with transparent statutory compliance and zero middleman exploitation.
          </p>
        </div>

        <Link
          href="/federation/contracts"
          className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs rounded-2xl shadow-glow-rose transition-all shrink-0 flex items-center gap-2 font-display cursor-pointer"
        >
          <span>Explore Institutional Tenders</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
