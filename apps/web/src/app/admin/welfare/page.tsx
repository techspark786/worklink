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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Coop Admin Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Cooperative Welfare Fund Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Section 70 Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lucknow Labour Cooperative Society Ltd. • Member-governed 7% social security pool for health, disability, and emergency aid.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setClaimModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <PlusCircle className="w-4 h-4" /> Disburse Member Claim
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Pool Balance Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl space-y-2 border border-slate-700">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pooled Reserve</span>
            <HeartHandshake className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 font-mono">
            ₹{balance.toLocaleString()}
          </span>
          <p className="text-[10px] text-slate-300">
            Backed by 7% mandatory cess on all completed bookings
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cashless Health Pool</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">₹50,000</span>
          <p className="text-[10px] text-slate-500">Per worker family annual limit</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Accident Cover</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">₹2,00,000</span>
          <p className="text-[10px] text-slate-500">Occupational hazard coverage</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Tool Loan Reserve</span>
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">0% Interest</span>
          <p className="text-[10px] text-slate-500">Zero markup equipment finance</p>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900">Auditable Welfare Transaction Ledger</h2>
            <p className="text-xs text-slate-500">
              Immutable log of every deposit from customer bookings and member medical disbursements.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {transactions.length} Total Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Order / Claim Ref</th>
                <th className="py-3 px-4">Worker Member</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(tx.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {tx.type === 'DEPOSIT' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                        + DEPOSIT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                        - DISBURSE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {tx.bookingId}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {tx.workerName}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={tx.description}>
                    {tx.description}
                  </td>
                  <td className={`py-3 px-4 text-right font-black text-sm ${
                    tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.type === 'DEPOSIT' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Managing Committee Approval</span>
                <h3 className="text-xl font-black text-slate-900">Disburse Welfare Claim</h3>
              </div>
              <button
                onClick={() => setClaimModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Beneficiary Member Worker</label>
                <select
                  value={claimWorkerName}
                  onChange={(e) => setClaimWorkerName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Ramesh Kumar">Ramesh Kumar (Electrician)</option>
                  <option value="Suresh Chandra">Suresh Chandra (Plumber)</option>
                  <option value="Rajesh Verma">Rajesh Verma (Carpenter)</option>
                  <option value="Sunita Devi">Sunita Devi (Sanitation)</option>
                  <option value="Amit Kumar">Amit Kumar (AC Technician)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Claim Type</label>
                <select
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="MEDICAL_EMERGENCY">Medical Emergency Outpatient Reimbursement</option>
                  <option value="ACCIDENT_BENEFIT">On-Site Accident Injury Benefit</option>
                  <option value="TOOL_REPAIR_GRANT">Safety Equipment & Tool Grant</option>
                  <option value="EDUCATION_AID">Member Child Education Assistance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Claim Amount (₹)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Audit Notes / Diagnosis</label>
                <textarea
                  rows={2}
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleDisburseClaim}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow"
            >
              Approve & Disburse Funds
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
