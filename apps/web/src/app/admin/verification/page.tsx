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
  UserCheck 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Cooperative Administration</span>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Member Verification Queue <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </h1>
          <p className="text-xs text-slate-500">Review member Aadhaar & ITI/NSDC trade certifications for Level 4 status</p>
        </div>

        <Link
          href="/admin/workers"
          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors"
        >
          View Full Member Directory
        </Link>
      </div>

      {/* Verification Queue List */}
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-slate-900 text-base">Verification Queue Cleared!</h2>
            <p className="text-xs text-slate-500">All submitted member certifications have been reviewed.</p>
          </div>
        ) : (
          queue.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                    Trade: {item.trade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">
                    Current: Level {item.currentLevel}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" /> {item.certTitle}
                  </p>
                  <p className="text-slate-600">Issuer: <strong>{item.certIssuer}</strong> | Roll/Certificate #: <span className="font-mono">{item.certNum}</span></p>
                  <p className="text-[10px] text-slate-400">Submitted: {item.submittedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleApprove(item.id, item.name)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Level 4
                </button>
                <button
                  onClick={() => handleReject(item.id, item.name)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-rose-500" /> Request Re-upload
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
