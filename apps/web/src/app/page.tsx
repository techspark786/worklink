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
  ArrowRight,
  HeartHandshake,
  ArrowUpRight,
  CheckCircle,
  Star,
  Activity,
  Lock,
  Clock,
  ChevronRight,
  Building2,
  HardHat
} from 'lucide-react';

export default function Home() {
  const services = [
    { name: 'Electrician', icon: Zap, color: 'from-amber-500/20 to-champagne-500/20 border-champagne-400/30 text-champagne-300', price: '₹400', desc: 'Wiring, MCB, Fan Repair & Load Management' },
    { name: 'Plumber', icon: Droplets, color: 'from-rose-500/20 to-espresso-700/30 border-rose-400/30 text-rose-300', price: '₹450', desc: 'Pipe Leaks, Drainage, Taps & Sanitary Fixes' },
    { name: 'Carpenter', icon: Hammer, color: 'from-champagne-500/20 to-espresso-700/30 border-champagne-400/30 text-champagne-300', price: '₹500', desc: 'Furniture, Locks, Woodwork & Cabinet Assembly' },
  ];

  const corePillars = [
    {
      title: 'Cooperative Ownership & Fair Wages',
      badge: '90% Direct Pay',
      desc: 'Workers retain 90% direct earnings while 5% is deposited directly into a pooled member emergency & health welfare fund under Section 70.',
      icon: HeartHandshake,
      accent: 'rose',
      borderGlow: 'hover:border-rose-400/50 hover:shadow-[0_0_30px_rgba(224,141,164,0.15)]'
    },
    {
      title: 'AI FairMatch & Geospatial Engine',
      badge: 'Explainable AI',
      desc: 'Multi-factor explainable worker ranking combining Skill (30%), Proximity (25%), Availability (20%), Rating (15%), and Experience (10%).',
      icon: Sparkles,
      accent: 'champagne',
      borderGlow: 'hover:border-champagne-400/50 hover:shadow-[0_0_30px_rgba(230,201,135,0.15)]'
    },
    {
      title: 'Multi-Level Identity & Skill KYC',
      badge: 'Level 0 to 5',
      desc: 'Rigorous 6-tier verification framework combining Aadhaar biometric KYC, Govt ITI/NSDC skill certification, and cooperative federation backing.',
      icon: ShieldCheck,
      accent: 'rose',
      borderGlow: 'hover:border-rose-400/50 hover:shadow-[0_0_30px_rgba(224,141,164,0.15)]'
    },
    {
      title: 'AI Demand Forecasting & Allocation',
      badge: 'RandomForest ML',
      desc: '24-hour ward-level demand predictive engine empowering cooperative admins to proactively balance worker supply across city zones.',
      icon: TrendingUp,
      accent: 'champagne',
      borderGlow: 'hover:border-champagne-400/50 hover:shadow-[0_0_30px_rgba(230,201,135,0.15)]'
    }
  ];

  return (
    <div className="relative space-y-24 py-6 overflow-hidden">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-96 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-[600px] -right-40 w-96 h-96 bg-rose-400/5 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

      {/* 🌟 HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="relative rounded-3xl p-6 sm:p-12 lg:p-16 border border-amber-300/30 dark:border-white/[0.08] bg-gradient-to-br from-white/90 via-[#FAF7F2]/85 to-[#FFF7EC]/90 dark:from-[#0B152B]/70 dark:via-[#160E0A]/60 dark:to-[#070D1E]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(180,120,50,0.08)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Ambient Corner Glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br from-amber-500/15 to-rose-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-rose-200/20 dark:from-espresso-700/20 dark:to-navy-700/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-7">
              {/* Event Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-amber-100/50 dark:bg-white/[0.04] border border-amber-300/60 dark:border-champagne-400/30 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-700 dark:text-champagne-300" />
                <span className="text-amber-900 dark:text-champagne-200 font-semibold text-xs tracking-wide">
                  Code Craft 3.0 Platform Prototype
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </div>

              {/* Grand Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A110D] dark:text-white leading-[1.12]">
                Trust-First Local Services <br />
                Powered by{' '}
                <span className="gradient-text-hero">
                  Labour Cooperatives
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#5C3A2B] dark:text-cream-200/80 text-base sm:text-lg font-light leading-relaxed max-w-xl">
                Connecting households and institutions with certified, skilled cooperative workers through fair-wage matching, transparent pricing, and AI-assisted dispatch.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  href="/services" 
                  className="group relative px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white dark:text-[#070D1E] bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 dark:from-champagne-300 dark:via-rose-300 dark:to-champagne-400 shadow-[0_4px_20px_rgba(180,83,9,0.3)] dark:shadow-[0_0_25px_rgba(230,201,135,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
                >
                  <span>Explore 50+ Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  href="/register" 
                  className="px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm text-[#38241B] dark:text-cream-100 bg-amber-50/80 dark:bg-white/[0.04] border border-amber-300/60 dark:border-white/[0.12] hover:bg-amber-100/60 dark:hover:bg-white/[0.08] transition-all duration-200 flex items-center gap-2"
                >
                  <span>Join as Cooperative Member</span>
                  <ArrowUpRight className="w-4 h-4 text-amber-700 dark:text-champagne-300" />
                </Link>
              </div>

              {/* Quick AI Search Bar */}
              <div className="pt-2">
                <div className="p-2 rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-amber-300/40 dark:border-white/[0.1] flex flex-col sm:flex-row items-center gap-2 shadow-inner">
                  <div className="flex-1 flex items-center gap-3 px-3 py-2 text-[#38241B] dark:text-cream-200 text-xs sm:text-sm w-full">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-champagne-400 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Describe your issue in Hindi or English (e.g. 'Fan not working' or 'नल टपक रहा है')..."
                      className="bg-transparent border-none text-[#1A110D] placeholder-[#5C3A2B]/50 dark:text-white dark:placeholder-cream-200/40 focus:outline-none w-full text-xs sm:text-sm font-light"
                      readOnly
                    />
                  </div>
                  <Link 
                    href="/services" 
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 border border-amber-500/40"
                  >
                    <span>AI Find Worker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Layered Perspective Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
              {/* Decorative 3D Spheres & Glow */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-400/30 blur-xl animate-float-slow pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-700/30 blur-xl animate-float-delayed pointer-events-none" />

              {/* Main 3D Floating Worker Card */}
              <div className="relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-white via-[#FAF7F2] to-[#FFF9F2] dark:from-[#101F3C]/90 dark:via-[#1A110D]/85 dark:to-[#070D1E]/95 border border-amber-300/40 dark:border-white/[0.12] shadow-[0_20px_50px_rgba(180,120,50,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-5 animate-float-slow">
                {/* Header with Live Status */}
                <div className="flex items-center justify-between border-b border-amber-200/50 dark:border-white/[0.08] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 dark:from-rose-500 dark:via-espresso-700 dark:to-navy-800 border border-amber-300/50 flex items-center justify-center font-bold text-white text-base shadow-lg">
                      RK
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-sm text-[#1A110D] dark:text-white">Ramesh Kumar</h3>
                        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-champagne-400" />
                      </div>
                      <p className="text-[11px] text-[#5C3A2B] dark:text-cream-200/60">Master Electrician • 8 Yrs Exp</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-400/40 dark:border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Available
                  </span>
                </div>

                {/* Rating & Match Metric Pill */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-white/[0.03] border border-amber-200/50 dark:border-white/[0.07] text-center">
                    <span className="text-[10px] text-[#5C3A2B]/70 dark:text-cream-200/50 uppercase tracking-wider block font-semibold">FairMatch™ Score</span>
                    <span className="text-xl font-display font-extrabold text-amber-700 dark:text-champagne-300">98.4%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-white/[0.03] border border-amber-200/50 dark:border-white/[0.07] text-center">
                    <span className="text-[10px] text-[#5C3A2B]/70 dark:text-cream-200/50 uppercase tracking-wider block font-semibold">Member Rating</span>
                    <span className="text-xl font-display font-extrabold text-amber-700 dark:text-rose-300 flex items-center justify-center gap-1">
                      4.95 <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-rose-300 dark:text-rose-300" />
                    </span>
                  </div>
                </div>

                {/* Cooperative Accreditation */}
                <div className="p-3 rounded-2xl bg-amber-100/40 dark:bg-[#1A110D]/60 border border-amber-300/40 dark:border-champagne-400/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1A110D] dark:text-white text-[11px]">Section 70 Cooperative</span>
                    <span className="text-[10px] text-amber-700 dark:text-champagne-300 font-mono">Reg #UP-LKO-2024</span>
                  </div>
                  <p className="text-[10px] text-[#5C3A2B] dark:text-cream-200/60">Lucknow Central Labour Cooperative Society Ltd.</p>
                </div>

                {/* Live Doorstep Dual-OTP Banner */}
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-white/[0.04] border border-amber-200/50 dark:border-white/[0.08] flex items-center justify-between text-[11px]">
                  <span className="text-[#5C3A2B] dark:text-cream-200/70 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-champagne-400" /> Dual-OTP Security
                  </span>
                  <span className="text-amber-800 dark:text-champagne-300 font-mono font-bold">Enabled</span>
                </div>

                {/* Floating Top-Right Mini Card */}
                <div className="absolute -top-5 -right-6 px-3.5 py-2 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#1A110D] dark:to-[#070D1E] border border-amber-300/60 dark:border-champagne-400/40 shadow-xl flex items-center gap-2 animate-float-delayed">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-[10px] font-bold text-[#1A110D] dark:text-white">45-Min Express Dispatch</span>
                </div>

                {/* Floating Bottom-Left Mini Card */}
                <div className="absolute -bottom-6 -left-6 px-3.5 py-2 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0B152B] dark:to-[#1A110D] border border-amber-300/60 dark:border-rose-400/40 shadow-xl flex items-center gap-2 animate-float-slow">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-700 dark:text-rose-400" />
                  <span className="text-[10px] font-bold text-[#1A110D] dark:text-cream-100">5% Pooled Welfare Fund</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Ticker */}
          <div className="mt-14 pt-8 border-t border-amber-200/50 dark:border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-amber-200/50 dark:border-white/[0.05]">
              <span className="block font-display text-2xl sm:text-3xl font-black text-amber-800 dark:text-champagne-300">100%</span>
              <span className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-medium mt-0.5 block">Verified Cooperative Workers</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-amber-200/50 dark:border-white/[0.05]">
              <span className="block font-display text-2xl sm:text-3xl font-black text-amber-800 dark:text-rose-300">90%</span>
              <span className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-medium mt-0.5 block">Direct Earnings to Worker</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-amber-200/50 dark:border-white/[0.05]">
              <span className="block font-display text-2xl sm:text-3xl font-black text-amber-800 dark:text-champagne-300">5%</span>
              <span className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-medium mt-0.5 block">Pooled Health & Welfare Fund</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-amber-200/50 dark:border-white/[0.05]">
              <span className="block font-display text-2xl sm:text-3xl font-black text-amber-800 dark:text-rose-300">AI-Native</span>
              <span className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-medium mt-0.5 block">Predictive Demand Forecasting</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 VALUE PROPOSITION / COMPREHENSIVE PROTECTION BENEFITS (Matches Ensure Education Screenshot) */}
      <section id="benefits" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="pill-badge-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span>VALUE PROPOSITION</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A110D] dark:text-white tracking-tight">
            Comprehensive Protection Benefits
          </h2>
          
          <p className="text-[#5C3A2B] dark:text-cream-200/70 text-base sm:text-lg font-light leading-relaxed">
            Dedicated protection and democratic governance engineered specifically for cooperative workers and households.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: For Customers */}
          <div className="warm-benefit-card">
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#B45309] dark:text-champagne-300">
                For Customers
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#38241B] dark:text-cream-200/80 font-normal leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Uninterrupted, reliable household services delivered by background-verified cooperative members</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>100% transparent pricing with zero middleman markups or exploitative surge multipliers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Dual-OTP security verification handshake before starting and after completing any gig</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: For Cooperative Workers */}
          <div className="warm-benefit-card">
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#B45309] dark:text-champagne-300">
                For Workers & Families
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#38241B] dark:text-cream-200/80 font-normal leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Peace of mind with 90% direct earnings paid instantly without hidden platform commission cuts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Section 70 pooled member health cover, accident insurance, and digital work history tracking</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Equitable AI FairMatch algorithm prioritizing fair opportunity and proximity ranking</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: For Partner Cooperatives & Federations */}
          <div className="warm-benefit-card">
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#B45309] dark:text-champagne-300">
                For Partner Cooperatives
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#38241B] dark:text-cream-200/80 font-normal leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Centralized zonal demand forecasting empowering societies to optimize multi-ward supply</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Automated compliance, statutory dividend distribution, and audited dispute management</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-champagne-400 font-bold text-base leading-none">✓</span>
                  <span>Direct integration with State Federation registries and skill development boards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🛡️ CORE DIFFERENTIATION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/50 dark:bg-white/[0.04] border border-amber-300/60 dark:border-white/[0.08] text-amber-800 dark:text-champagne-300 text-[11px] font-semibold uppercase tracking-wider">
            Democratic Cooperative Model
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1A110D] dark:text-white tracking-tight">
            Why WorkLink is NOT an Urban Company Clone
          </h2>
          <p className="text-[#5C3A2B] dark:text-cream-200/70 text-sm leading-relaxed font-light">
            Empowering registered Labour Cooperative Societies and State Federations to democratically govern their digital workforce ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className={`glass-card p-6 rounded-3xl space-y-4 transition-all duration-300 ${pillar.borderGlow} flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/60 dark:bg-gradient-to-br dark:from-[#1A110D] dark:to-[#0B152B] border border-amber-300/40 dark:border-white/[0.1] flex items-center justify-center text-amber-700 dark:text-champagne-300 shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-white/[0.05] border border-amber-200/60 dark:border-white/[0.1] text-[10px] font-bold text-amber-800 dark:text-cream-200/80">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[#1A110D] dark:text-white text-base leading-snug">{pillar.title}</h3>
                  <p className="text-xs text-[#5C3A2B] dark:text-cream-200/60 leading-relaxed font-light">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🚀 ROLE NAVIGATION PORTAL EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-white/95 via-[#FAF7F2]/90 to-[#FFF7EC]/95 dark:from-[#0B152B]/90 dark:via-[#160E0A]/80 dark:to-[#070D1E]/95 border border-amber-300/40 dark:border-white/[0.08] shadow-[0_20px_50px_rgba(180,120,50,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-200/50 dark:border-white/[0.08] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-rose-400" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A110D] dark:text-white">Explore Platform Portals</h2>
              </div>
              <p className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-light">Switch contexts to test end-to-end functionality for all 4 role archetypes.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100/60 text-amber-800 dark:bg-champagne-500/10 dark:text-champagne-300 text-xs font-mono border border-amber-300/40 dark:border-champagne-500/20">
              Role-Based Architecture Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link 
              href="/customer/dashboard" 
              className="p-6 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-amber-200/60 dark:border-white/[0.08] hover:border-amber-400 dark:hover:border-champagne-400/40 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-300 space-y-4 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-xl bg-amber-50 dark:bg-white/[0.04] border border-amber-200/60 dark:border-white/[0.08]">👤</span>
                <ArrowRight className="w-4 h-4 text-[#5C3A2B]/40 group-hover:text-amber-700 dark:text-cream-200/40 dark:group-hover:text-champagne-300 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#1A110D] dark:text-white text-base">Customer Portal</h3>
                <p className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-light mt-1 leading-relaxed">
                  Describe problem, compare FairMatch-ranked workers, book doorstep service with Dual-OTP.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-champagne-300 flex items-center gap-1 pt-1">
                Enter Portal <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            <Link 
              href="/worker/dashboard" 
              className="p-6 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-amber-200/60 dark:border-white/[0.08] hover:border-rose-400 dark:hover:border-rose-400/40 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-300 space-y-4 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-xl bg-amber-50 dark:bg-white/[0.04] border border-amber-200/60 dark:border-white/[0.08]">🛠️</span>
                <ArrowRight className="w-4 h-4 text-[#5C3A2B]/40 group-hover:text-amber-700 dark:text-cream-200/40 dark:group-hover:text-rose-300 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#1A110D] dark:text-white text-base">Worker Portal</h3>
                <p className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-light mt-1 leading-relaxed">
                  Toggle availability, accept live dispatched gigs, enter start/completion OTP & track earnings.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-rose-300 flex items-center gap-1 pt-1">
                Enter Portal <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            <Link 
              href="/admin/dashboard" 
              className="p-6 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-amber-200/60 dark:border-white/[0.08] hover:border-amber-400 dark:hover:border-champagne-400/40 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-300 space-y-4 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-xl bg-amber-50 dark:bg-white/[0.04] border border-amber-200/60 dark:border-white/[0.08]">🏢</span>
                <ArrowRight className="w-4 h-4 text-[#5C3A2B]/40 group-hover:text-amber-700 dark:text-cream-200/40 dark:group-hover:text-champagne-300 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#1A110D] dark:text-white text-base">Coop Admin</h3>
                <p className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-light mt-1 leading-relaxed">
                  Approve worker KYC, monitor Section 70 welfare fund reserves & tune FairMatch engine weights.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-champagne-300 flex items-center gap-1 pt-1">
                Enter Portal <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            <Link 
              href="/federation/dashboard" 
              className="p-6 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-amber-200/60 dark:border-white/[0.08] hover:border-rose-400 dark:hover:border-rose-400/40 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-300 space-y-4 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-xl bg-amber-50 dark:bg-white/[0.04] border border-amber-200/60 dark:border-white/[0.08]">🏛️</span>
                <ArrowRight className="w-4 h-4 text-[#5C3A2B]/40 group-hover:text-amber-700 dark:text-cream-200/40 dark:group-hover:text-rose-300 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#1A110D] dark:text-white text-base">State Federation</h3>
                <p className="text-xs text-[#5C3A2B] dark:text-cream-200/60 font-light mt-1 leading-relaxed">
                  Statewide GMV analytics, AI demand forecasting heatmaps & city zone workforce shortage allocation.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-rose-300 flex items-center gap-1 pt-1">
                Enter Portal <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
