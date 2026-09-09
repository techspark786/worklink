'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Scale, 
  Filter, 
  ChevronRight, 
  ArrowLeft,
  UserCheck,
  FileText,
  DollarSign
} from 'lucide-react';

interface ComplaintItem {
  complaintId: string;
  bookingId: string;
  customerName: string;
  workerName: string;
  cooperativeName: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  arbitrationNotes: string;
  resolutionAction: string;
  refundAmount: number;
  createdAt: string;
}

const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    complaintId: 'CMP-2026-081',
    bookingId: 'BK-LKO-2026-4401',
    customerName: 'Priya Sharma',
    workerName: 'Ramesh Kumar',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    category: 'LATE_ARRIVAL',
    severity: 'MEDIUM',
    description: 'Worker arrived 45 minutes past the scheduled 10:00 AM slot due to heavy traffic on Kanpur Road.',
    status: 'UNDER_REVIEW',
    arbitrationNotes: 'Worker provided GPS route proof showing police barricade detour. Customer offered priority slot.',
    resolutionAction: 'Apology notice issued and 10% cooperative transit voucher credited to customer.',
    refundAmount: 50,
    createdAt: 'Yesterday, 11:30 AM',
  },
  {
    complaintId: 'CMP-2026-082',
    bookingId: 'BK-LKO-2026-4408',
    customerName: 'Amit Verma',
    workerName: 'Suresh Patel',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    category: 'INCORRECT_BILLING',
    severity: 'HIGH',
    description: 'Dispute regarding ₹350 extra charged for CPVC pipe brass elbow without prior customer pre-approval.',
    status: 'PENDING',
    arbitrationNotes: 'Awaiting submission of hardware store bill by technician.',
    resolutionAction: '',
    refundAmount: 0,
    createdAt: 'Today, 09:15 AM',
  },
  {
    complaintId: 'CMP-2026-079',
    bookingId: 'BK-LKO-2026-4392',
    customerName: 'Sunita Gupta',
    workerName: 'Rajesh Verma',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    category: 'PROPERTY_DAMAGE',
    severity: 'LOW',
    description: 'Minor superficial plaster scratch on wall next to switchboard during heavy drill installation.',
    status: 'RESOLVED',
    arbitrationNotes: 'Cooperative representative inspected site. Technician assisted in touch-up putty application.',
    resolutionAction: '₹200 touch-up goodwill allowance disbursed from Cooperative Welfare Contingency Pool.',
    refundAmount: 200,
    createdAt: '3 days ago',
  },
];

