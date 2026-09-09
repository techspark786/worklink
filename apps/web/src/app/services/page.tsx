"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  Home as HomeIcon, 
  Wind, 
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Search
} from 'lucide-react';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const catalog = [
    { id: '1', name: 'Electrician', category: 'Electrical & Power', icon: Zap, price: 400, emergency: true, desc: 'Ceiling fan repair, MCB installation, wiring, lighting, switchboard fixes.' },
    { id: '2', name: 'Plumber', category: 'Plumbing & Drainage', icon: Droplets, price: 450, emergency: true, desc: 'Pipe leakages, tap replacement, drainage unblocking, water tank installation.' },
    { id: '3', name: 'Carpenter', category: 'Woodwork & Furniture', icon: Hammer, price: 500, emergency: false, desc: 'Door repair, furniture assembly, cabinet hinges, lock replacement.' },
    { id: '4', name: 'Painter', category: 'Wall & Finishing', icon: Paintbrush, price: 800, emergency: false, desc: 'Interior touchups, waterproof coating, exterior painting, texture wall art.' },
    { id: '5', name: 'Cleaner & Sanitation', category: 'Cleaning & Hygiene', icon: Sparkles, price: 600, emergency: false, desc: 'Deep house cleaning, bathroom sanitization, sofa & carpet shampooing.' },
    { id: '6', name: 'Domestic Helper', category: 'Household Care', icon: HomeIcon, price: 350, emergency: true, desc: 'Daily housekeeping, cooking assistance, laundry, elderly care assistance.' },
    { id: '7', name: 'AC Technician', category: 'Appliance Repair', icon: Wind, price: 650, emergency: true, desc: 'AC servicing, gas refill, compressor troubleshooting, installation.' },
    { id: '8', name: 'Appliance Repair', category: 'Appliance Repair', icon: Wrench, price: 450, emergency: true, desc: 'Washing machine, microwave, refrigerator, RO water purifier repair.' },
  ];

  const filtered = catalog.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmergency = emergencyOnly ? item.emergency : true;
    return matchesSearch && matchesEmergency;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Verified Service Catalog <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Database-driven local services fulfilled by certified Labour Cooperative members.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search electrician, plumber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <button
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              emergencyOnly 
                ? 'bg-rose-600 text-white border-rose-700 shadow' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> 45-Min Emergency Services
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((srv) => {
          const Icon = srv.icon;
          return (
            <div key={srv.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  {srv.emergency && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                      Emergency ⚡
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{srv.category}</span>
                  <h3 className="text-lg font-bold text-slate-900">{srv.name}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Base Rate</span>
                  <span className="text-base font-bold text-slate-900">₹{srv.price}</span>
                </div>
                <Link
                  href={`/customer/dashboard?service=${srv.name}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
                >
                  Book Worker
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
