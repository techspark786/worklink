"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  PhoneCall, 
  Receipt, 
  Lock, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  XCircle,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface BookingItem {
  _id: string;
  id?: string;
  customerId: string;
  customerName?: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  cooperativeName: string;
  serviceTitle: string;
  serviceCategory: string;
  description: string;
  urgency: 'EMERGENCY_45_MIN' | 'SAME_DAY' | 'SCHEDULED';
  scheduledDate: string;
  timeSlot: string;
  customerLocation: {
    address: string;
    city: string;
    pincode: string;
  };
  pricing: {
    baseWage: number;
    welfareCess: number;
    platformFee: number;
    totalAmount: number;
    savingsVsAggregator: number;
  };
  status: 'REQUESTED' | 'ASSIGNED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startOtp: string;
  completionOtp: string;
  matchScore: number;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomerBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingItem | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Fetch bookings from backend strictly for currently authenticated customer
  useEffect(() => {
    async function fetchBookings() {
      try {
        const customerParam = user?.id ? `?customerId=${user.id}` : '';
        const res = await fetch(`${API_BASE_URL}/bookings${customerParam}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.bookings)) {
            setBookings(data.bookings);
          }
        }
      } catch (e) {
        console.warn('Error fetching customer bookings:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [user]);

  // Update status locally and on backend
  const updateStatus = async (bookingId: string, newStatus: BookingItem['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId || b.id === bookingId ? { ...b, status: newStatus } : b))
    );

    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // offline
    }
  };

  const filteredBookings = filterStatus === 'ALL' 
    ? bookings 
    : bookings.filter((b) => b.status === filterStatus);

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="px-3 py-1 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 text-xs font-bold font-mono">● Awaiting Worker Acceptance</span>;
      case 'ASSIGNED':
        return <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/30 text-xs font-bold font-mono">● Worker Assigned & En Route</span>;
      case 'ARRIVED':
        return <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 text-xs font-bold font-mono">● Worker Arrived at Doorstep</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 rounded-full bg-champagne-400/20 text-champagne-200 border border-champagne-400/50 text-xs font-bold font-mono animate-pulse">⚡ Work in Progress</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full bg-navy-800 text-cream-200 border border-navy-700 text-xs font-bold font-mono">✓ Completed & Settled</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/40 text-xs font-bold font-mono">✕ Cancelled</span>;
    }
  };

  const stages: BookingItem['status'][] = ['REQUESTED', 'ASSIGNED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-navy-900/80 backdrop-blur-2xl border border-champagne-500/20 shadow-2xl shadow-navy-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="relative z-10">
          <Link
            href="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-champagne-300 hover:text-champagne-200 mb-2 transition-colors font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Search & Match
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero">
              My Service Bookings & Tracking
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-champagne-500/15 border border-champagne-400/30 text-champagne-300 text-xs font-bold font-mono">
              {bookings.length} Orders
            </span>
          </div>
          <p className="text-xs text-cream-200/60 mt-1 font-sans">
            Real-time cooperative fulfillment pipeline, anti-fraud handshake OTPs, and auditable welfare ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setDisputeOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-navy-950/70 hover:bg-navy-800 text-cream-200/90 font-bold text-xs flex items-center gap-2 transition-all border border-navy-700/80 hover:border-champagne-400/40"
          >
            <HelpCircle className="w-4 h-4 text-champagne-400" /> 
            <span>Grievance Redressal</span>
          </button>
          <Link
            href="/customer/dashboard"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-champagne-400 text-navy-950 font-black text-xs flex items-center gap-2 transition-all shadow-glow-rose font-display"
          >
            <Sparkles className="w-4 h-4 text-navy-950" /> 
            <span>Book Another Worker</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="relative bg-navy-900/80 backdrop-blur-xl p-5 rounded-2xl border border-champagne-500/20 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-champagne-300 uppercase tracking-wider block font-display">Active Jobs</span>
          <span className="text-2xl sm:text-3xl font-black text-cream-100 block font-display">
            {bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length}
          </span>
          <span className="text-[10px] text-champagne-400 font-bold block font-sans">Live Tracking Enabled</span>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-5 rounded-2xl border border-champagne-500/20 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-champagne-300 uppercase tracking-wider block font-display">Completed Jobs</span>
          <span className="text-2xl sm:text-3xl font-black text-cream-100 block font-display">
            {bookings.filter(b => b.status === 'COMPLETED').length}
          </span>
          <span className="text-[10px] text-cream-300/50 font-medium block font-sans">100% Guaranteed</span>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-5 rounded-2xl border border-champagne-500/20 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block font-display">Aggregator Savings</span>
          <span className="text-2xl sm:text-3xl font-black gradient-text-rose block font-display">
            ₹{bookings.reduce((acc, b) => acc + (b.pricing?.savingsVsAggregator || 180), 0)}
          </span>
          <span className="text-[10px] text-rose-300/70 font-semibold block font-sans">Saved vs Corporate Apps</span>
        </div>

        <div className="relative bg-navy-900/80 backdrop-blur-xl p-5 rounded-2xl border border-champagne-500/20 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-champagne-300 uppercase tracking-wider block font-display">Welfare Cess Paid</span>
          <span className="text-2xl sm:text-3xl font-black gradient-text-gold block font-display">
            ₹{bookings.reduce((acc, b) => acc + (b.pricing?.welfareCess || 28), 0)}
          </span>
          <span className="text-[10px] text-cream-300/50 font-medium block font-sans">Worker Healthcare Fund</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-display ${
              filterStatus === tab
                ? 'bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 shadow-glow-rose'
                : 'bg-navy-900/80 text-cream-200/70 border border-navy-700/60 hover:border-champagne-400/30 hover:text-cream-100'
            }`}
          >
            {tab === 'ALL' ? 'All Bookings' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-navy-900/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-champagne-500/20 space-y-4">
            <Clock className="w-12 h-12 text-cream-300/30 mx-auto" />
            <h3 className="text-lg font-bold text-cream-100 font-display">No bookings in this category</h3>
            <p className="text-xs text-cream-200/60 max-w-sm mx-auto font-sans">
              You do not have any active or past service requests matching this filter status.
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose font-display"
            >
              Browse Services & Book
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const currentStageIndex = stages.indexOf(booking.status);

            return (
              <div
                key={booking._id || booking.id}
                className="relative bg-navy-900/80 backdrop-blur-xl rounded-3xl border border-champagne-500/20 hover:border-champagne-400/40 shadow-xl transition-all p-6 sm:p-8 space-y-6 overflow-hidden"
              >
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cream-300/50 font-mono">Order #{booking._id.slice(-6)}</span>
                      {getStatusBadge(booking.status)}
                      {booking.urgency === 'EMERGENCY_45_MIN' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 font-mono">
                          ⚡ 45-Min Express
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-cream-100 font-display">{booking.serviceTitle}</h3>
                    <p className="text-xs text-cream-200/70 font-sans">{booking.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedReceipt(booking)}
                      className="px-4 py-2.5 rounded-xl bg-navy-950/80 hover:bg-navy-800 text-cream-200 border border-champagne-500/20 font-bold text-xs flex items-center gap-2 transition-all hover:border-champagne-400/40"
                    >
                      <Receipt className="w-4 h-4 text-champagne-400" /> 
                      <span>Transparent Bill</span>
                    </button>
                    <a
                      href={`tel:${booking.workerPhone}`}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-bold text-xs flex items-center gap-2 transition-all shadow-glow-rose font-display"
                    >
                      <PhoneCall className="w-4 h-4 text-navy-950" /> 
                      <span>Call Worker</span>
                    </a>
                  </div>
                </div>

                {/* 5-Stage Visual Progress Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    {stages.map((stage, idx) => {
                      const isPastOrCurrent = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div key={stage} className="text-center space-y-1.5">
                          <div
                            className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
                              isCurrent
                                ? 'bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 ring-4 ring-rose-500/20 shadow-glow-rose font-black'
                                : isPastOrCurrent
                                ? 'bg-champagne-500 text-navy-950 font-bold'
                                : 'bg-navy-950 text-cream-300/40 border border-navy-800'
                            }`}
                          >
                            {isPastOrCurrent && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] block font-bold leading-tight font-display ${
                              isCurrent ? 'text-champagne-300' : isPastOrCurrent ? 'text-cream-100' : 'text-cream-300/40'
                            }`}
                          >
                            {stage.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Doorstep Handshake OTP Display Card */}
                {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                  <div className="bg-gradient-to-r from-navy-950 to-espresso-950 text-cream-100 p-5 rounded-2xl border border-champagne-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Lock className="w-4 h-4 text-champagne-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-champagne-300 font-display">
                          Cooperative Anti-Fraud Handshake
                        </span>
                      </div>
                      <p className="text-xs text-cream-200/70 font-sans">
                        Give <strong>Start OTP</strong> upon arrival to verify worker identity. Share <strong>Completion OTP</strong> only after satisfactory service.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 bg-navy-900/90 px-6 py-3 rounded-2xl border border-champagne-500/20">
                      <div className="text-center">
                        <span className="text-[10px] text-cream-300/50 block font-display">Start OTP</span>
                        <span className="text-2xl font-black text-champagne-300 tracking-widest font-mono">
                          {booking.startOtp}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-navy-700"></div>
                      <div className="text-center">
                        <span className="text-[10px] text-cream-300/50 block font-display">Completion OTP</span>
                        <span className="text-2xl font-black text-rose-300 tracking-widest font-mono">
                          {booking.completionOtp}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Worker & Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-2">
                    <span className="text-[10px] font-bold text-champagne-300 uppercase tracking-wider block font-display">
                      Cooperative Worker
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-champagne-400 to-rose-500 text-navy-950 flex items-center justify-center font-bold font-display shadow-glow-champagne">
                        {booking.workerName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-cream-100 text-sm font-display">{booking.workerName}</h4>
                        <p className="text-[11px] text-cream-200/60 font-sans">{booking.cooperativeName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-1">
                    <span className="text-[10px] font-bold text-champagne-300 uppercase tracking-wider block font-display">
                      Schedule Window
                    </span>
                    <p className="text-xs font-bold text-cream-100 flex items-center gap-1.5 mt-1 font-sans">
                      <Clock className="w-3.5 h-3.5 text-champagne-400" /> {booking.scheduledDate} ({booking.timeSlot})
                    </p>
                    <p className="text-[11px] text-cream-200/60 font-mono">FairMatch: {booking.matchScore}%</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-1">
                    <span className="text-[10px] font-bold text-champagne-300 uppercase tracking-wider block font-display">
                      Service Address
                    </span>
                    <p className="text-xs font-medium text-cream-100 flex items-start gap-1.5 mt-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-champagne-400 shrink-0 mt-0.5" />
                      <span>{booking.customerLocation?.address || 'Hazratganj, Lucknow'}</span>
                    </p>
                  </div>
                </div>

                {/* Hackathon Simulation Bar (Allows testing status changes dynamically) */}
                <div className="pt-3 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-champagne-300 text-[11px] font-display">⚡ Code Craft 3.0 Simulator:</span>
                    {booking.status === 'REQUESTED' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'ASSIGNED')}
                        className="px-3 py-1 rounded-lg bg-navy-950 hover:bg-navy-800 text-rose-300 border border-rose-500/40 font-bold transition-colors"
                      >
                        Simulate: Worker Accepts
                      </button>
                    )}
                    {booking.status === 'ASSIGNED' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'ARRIVED')}
                        className="px-3 py-1 rounded-lg bg-navy-950 hover:bg-navy-800 text-purple-300 border border-purple-500/40 font-bold transition-colors"
                      >
                        Simulate: Worker Arrives
                      </button>
                    )}
                    {booking.status === 'ARRIVED' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'IN_PROGRESS')}
                        className="px-3 py-1 rounded-lg bg-navy-950 hover:bg-navy-800 text-champagne-300 border border-champagne-500/40 font-bold transition-colors"
                      >
                        Simulate: Start OTP Handshake
                      </button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'COMPLETED')}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black shadow-glow-rose font-display"
                      >
                        Simulate: Complete Job & Settle Escrow
                      </button>
                    )}
                  </div>

                  {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'CANCELLED')}
                      className="text-rose-400 hover:text-rose-300 font-bold text-[11px] transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* TRANSPARENT BILL RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-navy-900/95 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-champagne-500/30">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-champagne-300 uppercase tracking-wider font-display">
                  Audit-Ready Transparent Bill
                </span>
                <h3 className="text-xl font-black text-cream-100 font-display">Cooperative Receipt</h3>
                <p className="text-xs text-cream-300/50 font-mono">Order ID: #{selectedReceipt._id.slice(-8)}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 text-cream-300/60 hover:text-cream-100 rounded-full hover:bg-navy-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-cream-200/70 font-sans">
                <span>Direct Worker Base Wage (100% credited):</span>
                <span className="font-bold text-cream-100 font-mono">₹{selectedReceipt.pricing.baseWage}</span>
              </div>
              <div className="flex justify-between text-cream-200/70 font-sans">
                <span>Cooperative Welfare Cess (7%):</span>
                <span className="font-bold text-champagne-300 font-mono">+₹{selectedReceipt.pricing.welfareCess}</span>
              </div>
              <div className="flex justify-between text-cream-200/70 font-sans">
                <span>Digital Platform & GST (5%):</span>
                <span className="font-bold text-cream-100 font-mono">+₹{selectedReceipt.pricing.platformFee}</span>
              </div>

              <div className="border-t border-dashed border-navy-700 pt-3 flex justify-between text-sm font-black text-cream-100 font-display">
                <span>Total Paid by Customer:</span>
                <span className="gradient-text-gold font-mono">₹{selectedReceipt.pricing.totalAmount}</span>
              </div>

              {/* Cooperative Social Impact Badge */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-champagne-500/20 text-cream-100 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs text-champagne-300 font-display">
                  <ShieldCheck className="w-4 h-4 text-champagne-400" /> 
                  <span>Non-Exploitative Guarantee</span>
                </span>
                <p className="text-[11px] text-cream-200/70 leading-relaxed font-sans">
                  You saved ₹{selectedReceipt.pricing.savingsVsAggregator} compared to private aggregators. ₹{selectedReceipt.pricing.welfareCess} has been credited to {selectedReceipt.workerName}&apos;s cooperative health & accident welfare fund.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-3 bg-gradient-to-r from-rose-500 via-rose-400 to-champagne-400 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose font-display cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* COOPERATIVE DISPUTE HOTLINE MODAL */}
      {disputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-navy-900/95 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-champagne-500/30">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />

            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-champagne-500/20 text-champagne-300 flex items-center justify-center shadow-glow-champagne">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-cream-100 font-display">Cooperative Grievance Redressal</h3>
                  <p className="text-xs text-cream-300/50 font-sans">Cooperative Societies Act, Section 70</p>
                </div>
              </div>
              <button
                onClick={() => setDisputeOpen(false)}
                className="p-1.5 text-cream-300/60 hover:text-cream-100 rounded-full hover:bg-navy-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-cream-200/70 font-sans">
              <p>
                All service disputes on WorkLink are governed by the elected <strong>Managing Committee of the Lucknow Labour Cooperative Society Ltd.</strong>
              </p>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                <span className="font-bold text-champagne-300 block font-display">Toll-Free Worker & Customer Helpline:</span>
                <span className="text-rose-300 font-black text-sm block font-mono">1800-WORK-LINK (1800-967-554)</span>
                <span className="text-[10px] text-cream-300/40 block">Available 24x7 in Hindi and English</span>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                <span className="font-bold text-champagne-300 block font-display">Cooperative Society Office:</span>
                <p className="text-[11px] text-cream-200/70">
                  Pradeshik Shramik Sahakari Sangh, Hazratganj, Lucknow, UP — 226001.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDisputeOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-rose-500 via-rose-400 to-champagne-400 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose font-display cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
