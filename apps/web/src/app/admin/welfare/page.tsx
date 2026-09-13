"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ShieldCheck, 
  ArrowLeft, 
  PlusCircle, 
  Download, 
  Receipt, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';

interface WelfareTx {
  id: string;
  bookingId: string;
  workerId: string;
  workerName: string;
  amount: number;
  type: 'DEPOSIT' | 'DISBURSEMENT';
  category: string;
  description: string;
  balanceAfter: number;
  timestamp: string;
}

export default function AdminWelfareLedger() {
  const [balance, setBalance] = useState(125060);
  const [transactions, setTransactions] = useState<WelfareTx[]>([
    {
      id: 'tx-101',
      bookingId: 'b-demo-1',
      workerId: 'w1',
      workerName: 'Ramesh Kumar',
      amount: 28,
      type: 'DEPOSIT',
      category: 'JOB_CESS',
      description: '7% Cooperative Welfare Contribution from Ceiling Fan Repair (Order #b-demo-1)',
      balanceAfter: 125028,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'tx-102',
      bookingId: 'b-demo-2',
      workerId: 'w2',
      workerName: 'Suresh Chandra',
      amount: 32,
      type: 'DEPOSIT',
      category: 'JOB_CESS',
      description: '7% Cooperative Welfare Contribution from Plumbing Work (Order #b-demo-2)',
      balanceAfter: 125060,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'tx-103',
      bookingId: 'claim-55',
      workerId: 'w5',
      workerName: 'Sunita Devi',
      amount: 4500,
      type: 'DISBURSEMENT',
      category: 'MEDICAL_REIMBURSEMENT',
      description: 'Emergency outpatient clinic & medicine reimbursement approved by Managing Committee',
      balanceAfter: 120560,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'tx-104',
      bookingId: 'claim-42',
      workerId: 'w3',
      workerName: 'Rajesh Verma',
      amount: 2500,
      type: 'DISBURSEMENT',
      category: 'TOOL_REPAIR_GRANT',
      description: 'Power drill & circular saw motor repair grant under Member Tool Safety scheme',
      balanceAfter: 125060,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    }
  ]);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimWorkerName, setClaimWorkerName] = useState('Ramesh Kumar');
  const [claimCategory, setClaimCategory] = useState('MEDICAL_EMERGENCY');
  const [claimAmount, setClaimAmount] = useState('3000');
  const [claimDescription, setClaimDescription] = useState('Emergency clinical checkup and wrist strain treatment medication');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch live ledger from backend if available
  useEffect(() => {
    async function fetchLedger() {
      try {
        const res = await fetch('http://localhost:5000/api/cooperatives/coop-1/welfare');
        if (res.ok) {
          const data = await res.json();
          if (data.welfareFundBalance) setBalance(data.welfareFundBalance);
          if (data.transactions && data.transactions.length > 0) {
            setTransactions(data.transactions);
          }
        }
      } catch (e) {
        // use default mock
      }
    }
    fetchLedger();
  }, []);

  const handleDisburseClaim = async () => {
    const amt = Number(claimAmount) || 2000;
    const newBal = Math.max(0, balance - amt);
    setBalance(newBal);

    const newTx: WelfareTx = {
      id: `tx-${Date.now()}`,
      bookingId: `claim-${Math.floor(100 + Math.random() * 900)}`,
      workerId: 'w1',
      workerName: claimWorkerName,
      amount: amt,
      type: 'DISBURSEMENT',
      category: claimCategory,
      description: claimDescription,
      balanceAfter: newBal,
      timestamp: new Date().toISOString(),
    };

    setTransactions([newTx, ...transactions]);
    setClaimModalOpen(false);
    setSuccessMsg(`₹${amt} claim successfully approved and disbursed to ${claimWorkerName}.`);

    try {
      await fetch('http://localhost:5000/api/cooperatives/coop-1/welfare/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: 'w1',
          workerName: claimWorkerName,
          amount: amt,
          reason: claimDescription,
        }),
      });
    } catch (e) {
      // offline
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-navy-900/80 backdrop-blur-2xl border border-champagne-500/20 shadow-2xl shadow-navy-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="relative z-10">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-champagne-300 hover:text-champagne-200 mb-2 transition-colors font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Coop Admin Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero">
              Cooperative Welfare Fund Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 text-xs font-bold font-mono">
              Section 70 Audited
            </span>
          </div>
          <p className="text-xs text-cream-200/60 mt-1 font-sans">
            Lucknow Labour Cooperative Society Ltd. • Member-governed 7% social security pool for health, disability, and emergency aid.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setClaimModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-champagne-400 text-navy-950 font-black text-xs flex items-center gap-2 shadow-glow-rose font-display cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-navy-950" /> 
            <span>Disburse Member Claim</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-champagne-400/50 text-champagne-300 text-xs font-bold flex items-center justify-between animate-fadeIn font-sans shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-champagne-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-champagne-400 hover:text-champagne-200">✕</button>
        </div>
      )}

      {/* Pool Balance Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative bg-gradient-to-br from-navy-950 to-espresso-950 text-cream-100 p-6 rounded-3xl shadow-2xl space-y-2 border border-champagne-500/20 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between text-champagne-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Total Pooled Reserve</span>
            <HeartHandshake className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-3xl sm:text-4xl font-black gradient-text-gold font-display font-mono block">
            ₹{balance.toLocaleString()}
          </span>
          <p className="text-[10px] text-cream-300/50 font-sans">
            Backed by 7% mandatory cess on all completed bookings
          </p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between text-champagne-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Cashless Health Pool</span>
            <ShieldCheck className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl font-black text-cream-100 font-display block">₹50,000</span>
          <p className="text-[10px] text-cream-300/50 font-sans">Per worker family annual limit</p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-rose-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Accident Cover</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-black gradient-text-rose font-display block">₹2,00,000</span>
          <p className="text-[10px] text-rose-300/70 font-sans">Occupational hazard coverage</p>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-6 rounded-3xl border border-champagne-500/20 shadow-xl space-y-2 overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center justify-between text-champagne-300">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Tool Loan Reserve</span>
            <Receipt className="w-4 h-4 text-champagne-400" />
          </div>
          <span className="text-3xl font-black text-cream-100 font-display block">0% Interest</span>
          <p className="text-[10px] text-cream-300/50 font-sans">Zero markup equipment finance</p>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-cream-100 font-display">Auditable Welfare Transaction Ledger</h2>
            <p className="text-xs text-cream-200/60 font-sans mt-0.5">
              Immutable log of every deposit from customer bookings and member medical disbursements.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-champagne-300">
            {transactions.length} Total Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-navy-800 text-cream-300/40 font-bold uppercase tracking-wider text-[10px] font-display">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Order / Claim Ref</th>
                <th className="py-3.5 px-4">Worker Member</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/80 text-cream-200/80 font-sans">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-navy-950/60 transition-colors">
                  <td className="py-3.5 px-4 text-cream-300/50 font-mono text-[11px]">
                    {new Date(tx.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.type === 'DEPOSIT' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 font-bold text-[10px] font-mono">
                        + DEPOSIT
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px] font-mono">
                        - DISBURSE
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-cream-100">
                    {tx.bookingId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cream-100 font-display">
                    {tx.workerName}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-cream-200/70" title={tx.description}>
                    {tx.description}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-black text-sm font-mono ${
                    tx.type === 'DEPOSIT' ? 'text-champagne-300' : 'text-rose-300'
                  }`}>
                    {tx.type === 'DEPOSIT' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold gradient-text-gold">
                    ₹{tx.balanceAfter.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISBURSE CLAIM MODAL */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-navy-900/95 border border-champagne-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-champagne-300 uppercase tracking-wider font-display">
                  Managing Committee Approval
                </span>
                <h3 className="text-xl font-black text-cream-100 font-display">Disburse Welfare Claim</h3>
              </div>
              <button
                onClick={() => setClaimModalOpen(false)}
                className="p-1.5 text-cream-300/60 hover:text-cream-100 rounded-lg hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-bold text-cream-200/80 block mb-1.5">Beneficiary Member Worker</label>
                <select
                  value={claimWorkerName}
                  onChange={(e) => setClaimWorkerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl font-bold text-cream-100 focus:border-champagne-400 outline-none"
                >
                  <option value="Ramesh Kumar" className="bg-navy-900">Ramesh Kumar (Electrician)</option>
                  <option value="Suresh Chandra" className="bg-navy-900">Suresh Chandra (Plumber)</option>
                  <option value="Rajesh Verma" className="bg-navy-900">Rajesh Verma (Carpenter)</option>
                  <option value="Sunita Devi" className="bg-navy-900">Sunita Devi (Sanitation)</option>
                  <option value="Amit Kumar" className="bg-navy-900">Amit Kumar (AC Technician)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-cream-200/80 block mb-1.5">Claim Type</label>
                <select
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl font-bold text-cream-100 focus:border-champagne-400 outline-none"
                >
                  <option value="MEDICAL_EMERGENCY" className="bg-navy-900">Medical Emergency Outpatient Reimbursement</option>
                  <option value="ACCIDENT_BENEFIT" className="bg-navy-900">On-Site Accident Injury Benefit</option>
                  <option value="TOOL_REPAIR_GRANT" className="bg-navy-900">Safety Equipment & Tool Grant</option>
                  <option value="EDUCATION_AID" className="bg-navy-900">Member Child Education Assistance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-cream-200/80 block mb-1.5">Claim Amount (₹)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl font-bold text-cream-100 focus:border-champagne-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-cream-200/80 block mb-1.5">Audit Notes / Diagnosis</label>
                <textarea
                  rows={2}
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl font-medium text-cream-100 focus:border-champagne-400 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleDisburseClaim}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose font-display cursor-pointer"
            >
              Approve & Disburse Funds
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
