"use client";

import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">SHRAMSETU</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cooperative-Powered Local Workforce & Community Services Marketplace built for Smart India Hackathon 2026. Empowering workers and ensuring consumer trust.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Platform Roles</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/customer/dashboard" className="hover:text-emerald-400">Customer Portal</Link></li>
            <li><Link href="/worker/dashboard" className="hover:text-emerald-400">Worker Portal</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-emerald-400">Labour Cooperative Admin</Link></li>
            <li><Link href="/federation/dashboard" className="hover:text-emerald-400">State Federation Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Core Differentiators</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-300">Cooperative Ownership</span></li>
            <li><span className="text-slate-300">FairMatch Algorithm</span></li>
            <li><span className="text-slate-300">Worker Health & Welfare Shield</span></li>
            <li><span className="text-slate-300">AI Demand Forecasting</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Hackathon Info</h4>
          <p className="text-xs text-slate-400 mb-2">
            Smart India Hackathon 2026<br />
            Problem Statement: Labour Cooperative Service Marketplace
          </p>
          <div className="p-3 rounded bg-slate-800 border border-slate-700 text-[11px] text-emerald-400">
            ✓ Production Prototype Ready
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 ShramSetu Platform. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Labour Cooperatives
        </p>
      </div>
    </footer>
  );
}
