"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Mail, Lock, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'WORKER' | 'COOPERATIVE_ADMIN' | 'FEDERATION_ADMIN'>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'WORKER') router.push('/worker/dashboard');
    else if (role === 'COOPERATIVE_ADMIN') router.push('/admin/dashboard');
    else if (role === 'FEDERATION_ADMIN') router.push('/federation/dashboard');
    else router.push('/customer/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto my-12 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create ShramSetu Account</h1>
          <p className="text-xs text-slate-500">Join the cooperative-powered local service ecosystem</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2 rounded-xl transition-all ${role === 'CUSTOMER' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600'}`}
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('WORKER')}
            className={`py-2 rounded-xl transition-all ${role === 'WORKER' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600'}`}
          >
            🛠️ Worker
          </button>
          <button
            type="button"
            onClick={() => setRole('COOPERATIVE_ADMIN')}
            className={`py-2 rounded-xl transition-all ${role === 'COOPERATIVE_ADMIN' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600'}`}
          >
            🏢 Coop Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('FEDERATION_ADMIN')}
            className={`py-2 rounded-xl transition-all ${role === 'FEDERATION_ADMIN' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600'}`}
          >
            🏛️ Federation
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-colors"
          >
            Create Account & Continue
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
