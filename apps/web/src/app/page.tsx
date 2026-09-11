"use client";

import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Award, 
  TrendingUp, 
  MapPin, 
  Zap, 
  Droplets, 
  Hammer, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

export default function Home() {
  const services = [
    { name: 'Electrician', icon: Zap, color: 'text-amber-500 bg-amber-50', desc: 'Wiring, MCB, Fan Repair & Load Management' },
    { name: 'Plumber', icon: Droplets, color: 'text-blue-500 bg-blue-50', desc: 'Pipe Leaks, Drainage, Taps & Sanitary Fixes' },
    { name: 'Carpenter', icon: Hammer, color: 'text-orange-500 bg-orange-50', desc: 'Furniture, Locks, Woodwork & Cabinet Assembly' },
  ];

  const corePillars = [
    {
      title: 'Cooperative Ownership & Fair Wages',
      desc: 'Workers retain 90% direct earnings while 5% is deposited directly into a pooled member emergency & health welfare fund.',
      icon: HeartHandshake,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'AI FairMatch & Geospatial Engine',
      desc: 'Multi-factor explainable worker ranking combining Skill (30%), Distance (25%), Availability (20%), Rating (15%), and Experience (10%).',
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Multi-Level Identity & Skill Verification',
      desc: 'Verification levels 0-5 combining Aadhaar KYC, ITI/NSDC skill certification, and cooperative federation backing.',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: 'AI Demand Forecasting & Allocation',
      desc: 'RandomForest predictive model forecasting 24-hr demand per city zone to alert admins of workforce shortage gaps.',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-emerald-400" />
              Smart India Hackathon 2026 Prototype
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Trust-First Local Services Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Labour Cooperatives</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              Connecting households and institutions with verified, skilled cooperative workers through fair-wage matching, transparent pricing, and AI-assisted dispatch.
            </p>

            {/* Quick AI Search Bar Mock */}
            <div className="bg-white/10 backdrop-blur border border-white/20 p-2 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-inner">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 text-slate-200 text-sm w-full">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Describe your issue in Hindi or English (e.g. 'Fan not working' or 'नल टपक रहा है')..."
                  className="bg-transparent border-none text-white placeholder-slate-400 focus:outline-none w-full text-sm"
                  readOnly
                />
              </div>
              <Link 
                href="/services" 
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow flex items-center justify-center gap-2 shrink-0"
              >
                AI Find Worker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="block text-2xl font-black text-emerald-400">100%</span>
                <span className="text-slate-400">Verified Workers</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">90%</span>
                <span className="text-slate-400">Direct Earnings to Worker</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">5%</span>
                <span className="text-slate-400">Pooled Welfare Fund</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">AI-Native</span>
                <span className="text-slate-400">Demand Forecasting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Differentiation Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Why ShramSetu is NOT an Urban Company Clone
          </h2>
          <p className="text-slate-600 text-sm">
            Empowering Labour Cooperative Societies and Federations to own their digital ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${pillar.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Navigation Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Explore Platform Portals</h2>
              <p className="text-xs text-slate-400 mt-1">Switch contexts to test end-to-end functionality for all 4 roles.</p>
            </div>
            <span className="px-3 py-1 rounded bg-slate-800 text-emerald-400 text-xs font-mono border border-slate-700">
              Role-Based Architecture Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/customer/dashboard" className="p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="text-2xl">👤</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-sm">Customer Portal</h3>
              <p className="text-xs text-slate-400">Describe problem, compare AI-ranked workers, book & track service.</p>
            </Link>

            <Link href="/worker/dashboard" className="p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🛠️</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-sm">Worker Portal</h3>
              <p className="text-xs text-slate-400">Toggle availability, accept gigs, view earnings & 5% welfare pool.</p>
            </Link>

            <Link href="/admin/dashboard" className="p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🏢</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-sm">Coop Admin</h3>
              <p className="text-xs text-slate-400">Approve worker KYC, monitor welfare reserve & adjust matching weights.</p>
            </Link>

            <Link href="/federation/dashboard" className="p-5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-all space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🏛️</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-sm">State Federation</h3>
              <p className="text-xs text-slate-400">Statewide GMV analytics, AI demand forecasting & shortage allocation.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
