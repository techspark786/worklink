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
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-champagne-500/20 text-champagne-300 border-champagne-500/40';
      default:
        return 'bg-navy-800 text-cream-200 border-navy-700';
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'RESOLVED':
        return 'bg-champagne-500/15 text-champagne-300 border-champagne-400/30';
      case 'UNDER_REVIEW':
        return 'bg-rose-500/15 text-rose-300 border-rose-400/30';
      case 'REJECTED':
        return 'bg-navy-800 text-cream-300/60 border-navy-700';
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
    }
  };

  return (
    <div className="min-h-screen text-cream-100 p-6 md:p-10 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-champagne-300 hover:text-champagne-200 transition-colors mb-2 font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cooperative Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero flex items-center gap-3">
              <Scale className="w-8 h-8 text-champagne-400" />
              Cooperative Grievance & Peer Arbitration
            </h1>
            <p className="text-cream-200/60 text-xs mt-1 font-sans">
              Section 70 Audited Dispute Settlement Committee — Transparent mediation without algorithmic account bans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/welfare"
              className="px-4 py-2.5 bg-navy-900/80 border border-champagne-500/20 rounded-xl text-xs font-bold text-cream-100 hover:border-champagne-400/40 transition-all flex items-center gap-2 font-display"
            >
              <DollarSign className="w-4 h-4 text-champagne-400" /> Welfare Pool Ledger
            </Link>
            <Link
              href="/admin/workers"
              className="px-4 py-2.5 bg-navy-900/80 border border-champagne-500/20 rounded-xl text-xs font-bold text-cream-100 hover:border-champagne-400/40 transition-all flex items-center gap-2 font-display"
            >
              <UserCheck className="w-4 h-4 text-rose-400" /> Member Directory
            </Link>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-4 bg-navy-900/90 border border-champagne-400/50 rounded-2xl flex items-center gap-3 text-champagne-300 text-xs font-sans shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-champagne-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Cooperative Differentiator Callout */}
        <div className="relative p-5 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="p-3 rounded-2xl bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 shadow-glow-champagne">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-cream-100 font-display">Democratic Worker Protection Guarantee</div>
              <div className="text-xs text-cream-200/60 font-sans mt-0.5">
                Unlike corporate gig apps that deactivate worker profiles automatically upon user complaint, WorkLink guarantees a 48-hour peer hearing by the elected 3-member Cooperative Grievance Panel.
              </div>
            </div>
          </div>
          <div className="text-xs bg-navy-950 px-3.5 py-1.5 rounded-full border border-navy-700 text-cream-200/80 font-display shrink-0 relative z-10">
            Active Docket: <strong className="text-champagne-300 font-mono">{filteredComplaints.length} cases</strong>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-navy-900/80 backdrop-blur-xl p-4 rounded-2xl border border-champagne-500/20">
          <div className="flex items-center gap-2 text-xs text-champagne-300 font-display font-bold">
            <Filter className="w-4 h-4" /> Filter By:
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-cream-200/70 font-sans">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-navy-950 border border-navy-700 text-xs text-cream-100 rounded-xl px-3 py-1.5 focus:border-champagne-400 outline-none"
            >
              <option value="ALL" className="bg-navy-900">All Statuses</option>
              <option value="PENDING" className="bg-navy-900">Pending</option>
              <option value="UNDER_REVIEW" className="bg-navy-900">Under Review</option>
              <option value="RESOLVED" className="bg-navy-900">Resolved</option>
              <option value="REJECTED" className="bg-navy-900">Rejected / Dismissed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-cream-200/70 font-sans">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-navy-950 border border-navy-700 text-xs text-cream-100 rounded-xl px-3 py-1.5 focus:border-champagne-400 outline-none"
            >
              <option value="ALL" className="bg-navy-900">All Severities</option>
              <option value="CRITICAL" className="bg-navy-900">Critical</option>
              <option value="HIGH" className="bg-navy-900">High</option>
              <option value="MEDIUM" className="bg-navy-900">Medium</option>
              <option value="LOW" className="bg-navy-900">Low</option>
            </select>
          </div>
        </div>

        {/* Complaints Table / List */}
        <div className="space-y-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.complaintId}
              className="p-6 rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 hover:border-champagne-400/40 transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-champagne-300">{c.complaintId}</span>
                  <span className="text-xs text-cream-300/50 font-mono">Ref: {c.bookingId}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono font-bold ${getSeverityBadge(c.severity)}`}>
                    {c.severity}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono font-bold ${getStatusBadge(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-cream-300/50 flex items-center gap-1.5 font-sans">
                  <Clock className="w-3.5 h-3.5 text-champagne-400" /> {c.createdAt}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-navy-950/80 p-3.5 rounded-2xl border border-navy-800">
                <div>
                  <span className="text-cream-300/50 font-sans">Complainant: </span>
                  <strong className="text-cream-100 font-display">{c.customerName}</strong>
                </div>
                <div>
                  <span className="text-cream-300/50 font-sans">Respondent: </span>
                  <strong className="text-cream-100 font-display">{c.workerName}</strong>
                </div>
                <div>
                  <span className="text-cream-300/50 font-sans">Category: </span>
                  <strong className="text-cream-100 font-display">{c.category.replace('_', ' ')}</strong>
                </div>
              </div>

              <div className="text-sm text-cream-200/90 font-sans">
                <span className="text-xs font-bold text-champagne-300 block mb-1 font-display">Customer Statement:</span>
                "{c.description}"
              </div>

              {c.arbitrationNotes && (
                <div className="p-3.5 bg-navy-950 border border-champagne-500/20 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-champagne-300 flex items-center gap-1.5 font-display">
                    <Scale className="w-3.5 h-3.5 text-champagne-400" /> Peer Arbitration Findings:
                  </div>
                  <div className="text-cream-200/80 font-sans">{c.arbitrationNotes}</div>
                </div>
              )}

              {c.resolutionAction && (
                <div className="p-3.5 bg-navy-950 border border-rose-500/20 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5 font-display">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Resolution Order:
                  </div>
                  <div className="text-cream-200/80 font-sans">{c.resolutionAction}</div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                {c.status === 'PENDING' || c.status === 'UNDER_REVIEW' ? (
                  <button
                    onClick={() => {
                      setActiveModalComplaint(c);
                      setHearingNotes(c.arbitrationNotes || '');
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-glow-rose font-display cursor-pointer"
                  >
                    <Scale className="w-4 h-4 text-navy-950" /> Convene Panel & Adjudicate
                  </button>
                ) : (
                  <div className="text-xs text-champagne-300 flex items-center gap-1.5 font-display">
                    <CheckCircle2 className="w-4 h-4 text-champagne-400" /> Settled under Section 70 Bylaws
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Arbitration Modal */}
        {activeModalComplaint && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative bg-navy-900/95 border border-champagne-500/30 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

              <div className="flex justify-between items-center border-b border-navy-800 pb-4">
                <div>
                  <div className="text-xs text-champagne-300 font-mono font-bold">
                    {activeModalComplaint.complaintId} • Arbitration Docket
                  </div>
                  <h3 className="text-lg font-black text-cream-100 mt-0.5 font-display">
                    Peer Grievance Mediation Hearing
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalComplaint(null)}
                  className="p-1.5 text-cream-300/60 hover:text-cream-100 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-navy-950 rounded-2xl border border-champagne-500/15 space-y-2 text-xs font-sans">
                <div>
                  <span className="text-cream-300/50">Customer Claim:</span>{' '}
                  <span className="text-cream-100">"{activeModalComplaint.description}"</span>
                </div>
                <div>
                  <span className="text-cream-300/50">Accused Worker:</span>{' '}
                  <span className="text-champagne-300 font-bold">{activeModalComplaint.workerName}</span>
                </div>
              </div>

              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-cream-200/80 mb-1.5 font-sans">
                    Peer Committee Hearing Notes & Evidence Check:
                  </label>
                  <textarea
                    rows={3}
                    value={hearingNotes}
                    onChange={(e) => setHearingNotes(e.target.value)}
                    placeholder="Enter findings from GPS route records, physical site inspection, or worker statement..."
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-cream-100 placeholder:text-cream-300/30 focus:border-champagne-400 outline-none font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cream-200/80 mb-1.5 font-sans">
                    Adjudication Order:
                  </label>
                  <select
                    value={chosenAction}
                    onChange={(e) => setChosenAction(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-cream-100 focus:border-champagne-400 outline-none"
                  >
                    <option value="GOODWILL_DISBURSEMENT" className="bg-navy-900">
                      Disburse Goodwill Allowance from Welfare Pool (Compensate Customer)
                    </option>
                    <option value="TECH_WARNING" className="bg-navy-900">
                      Issue Formal Peer Advisory & Mandatory Trade Skill Refresh Course
                    </option>
                    <option value="DISMISS" className="bg-navy-900">
                      Dismiss Complaint (Force Majeure / Road Traffic / False Claim)
                    </option>
                  </select>
                </div>

                {chosenAction === 'GOODWILL_DISBURSEMENT' && (
                  <div>
                    <label className="block text-xs font-bold text-cream-200/80 mb-1.5 font-sans">
                      Contingency Goodwill Amount (₹):
                    </label>
                    <input
                      type="number"
                      value={disbursementAmount}
                      onChange={(e) => setDisbursementAmount(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2 text-xs text-cream-100 focus:border-champagne-400 outline-none font-mono"
                    />
                    <span className="text-[11px] text-cream-300/50 mt-1 block font-sans">
                      Drawn from Cooperative Section 70 Customer Protection Reserve (Balance: ₹35,000).
                    </span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-navy-800">
                  <button
                    type="button"
                    onClick={() => setActiveModalComplaint(null)}
                    className="px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-cream-200/70 border border-navy-700 rounded-xl text-xs font-bold font-display"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 rounded-xl text-xs font-black shadow-glow-rose font-display cursor-pointer"
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
