"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('customer@shramsetu.in');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email.includes('worker')) {
        router.push('/worker/dashboard');
      } else if (email.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (email.includes('federation')) {
        router.push('/federation/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    }, 600);
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
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-700 block">⚡ Quick Demo Accounts (Password: password)</span>
            <div className="flex flex-wrap gap-1 text-[11px]">
              <button type="button" onClick={() => setEmail('customer@shramsetu.in')} className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50">Customer</button>
              <button type="button" onClick={() => setEmail('worker@shramsetu.in')} className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50">Worker</button>
              <button type="button" onClick={() => setEmail('admin@shramsetu.in')} className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50">Coop Admin</button>
              <button type="button" onClick={() => setEmail('federation@shramsetu.in')} className="px-2 py-0.5 bg-white border rounded text-emerald-700 hover:bg-emerald-50">Federation</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
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
