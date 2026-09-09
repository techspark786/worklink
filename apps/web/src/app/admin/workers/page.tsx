"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  Star, 
  MapPin, 
  CheckCircle2, 
  HeartHandshake 
} from 'lucide-react';

export default function AdminWorkersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      id: 'w1',
      name: 'Ramesh Kumar',
      trade: 'Electrician',
      verificationLevel: 4,
      isAvailable: true,
      rating: 4.9,
      completedJobs: 142,
      welfareContributed: '₹7,100',
      certifications: 2,
    },
    {
      id: 'w2',
      name: 'Suresh Chandra',
      trade: 'Plumber',
      verificationLevel: 3,
      isAvailable: true,
      rating: 4.7,
      completedJobs: 89,
      welfareContributed: '₹3,950',
      certifications: 1,
    },
    {
      id: 'w3',
      name: 'Vikram Singh',
      trade: 'Carpenter',
      verificationLevel: 4,
      isAvailable: false,
      rating: 4.8,
      completedJobs: 110,
      welfareContributed: '₹5,500',
      certifications: 2,
    }
  ];

  const filtered = members.filter(
    (m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.trade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Cooperative Administration</span>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Cooperative Member Directory <Building2 className="w-6 h-6 text-emerald-600" />
          </h1>
          <p className="text-xs text-slate-500">Lucknow Labour Cooperative Society Ltd. (45 Registered Members)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search member or trade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <Link
            href="/admin/verification"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Verification Queue (2)
          </Link>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member Name</th>
                <th className="p-4">Trade</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Duty Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Jobs Done</th>
                <th className="p-4">5% Welfare Pooled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {m.name[0]}
                    </div>
                    {m.name}
                  </td>
                  <td className="p-4">{m.trade}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                      Level {m.verificationLevel} Verified
                    </span>
                  </td>
                  <td className="p-4">
                    {m.isAvailable ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[10px]">
                        Offline
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {m.rating}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{m.completedJobs}</td>
                  <td className="p-4 font-bold text-emerald-700">{m.welfareContributed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
