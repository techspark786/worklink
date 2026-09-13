"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  Sparkles, 
  AlertTriangle, 
  LogOut, 
  LayoutDashboard,
  ArrowUpRight,
  Globe,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, getDashboardUrl } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? isLight 
          ? 'bg-[#F8F4EE]/95 backdrop-blur-2xl border-b border-[#3D271E]/10 shadow-[0_12px_30px_rgba(61,39,30,0.08)]' 
          : 'bg-[#140D0A]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_35px_rgba(0,0,0,0.6)]' 
        : isLight 
          ? 'bg-[#F8F4EE]/85 backdrop-blur-xl border-b border-[#3D271E]/08'
          : 'bg-[#140D0A]/80 backdrop-blur-xl border-b border-white/[0.05]'
    }`}>
      {/* Top Code Craft 3.0 Luxury Announcement Bar */}
      <div className={`text-xs py-1.5 px-4 flex items-center justify-between transition-colors ${
        isLight 
          ? 'bg-gradient-to-r from-[#F0EAE1] via-[#EFE8DE] to-[#F0EAE1] text-[#1A110D] border-b border-[#3D271E]/10' 
          : 'bg-gradient-to-r from-[#140D0A] via-[#20140F] to-[#140D0A] text-cream-100 border-b border-champagne-500/10'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className={`font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-sm ${
            isLight 
              ? 'bg-[#E08DA4]/20 text-[#8C344D] border border-[#E08DA4]/40' 
              : 'shimmer-badge text-champagne-300 border border-champagne-400/30'
          }`}>
            Code Craft 3.0
          </span>
          <span className={`hidden md:inline font-light text-[11px] ${
            isLight ? 'text-[#3D271E]/80' : 'text-cream-200/70'
          }`}>
            Cooperative-Powered Local Workforce & Community Services Marketplace
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold transition-all shadow-sm cursor-pointer ${
              isLight
                ? 'bg-[#FFFFFF] border-[#3D271E]/15 text-[#1A110D] hover:bg-[#F0EAE1]'
                : 'bg-white/[0.06] border-champagne-400/30 text-champagne-300 hover:bg-white/[0.1]'
            }`}
            title={isLight ? 'Switch to Burnt Coffee Dark Mode' : 'Switch to Light Cream Mode'}
          >
            {isLight ? (
              <>
                <Coffee className="w-3.5 h-3.5 text-[#5C3A2B]" />
                <span className="hidden sm:inline">Burnt Coffee</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-champagne-400" />
                <span className="hidden sm:inline">Light Cream</span>
              </>
            )}
          </button>

          {/* Multilingual Selector */}
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
            isLight ? 'bg-[#FFFFFF] border-[#3D271E]/12' : 'bg-white/[0.04] border-white/[0.08]'
          }`}>
            <Globe className="w-3 h-3 text-champagne-500" />
            <button
              type="button"
              onClick={() => alert('Switched to English UI (अंग्रेजी भाषा सक्रिय)')}
              className={`font-bold text-[10px] px-1 transition-colors ${
                isLight ? 'text-[#1A110D] hover:text-[#5C3A2B]' : 'text-champagne-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className={isLight ? 'text-black/20' : 'text-white/20'}>|</span>
            <button
              type="button"
              onClick={() => alert('हिन्दी भाषा मोड सक्रिय किया गया (Hindi Mode Activated)')}
              className={`font-bold text-[10px] px-1 transition-colors ${
                isLight ? 'text-[#C45A77] hover:text-[#8C344D]' : 'text-rose-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {user && (
            <span className={`font-medium hidden sm:inline text-xs ${
              isLight ? 'text-[#3D271E]' : 'text-champagne-300'
            }`}>
              Active: <strong>{user.name}</strong> ({getRoleLabel(user.role)})
            </span>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 to-champagne-400/30 rounded-2xl blur-sm group-hover:blur transition duration-300" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#281B15] to-[#140D0A] border border-champagne-400/30 flex items-center justify-center text-champagne-300 shadow-lg group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-champagne-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-black text-xl tracking-tight flex items-center gap-1.5 ${
              isLight ? 'text-[#1A110D]' : 'text-white'
            }`}>
              WorkLink
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            </span>
            <span className={`text-[10px] font-medium tracking-wider uppercase ${
              isLight ? 'text-[#5C3A2B]' : 'text-champagne-200/50'
            }`}>
              Cooperative Network
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className={`hidden md:flex items-center gap-6 text-xs font-medium ${
          isLight ? 'text-[#3D271E]/80' : 'text-cream-200/80'
        }`}>
          <Link href="/" className="hover:text-champagne-500 transition-colors py-1 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/services" className="hover:text-champagne-500 transition-colors py-1 flex items-center gap-1 relative group">
            <Sparkles className="w-3.5 h-3.5 text-champagne-500" /> Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/customer/dashboard" className="hover:text-champagne-500 transition-colors py-1 relative group">
            Customer
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/worker/earnings" className="text-champagne-500 hover:text-rose-400 transition-colors py-1 relative group font-semibold">
            Passbook
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/admin/complaints" className="hover:text-champagne-500 transition-colors py-1 relative group">
            Disputes
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/admin/analytics" className="hover:text-champagne-500 transition-colors py-1 relative group">
            Analytics
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/federation/dashboard" className="hover:text-champagne-500 transition-colors py-1 relative group">
            Federation
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-champagne-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Auth CTA & Emergency */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/services?emergency=true"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition-all shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency</span>
          </Link>

          {/* Theme Toggle matching Ensure Education screenshot (Moon / Sun) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 px-2.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isLight 
                ? 'bg-[#FFF5EA] border-[#F3D2A2] text-[#B45309] hover:bg-[#FCE8D2] shadow-sm' 
                : 'bg-white/[0.06] border-champagne-400/30 text-champagne-300 hover:bg-white/[0.1]'
            }`}
            aria-label="Toggle theme"
            title={isLight ? 'Switch to Dark Coffee theme' : 'Switch to Warm Cream Grid theme'}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#B45309]" />
                <span className="text-[11px] font-bold">Theme</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-champagne-300" />
                <span className="text-[11px] font-bold">Theme</span>
              </>
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#3D271E]/15">
              <Link
                href={getDashboardUrl()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  isLight 
                    ? 'bg-[#FFFFFF] border-[#3D271E]/15 text-[#1A110D] hover:border-champagne-500' 
                    : 'bg-white/[0.05] border-white/[0.1] text-white hover:border-champagne-400/40'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-champagne-400" />
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {getRoleLabel(user.role)}
                </span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-rose-500/15 text-rose-400 border border-transparent hover:border-rose-500/30 text-xs transition-all"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isLight ? 'text-[#3D271E] hover:text-[#1A110D]' : 'text-cream-200/80 hover:text-white'
                }`}
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="relative group overflow-hidden px-4 py-2 rounded-full text-xs font-bold text-navy-950 bg-gradient-to-r from-champagne-300 via-rose-300 to-champagne-400 shadow-glow-rose hover:shadow-glow-champagne transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 font-display"
              >
                <UserIcon className="w-3.5 h-3.5 text-navy-950" />
                <span>Get Started</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-navy-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-xl border transition-colors ${
            isLight 
              ? 'text-[#1A110D] border-[#3D271E]/15 hover:bg-[#EFE8DE]' 
              : 'text-cream-200/80 border-white/[0.08] hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t p-5 space-y-3.5 backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200 ${
          isLight 
            ? 'border-[#3D271E]/10 bg-[#F8F4EE]/98 text-[#1A110D]' 
            : 'border-white/[0.08] bg-[#140D0A]/95 text-cream-100'
        }`}>
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-champagne-500/20 bg-white/[0.05]">
            <span className="text-xs font-bold font-display">Theme Palette</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs shadow-sm font-display"
            >
              {isLight ? (
                <>
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Burnt Coffee Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Cream</span>
                </>
              )}
            </button>
          </div>

          {user && (
            <div className="p-3.5 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs opacity-70">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-champagne-400 bg-champagne-500/10 px-2 py-0.5 rounded-full border border-champagne-500/20">
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

          <div className="space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Home</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Services Catalog</Link>
            <Link href="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Customer Dashboard</Link>
            <Link href="/worker/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Worker Dashboard</Link>
            <Link href="/worker/earnings" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg text-champagne-400 hover:bg-white/[0.05] font-semibold text-sm">Worker Earnings & Passbook</Link>
            <Link href="/admin/complaints" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Grievance & Disputes</Link>
            <Link href="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Cooperative Analytics</Link>
            <Link href="/federation/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05] font-medium text-sm">Federation Dashboard</Link>
          </div>

          {!user && (
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 font-semibold border border-white/[0.1] rounded-xl text-xs hover:bg-white/[0.05]">Sign In</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-navy-950 bg-gradient-to-r from-champagne-300 via-rose-300 to-champagne-400 font-bold rounded-xl text-xs shadow-lg font-display">Register Account</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
