"use client";

import Link from 'next/link';
import { useState } from 'react';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  Sparkles, 
  AlertTriangle, 
  LogOut, 
  LayoutDashboard,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, getDashboardUrl } = useAuth();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'WORKER':
        return '🛠️ Worker';
      case 'COOPERATIVE_ADMIN':
        return '🏢 Coop Admin';
      case 'FEDERATION_ADMIN':
        return '🏛️ Federation';
      case 'CUSTOMER':
      default:
        return '👤 Customer';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top SIH 2026 Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SIH 2026
          </span>
          <span className="hidden md:inline text-slate-300">
            Smart India Hackathon — Cooperative-Powered Local Workforce Marketplace
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-slate-400 text-[10px]">🌐 Lang:</span>
            <button
              type="button"
              onClick={() => alert('Switched to English UI (अंग्रेजी भाषा सक्रिय)')}
              className="text-emerald-400 hover:text-white font-bold text-[10px] px-1"
            >
              EN
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => alert('हिन्दी भाषा मोड सक्रिय किया गया (Hindi Mode Activated)')}
              className="text-amber-400 hover:text-white font-bold text-[10px] px-1"
            >
              हिन्दी
            </button>
          </div>

          {user && (
            <span className="text-emerald-400 font-semibold hidden sm:inline">
              Active: {user.name} ({getRoleLabel(user.role)})
            </span>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-1">
              SHRAMSETU <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">श्रमसेतु</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Cooperative Workforce Network
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <Link href="/services" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Services
          </Link>
          <Link href="/customer/dashboard" className="hover:text-emerald-600 transition-colors">
            Customer
          </Link>
          <Link href="/worker/earnings" className="hover:text-emerald-600 transition-colors text-emerald-700 font-semibold">
            Passbook
          </Link>
          <Link href="/admin/complaints" className="hover:text-emerald-600 transition-colors">
            Disputes
          </Link>
          <Link href="/admin/analytics" className="hover:text-emerald-600 transition-colors">
            Analytics
          </Link>
          <Link href="/federation/dashboard" className="hover:text-emerald-600 transition-colors">
            Federation
          </Link>
        </nav>

        {/* Auth CTA & Emergency */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/services?emergency=true"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Emergency
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <Link
                href={getDashboardUrl()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-medium text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                  {getRoleLabel(user.role)}
                </span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-colors"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all hover:shadow flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4" /> Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          {user && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Home</Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Services Catalog</Link>
          <Link href="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Customer Dashboard</Link>
          <Link href="/worker/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Worker Dashboard</Link>
          <Link href="/worker/earnings" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-700 font-bold">Worker Earnings & Passbook</Link>
          <Link href="/admin/complaints" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Grievance & Disputes</Link>
          <Link href="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Cooperative Analytics</Link>
          <Link href="/federation/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Federation Dashboard</Link>

          {!user && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-slate-700 font-semibold border rounded-lg">Sign In</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-white bg-emerald-600 font-semibold rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
