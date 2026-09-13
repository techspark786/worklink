"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Building2, 
  FileText, 
  UserCheck,
  ArrowLeft
} from 'lucide-react';

export default function AdminVerificationPage() {
  const [queue, setQueue] = useState([
    {
      id: 'w-101',
      name: 'Mahesh Verma',
      trade: 'Plumber',
      currentLevel: 2,
      certTitle: 'ITI Plumber Certificate',
      certIssuer: 'Govt ITI Kanpur',
      certNum: 'ITI-KNP-2022-9912',
      submittedAt: '2 Hours Ago',
    },
    {
      id: 'w-102',
      name: 'Deepak Sharma',
      trade: 'Carpenter',
      currentLevel: 2,
      certTitle: 'NSDC Woodwork Level 3 Badge',
      certIssuer: 'NSDC India',
      certNum: 'NSDC-WW-7712',
      submittedAt: '5 Hours Ago',
    }
  ]);

  const handleApprove = (id: string, name: string) => {
    setQueue(queue.filter(q => q.id !== id));
    alert(`Successfully verified ${name}! Verification Level updated to Level 4.`);
  };

  const handleReject = (id: string, name: string) => {
    setQueue(queue.filter(q => q.id !== id));
    alert(`Verification request for ${name} marked for re-upload.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-navy-900/80 backdrop-blur-2xl border border-champagne-500/20 shadow-2xl shadow-navy-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="relative z-10">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-champagne-300 hover:text-champagne-200 mb-2 transition-colors font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cooperative Admin
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero flex items-center gap-2.5">
            <span>Member Verification Queue</span>
            <ShieldCheck className="w-7 h-7 text-champagne-400" />
          </h1>
          <p className="text-xs text-cream-200/60 mt-1 font-sans">
            Review member Aadhaar & ITI/NSDC trade certifications for Level 4 status
          </p>
        </div>

        <Link
          href="/admin/workers"
          className="px-5 py-3 bg-navy-950 hover:bg-navy-800 text-cream-100 border border-navy-700 hover:border-champagne-400/40 font-bold text-xs rounded-2xl transition-all font-display relative z-10"
        >
          View Member Directory
        </Link>
      </div>

      {/* Verification Queue List */}
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="p-12 text-center bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-champagne-400 mx-auto" />
            <h2 className="font-bold text-cream-100 text-base font-display">Verification Queue Cleared!</h2>
            <p className="text-xs text-cream-200/60 font-sans">All submitted member certifications have been reviewed.</p>
          </div>
        ) : (
          queue.map((item) => (
            <div 
              key={item.id} 
              className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 hover:border-champagne-400/40 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all overflow-hidden"
            >
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

              <div className="space-y-2.5 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-cream-100 text-lg font-display">{item.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-lg bg-navy-950 text-cream-200 text-xs font-bold border border-navy-700 font-sans">
                    Trade: {item.trade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-champagne-500/15 text-champagne-300 text-xs font-bold font-mono">
                    Current: Level {item.currentLevel}
                  </span>
                </div>

                <div className="p-3.5 bg-navy-950/80 rounded-2xl border border-champagne-500/15 text-xs space-y-1 font-sans">
                  <p className="font-bold text-cream-100 flex items-center gap-1.5 font-display">
                    <Award className="w-4 h-4 text-champagne-400" /> {item.certTitle}
                  </p>
                  <p className="text-cream-200/70">
                    Issuer: <strong className="text-cream-100">{item.certIssuer}</strong> | Roll/Certificate #: <span className="font-mono text-champagne-300">{item.certNum}</span>
                  </p>
                  <p className="text-[10px] text-cream-300/40 font-mono">Submitted: {item.submittedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 relative z-10">
                <button
                  onClick={() => handleApprove(item.id, item.name)}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose transition-all flex items-center gap-1.5 font-display cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-navy-950" /> Approve Level 4
                </button>
                <button
                  onClick={() => handleReject(item.id, item.name)}
                  className="px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-cream-200/80 border border-navy-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 font-display cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-400" /> Request Re-upload
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