export default function CooperativeComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [activeModalComplaint, setActiveModalComplaint] = useState<ComplaintItem | null>(null);
  const [hearingNotes, setHearingNotes] = useState('');
  const [chosenAction, setChosenAction] = useState('GOODWILL_DISBURSEMENT');
  const [disbursementAmount, setDisbursementAmount] = useState('250');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredComplaints = complaints.filter((c) => {
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
    if (selectedSeverity !== 'ALL' && c.severity !== selectedSeverity) return false;
    return true;
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalComplaint) return;

    let actionSummary = '';
    let refundVal = 0;
    if (chosenAction === 'GOODWILL_DISBURSEMENT') {
      actionSummary = `₹${disbursementAmount} goodwill relief released from Section 70 Contingency Pool to customer. Technician completed safety counseling.`;
      refundVal = Number(disbursementAmount);
    } else if (chosenAction === 'TECH_WARNING') {
      actionSummary = 'Official cooperative peer warning entered in member records. 15-day mandatory punctuality monitoring.';
    } else {
      actionSummary = 'Grievance examined by 3-member committee and dismissed as external road closure factor. Zero fault recorded.';
    }

    setComplaints((prev) =>
      prev.map((item) =>
        item.complaintId === activeModalComplaint.complaintId
          ? {
              ...item,
              status: chosenAction === 'DISMISS' ? 'REJECTED' : 'RESOLVED',
              arbitrationNotes: hearingNotes || item.arbitrationNotes,
              resolutionAction: actionSummary,
              refundAmount: refundVal,
            }
          : item
      )
    );

    setSuccessMsg(`Dispute #${activeModalComplaint.complaintId} successfully adjudicated under Cooperative Section 70 Bylaws.`);
    setActiveModalComplaint(null);
    setHearingNotes('');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'UNDER_REVIEW':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'REJECTED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cooperative Admin
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Scale className="w-8 h-8 text-emerald-400" />
              Cooperative Grievance & Peer Arbitration
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Section 70 Audited Dispute Settlement Committee — Transparent mediation without algorithmic account bans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/welfare"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" /> Welfare Pool Ledger
            </Link>
            <Link
              href="/admin/workers"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-blue-400" /> Member Directory
            </Link>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300 text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Cooperative Differentiator Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Democratic Worker Protection Guarantee</div>
              <div className="text-xs text-slate-400">
                Unlike corporate platforms that deactivate worker profiles automatically on customer complaints, SHRAMSETU guarantees a 48-hour peer hearing by the elected 3-member Cooperative Grievance Panel.
              </div>
            </div>
          </div>
          <div className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-slate-300">
            Active Docket: <strong className="text-emerald-400">{filteredComplaints.length} cases</strong>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4" /> Filter By:
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected / Dismissed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Complaints Table / List */}
        <div className="space-y-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.complaintId}
              className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-emerald-400">{c.complaintId}</span>
                  <span className="text-xs text-slate-500">Ref: {c.bookingId}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${getSeverityBadge(c.severity)}`}>
                    {c.severity}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {c.createdAt}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/50">
                <div>
                  <span className="text-slate-400">Complainant (Customer): </span>
                  <strong className="text-slate-200">{c.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Respondent (Member): </span>
                  <strong className="text-slate-200">{c.workerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Category: </span>
                  <strong className="text-slate-200">{c.category.replace('_', ' ')}</strong>
                </div>
              </div>

              <div className="text-sm text-slate-300">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Customer Statement:</span>
                "{c.description}"
              </div>

              {c.arbitrationNotes && (
                <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" /> Peer Arbitration Findings:
                  </div>
                  <div className="text-purple-200">{c.arbitrationNotes}</div>
                </div>
              )}

              {c.resolutionAction && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolution Order:
                  </div>
                  <div className="text-emerald-200">{c.resolutionAction}</div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                {c.status === 'PENDING' || c.status === 'UNDER_REVIEW' ? (
                  <button
                    onClick={() => {
                      setActiveModalComplaint(c);
                      setHearingNotes(c.arbitrationNotes || '');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950/30"
                  >
                    <Scale className="w-4 h-4" /> Concurrently Convene Panel & Adjudicate
                  </button>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Settled under Section 70 Bylaws
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Arbitration Modal */}
        {activeModalComplaint && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-up">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-emerald-400 font-mono font-semibold">
                    {activeModalComplaint.complaintId} • Arbitration Docket
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Peer Grievance Mediation Hearing
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalComplaint(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Customer Claim:</span>{' '}
                  <span className="text-slate-200">"{activeModalComplaint.description}"</span>
                </div>
                <div>
                  <span className="text-slate-400">Accused Worker:</span>{' '}
                  <span className="text-white font-medium">{activeModalComplaint.workerName}</span>
                </div>
              </div>

              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Peer Committee Hearing Notes & Evidence Check:
                  </label>
                  <textarea
                    rows={3}
                    value={hearingNotes}
                    onChange={(e) => setHearingNotes(e.target.value)}
                    placeholder="Enter findings from GPS route records, physical site inspection, or worker statement..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Adjudication Order:
                  </label>
                  <select
                    value={chosenAction}
                    onChange={(e) => setChosenAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GOODWILL_DISBURSEMENT">
                      Disburse Goodwill Allowance from Cooperative Welfare Pool (Compensate Customer)
                    </option>
                    <option value="TECH_WARNING">
                      Issue Formal Peer Advisory & Mandatory Trade Skill Refresh Course
                    </option>
                    <option value="DISMISS">
                      Dismiss Complaint (Force Majeure / Road Traffic / False Claim)
                    </option>
                  </select>
                </div>

                {chosenAction === 'GOODWILL_DISBURSEMENT' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Contingency Goodwill Amount (₹):
                    </label>
                    <input
                      type="number"
                      value={disbursementAmount}
                      onChange={(e) => setDisbursementAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Drawn from Cooperative Section 70 Customer Protection Reserve (Balance: ₹35,000).
                    </span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveModalComplaint(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950/40"
                  >
                    Execute Official Arbitration Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
