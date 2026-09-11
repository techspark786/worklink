"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, getDashboardUrl } = useAuth();

  const [email, setEmail] = useState('customer@shramsetu.in');
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
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign In to ShramSetu</h1>
          <p className="text-xs text-slate-500">Access your role-based cooperative portal</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-700 block">⚡ Quick Demo Accounts (Password: password)</span>
            <div className="flex flex-wrap gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => handleSelectDemoUser('customer@shramsetu.in')}
                className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoUser('worker@shramsetu.in')}
                className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Worker
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoUser('admin@shramsetu.in')}
                className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Coop Admin
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoUser('federation@shramsetu.in')}
                className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Federation
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating with Database...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
