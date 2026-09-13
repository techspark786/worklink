"use client";

import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-amber-50/70 via-[#FAF7F2]/90 to-[#F5ECE0] dark:from-[#140D0A] dark:via-[#1A110D] dark:to-[#0E0806] text-[#5C3A2B] dark:text-cream-200/70 border-t border-amber-300/40 dark:border-champagne-500/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-24 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute left-1/4 top-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 top-0 -translate-y-1/2 w-96 h-96 bg-amber-400/5 dark:bg-champagne-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 dark:from-[#281B15] dark:to-[#140D0A] border border-amber-300/50 dark:border-champagne-400/30 flex items-center justify-center text-white dark:text-champagne-300 shadow-md">
              <ShieldCheck className="w-5 h-5 text-white dark:text-champagne-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-tight text-[#1A110D] dark:text-white flex items-center gap-1.5">
                WorkLink
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-amber-800/70 dark:text-champagne-200/50 uppercase tracking-wider font-semibold">
                Cooperative Platform
              </span>
            </div>
          </div>
          <p className="text-xs text-[#5C3A2B] dark:text-cream-200/70 leading-relaxed font-light font-sans">
            Cooperative-Powered Local Workforce & Community Services Marketplace built for Code Craft 3.0. Democratic ownership, fair wages, and verified customer trust.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#1A110D] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-champagne-400" /> Platform Portals
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li><Link href="/customer/dashboard" className="hover:text-amber-700 dark:hover:text-champagne-300 transition-colors">Customer Portal & Dispatch</Link></li>
            <li><Link href="/worker/dashboard" className="hover:text-amber-700 dark:hover:text-champagne-300 transition-colors">Worker Portal & Live Gigs</Link></li>
            <li><Link href="/worker/earnings" className="text-amber-800 dark:text-champagne-300/90 hover:text-amber-900 dark:hover:text-white transition-colors font-medium">Worker Passbook & Earnings</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-amber-700 dark:hover:text-champagne-300 transition-colors">Labour Cooperative Admin</Link></li>
            <li><Link href="/federation/dashboard" className="hover:text-amber-700 dark:hover:text-champagne-300 transition-colors">State Federation Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#1A110D] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400" /> Core Differentiators
          </h4>
          <ul className="space-y-2.5 text-xs text-[#5C3A2B] dark:text-cream-200/70 font-sans">
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-600/60 dark:bg-champagne-400/50" /> Cooperative Member Ownership (100% Base Wage)</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-600/60 dark:bg-champagne-400/50" /> FairMatch™ 5-Factor Ranking Algorithm</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-600/60 dark:bg-champagne-400/50" /> Section 70 Pooled Health & Welfare Fund (7%)</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-600/60 dark:bg-champagne-400/50" /> Dual-OTP Handshake Doorstep Protocol</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#1A110D] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-champagne-400" /> Project Dossier
          </h4>
          <p className="text-xs text-[#5C3A2B] dark:text-cream-200/70 mb-3 leading-relaxed font-sans">
            <strong className="text-[#1A110D] dark:text-white">Code Craft 3.0</strong><br />
            Problem Statement: Labour Cooperative Services Marketplace
          </p>
          <div className="p-3 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-amber-300/40 dark:border-champagne-400/20 text-[11px] text-amber-800 dark:text-champagne-300 flex items-center gap-2 shadow-inner font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">Production Prototype Ready</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto mt-12 pt-6 border-t border-amber-200/40 dark:border-white/[0.06] flex flex-col md:flex-row items-center justify-between text-xs text-[#5C3A2B]/70 dark:text-cream-200/50 gap-4 font-sans">
        <p>© 2026 WorkLink Platform. Built for Code Craft 3.0.</p>
        <p className="flex items-center gap-1.5 text-[#5C3A2B] dark:text-cream-200/70">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Labour Cooperatives
        </p>
      </div>
    </footer>
  );
}
