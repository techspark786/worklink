"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  FileCheck,
  Briefcase,
  Layers,
  MapPin,
  CheckCircle2,
  ExternalLink,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Executive Federation Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                Apex State Federation
              </span>
              <span className="text-xs text-slate-400">Reg: UP-STATE-FED-2022-004</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Uttar Pradesh Labour Cooperative Federation (UPLCF)
            </h1>
            <p className="text-xs text-slate-300">
              Executive Command Center: Multi-district cooperative governance, statutory wage benchmarking, and institutional procurement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/federation/contracts"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" /> Institutional Tenders & B2B Contracts
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-colors"
            >
              District Society View
            </Link>
          </div>
        </div>
      </div>

      {/* Statewide Macro Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Affiliated District Societies</span>
            <Building className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">18</span>
          <p className="text-[10px] text-slate-500">Operating across 12 Uttar Pradesh Districts</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Verified Workforce</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">1,420</span>
          <p className="text-[10px] text-emerald-600 font-bold">89.2% Active Duty Deployment</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Statewide Cumulative GMV</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">₹48.2 Lakh</span>
          <p className="text-[10px] text-teal-700 font-semibold">100% Retained by Member Workers</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Federation Solvency Index</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-600">98.6%</span>
          <p className="text-[10px] text-slate-500">₹2.41L Pooled Inter-Coop Reserve</p>
        </div>
      </div>

      {/* AI Demand Forecast & Zonal Deficit Reallocation */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              AI Workforce Demand Forecasting & Zonal Deficit Alerts <Sparkles className="w-5 h-5 text-purple-600" />
            </h2>
            <p className="text-xs text-slate-500">
              RandomForestRegressor ML model predicting hourly household and community service demand shifts.
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 shrink-0">
            Machine Learning Engine Active
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="font-black text-amber-950 text-sm">Zone Deficit Warning: Hazratganj / Aliganj Corridor (Lucknow)</span>
            </div>
            <p className="text-xs text-amber-900">
              Projected Plumbing & Drain Requests (Next 48h): <strong>120</strong> | Available Active Plumbers: <strong>70</strong> (Deficit: -50)
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>ML Mobilization Suggestion:</strong> Dispatch temporary workforce reallocation recommendation to mobilize 20 certified plumbers from Gomti Nagar Zone B with a +₹50/visit cooperative transit allowance.
            </p>
          </div>

          <button
            onClick={() => setReallocationDispatched(true)}
            disabled={reallocationDispatched}
            className={`px-5 py-3 rounded-2xl font-bold text-xs shadow transition-all shrink-0 flex items-center gap-1.5 ${
              reallocationDispatched
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {reallocationDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Directive Sent to District Societies
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" /> Issue Reallocation Recommendation
              </>
            )}
          </button>
        </div>
      </div>

      {/* District Performance & FairWage Compliance Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">District Cooperative Societies Performance Matrix</h2>
            <p className="text-xs text-slate-500">
              Real-time audit tracking of statutory minimum wage floor adherence and healthcare reserve solvency.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            State Gazette Compliance: 99.2%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Affiliated Coops</th>
                <th className="py-3 px-4">Active Members</th>
                <th className="py-3 px-4">Duty Readiness</th>
                <th className="py-3 px-4">Monthly GMV</th>
                <th className="py-3 px-4">Avg. Wage (₹)</th>
                <th className="py-3 px-4">Gazette Audit</th>
                <th className="py-3 px-4 text-right">Health Pool Reserve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {districts.map((d) => (
                <tr key={d.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-black text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {d.name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">
                    {d.cooperativesCount} Societies
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {d.workersCount}
                  </td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">
                    {d.activeDutyRate}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    ₹{d.monthlyGmv.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{d.averageHourlyWage}/hr
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-3 h-3" /> {d.wageCompliance}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                    ₹{d.healthFundBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Contracts Banner Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
              B2B & Government Contracting
            </span>
          </div>
          <h3 className="text-2xl font-black">Institutional Bulk Workforce Procurement Hub</h3>
          <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
            Connect Municipal Corporations (Nagar Nigam), Housing Societies (RWAs), and District Hospitals directly to certified Labour Cooperative Federations with transparent statutory compliance and zero middleman exploitation.
          </p>
        </div>

        <Link
          href="/federation/contracts"
          className="px-6 py-3.5 bg-white text-slate-950 hover:bg-emerald-50 font-black text-xs rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2"
        >
          Explore Institutional Tenders <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
