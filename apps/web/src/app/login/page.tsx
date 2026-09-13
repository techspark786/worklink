"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, RefreshCw, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, getDashboardUrl } = useAuth();

  const [email, setEmail] = useState('customer@worklink.in');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // Save token and user into AuthContext and localStorage
      login(data.token, data.user);

      // Navigate to the role-specific dashboard
      const dashboardUrl = getDashboardUrl(data.user.role);
      router.push(dashboardUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setErrorMsg('');
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-champagne-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-espresso-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Badging */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-500/10 border border-champagne-400/25 text-champagne-300 text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-champagne-400 animate-pulse" />
            <span>Code Craft 3.0 • Secure Authentication</span>
          </div>
        </div>

        {/* Luxury Glass Card */}
        <div className="relative rounded-3xl p-8 sm:p-9 bg-navy-900/80 backdrop-blur-2xl border border-champagne-500/20 shadow-2xl shadow-navy-950/90">
          {/* Subtle top edge specular highlight */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-champagne-400 to-rose-500 text-navy-950 flex items-center justify-center mx-auto shadow-glow-champagne">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display gradient-text-hero">
                Sign In to WorkLink
              </h1>
              <p className="text-xs text-cream-200/60 mt-1 font-sans">
                Access your role-based cooperative portal
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cream-200/80 mb-1.5 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cream-300/40 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-navy-950/60 border border-navy-700/60 hover:border-navy-600 focus:border-champagne-400/80 rounded-xl text-xs sm:text-sm text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:ring-2 focus:ring-champagne-400/20 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream-200/80 mb-1.5 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cream-300/40 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-navy-950/60 border border-navy-700/60 hover:border-navy-600 focus:border-champagne-400/80 rounded-xl text-xs sm:text-sm text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:ring-2 focus:ring-champagne-400/20 transition-all font-sans"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Assistant */}
            <div className="p-3.5 rounded-2xl bg-navy-950/50 border border-champagne-500/15 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-champagne-300 flex items-center gap-1.5 font-display tracking-wide">
                  <span>⚡</span> Quick Demo Roles
                </span>
                <span className="text-cream-300/40 font-mono text-[10px]">pass: password</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('customer@worklink.in')}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    email === 'customer@worklink.in'
                      ? 'bg-rose-500/20 border-rose-400/60 text-rose-200 font-bold shadow-glow-rose'
                      : 'bg-navy-900/60 border-navy-700/60 text-cream-200/80 hover:border-champagne-400/40 hover:text-cream-100'
                  }`}
                >
                  <span>👤 Customer</span>
                  {email === 'customer@worklink.in' && <CheckCircle2 className="w-3 h-3 text-rose-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('worker@worklink.in')}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    email === 'worker@worklink.in'
                      ? 'bg-rose-500/20 border-rose-400/60 text-rose-200 font-bold shadow-glow-rose'
                      : 'bg-navy-900/60 border-navy-700/60 text-cream-200/80 hover:border-champagne-400/40 hover:text-cream-100'
                  }`}
                >
                  <span>🛠️ Worker</span>
                  {email === 'worker@worklink.in' && <CheckCircle2 className="w-3 h-3 text-rose-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('admin@worklink.in')}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    email === 'admin@worklink.in'
                      ? 'bg-champagne-500/20 border-champagne-400/60 text-champagne-200 font-bold shadow-glow-champagne'
                      : 'bg-navy-900/60 border-navy-700/60 text-cream-200/80 hover:border-champagne-400/40 hover:text-cream-100'
                  }`}
                >
                  <span>🏢 Coop Admin</span>
                  {email === 'admin@worklink.in' && <CheckCircle2 className="w-3 h-3 text-champagne-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('federation@worklink.in')}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    email === 'federation@worklink.in'
                      ? 'bg-champagne-500/20 border-champagne-400/60 text-champagne-200 font-bold shadow-glow-champagne'
                      : 'bg-navy-900/60 border-navy-700/60 text-cream-200/80 hover:border-champagne-400/40 hover:text-cream-100'
                  }`}
                >
                  <span>🏛️ Federation</span>
                  {email === 'federation@worklink.in' && <CheckCircle2 className="w-3 h-3 text-champagne-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-rose-400 to-champagne-400 hover:from-rose-400 hover:to-champagne-300 disabled:opacity-50 text-navy-950 font-black text-xs sm:text-sm rounded-xl shadow-glow-rose hover:shadow-glow-champagne transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-display"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-cream-200/60 font-sans">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-champagne-300 hover:text-champagne-200 underline underline-offset-4 decoration-champagne-400/40 transition-colors">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
