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
  Search,
  ArrowRight
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-champagne-400/20 text-champagne-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-champagne-400" />
            <span>Section 70 Verified Registry</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
            Verified Services Catalog
          </h1>
          <p className="text-sm text-cream-200/60 font-light mt-1.5 max-w-xl">
            Database-driven local services fulfilled exclusively by certified Labour Cooperative members with 90% direct payout transparency.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-cream-200/40 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search electrician, plumber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-2xl text-xs text-white placeholder-cream-200/40 focus:outline-none focus:border-champagne-400/60 focus:ring-1 focus:ring-champagne-400/40 transition-all"
            />
          </div>

          <button
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all duration-200 ${
              emergencyOnly 
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_20px_rgba(224,141,164,0.3)]' 
                : 'bg-white/[0.04] text-cream-200/70 border-white/[0.1] hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>45-Min Emergency</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((srv) => {
          const Icon = srv.icon;
          return (
            <div 
              key={srv.id} 
              className="glass-card rounded-3xl p-6 space-y-5 hover:border-champagne-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A110D] to-[#0B152B] border border-white/[0.1] flex items-center justify-center text-champagne-300 shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-champagne-300" />
                  </div>
                  {srv.emergency && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-950/70 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      Emergency ⚡
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-300/60 block">
                    {srv.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mt-0.5">{srv.name}</h3>
                </div>

                <p className="text-xs text-cream-200/60 leading-relaxed font-light">{srv.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cream-200/40 uppercase tracking-wider block font-medium">Est. Base Rate</span>
                  <span className="font-display text-lg font-bold text-champagne-300">₹{srv.price}</span>
                </div>
                <Link
                  href={`/customer/dashboard?service=${encodeURIComponent(srv.name)}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-champagne-400 to-rose-400 hover:from-champagne-300 hover:to-rose-300 text-navy-950 font-bold text-xs shadow-md transition-all flex items-center gap-1"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
