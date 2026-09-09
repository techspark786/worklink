"use client";

import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  Briefcase, 
  UserCheck,
  Building2
} from 'lucide-react';

export default function WorkerProfilePage() {
  const worker = {
    name: 'Ramesh Kumar',
    trade: 'Electrician',
    cooperative: 'Lucknow Labour Cooperative Society Ltd.',
    regNo: 'UP-LKO-COOP-2024-001',
    verificationLevel: 4,
    skills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
    experience: '7 Years',
    rate: '₹400 / hr',
    radius: '8 km radius',
    rating: 4.9,
    jobsCompleted: 142,
    welfareBalance: '₹7,100',
    insuranceActive: true,
    certifications: [
      { title: 'ITI Electrical Trade Certificate', issuer: 'Govt ITI Lucknow', reg: 'ITI-UP-2021-88492', verified: true },
      { title: 'National Safety Skill Council Badge', issuer: 'NSDC India', reg: 'NSDC-SAF-9912', verified: true }
    ]
  };

  const levels = [
    { level: 0, title: 'Registered', desc: 'Account Created' },
    { level: 1, title: 'Identity Verified', desc: 'Aadhaar KYC' },
    { level: 2, title: 'Profession Declared', desc: 'Electrician' },
    { level: 3, title: 'Skill Verified', desc: 'Skill Assessment' },
    { level: 4, title: 'Doc Verified', desc: 'ITI/NSDC Verified' },
    { level: 5, title: 'Platform Trusted', desc: '100+ Jobs' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg">
            RK
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{worker.name}</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Level {worker.verificationLevel} Verified Worker
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {worker.cooperative}
            </p>
            <p className="text-[11px] text-slate-400">Reg: {worker.regNo}</p>
          </div>
        </div>

        <Link
          href="/worker/onboarding"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors"
        >
          Update Skills & Certificates
        </Link>
      </div>

      {/* Verification Level Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Multi-Level Verification Framework <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            Level 4 Document Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {levels.map((lvl) => {
            const isCompleted = lvl.level <= worker.verificationLevel;
            return (
              <div 
                key={lvl.level}
                className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center gap-1 font-bold text-xs">
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="text-[10px]">Level {lvl.level}</span>}
                </div>
                <h3 className="font-bold text-xs">{lvl.title}</h3>
                <p className="text-[10px] text-slate-500">{lvl.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Details & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Skills & Rates */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Trade Skills & Parameters <Briefcase className="w-5 h-5 text-emerald-600" />
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Primary Service</span>
              <span className="font-bold text-slate-900 text-sm">{worker.trade}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold mb-1">Tag Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {worker.skills.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Experience</span>
                <span className="font-bold text-slate-900">{worker.experience}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Hourly Rate</span>
                <span className="font-bold text-emerald-700">{worker.rate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Verified Certifications */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Verified Certifications & Licenses <Award className="w-5 h-5 text-emerald-600" />
          </h2>

          <div className="space-y-3">
            {worker.certifications.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cooperative Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Issuer: {c.issuer} | Reg #: {c.reg}</p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
