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
  XCircle
} from 'lucide-react';

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

import { useAuth } from '@/context/AuthContext';

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
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">● Awaiting Worker Acceptance</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">● Worker Assigned & En Route</span>;
      case 'ARRIVED':
        return <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">● Worker Arrived at Doorstep</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-pulse">⚡ Work in Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold">✓ Completed & Settled</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">✕ Cancelled</span>;
    }
  };

  const stages: BookingItem['status'][] = ['REQUESTED', 'ASSIGNED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <Link
            href="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Search & Match
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              My Service Bookings & Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {bookings.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cooperative fulfillment pipeline, anti-fraud handshake OTPs, and auditable welfare ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDisputeOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-300"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" /> Cooperative Dispute Hotline
          </button>
          <Link
            href="/customer/dashboard"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <Sparkles className="w-4 h-4" /> Book Another Worker
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live Tracking Enabled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Services</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {bookings.filter(b => b.status === 'COMPLETED').length}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">100% Satisfaction Guarantee</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Middleman Fees Saved</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            ₹{bookings.reduce((acc, b) => acc + (b.pricing?.savingsVsAggregator || 180), 0)}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Saved vs Corporate Apps</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Welfare Fund Contributed</span>
          <span className="text-2xl font-black text-teal-600 mt-1 block">
            ₹{bookings.reduce((acc, b) => acc + (b.pricing?.welfareCess || 28), 0)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Supports Worker Healthcare</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === tab
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Bookings' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Clock className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No bookings in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any active or past service requests matching this filter status.
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
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
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all p-6 sm:p-8 space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Order #{booking._id.slice(-6)}</span>
                      {getStatusBadge(booking.status)}
                      {booking.urgency === 'EMERGENCY_45_MIN' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200">
                          ⚡ 45-Min Express
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{booking.serviceTitle}</h3>
                    <p className="text-xs text-slate-500">{booking.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedReceipt(booking)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-slate-500" /> View Transparent Bill
                    </button>
                    <a
                      href={`tel:${booking.workerPhone}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-600" /> Call Worker
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
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                                : isPastOrCurrent
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isPastOrCurrent && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] block font-bold leading-tight ${
                              isCurrent ? 'text-emerald-700' : isPastOrCurrent ? 'text-slate-800' : 'text-slate-400'
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
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                          Cooperative Anti-Fraud Handshake
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Give <strong>Start OTP</strong> upon worker arrival to start timer. Only share <strong>Completion OTP</strong> after work is thoroughly checked.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-700">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold">Start OTP</span>
                        <span className="text-2xl font-black text-emerald-400 tracking-widest">
                          {booking.startOtp}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-slate-700"></div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold">Completion OTP</span>
                        <span className="text-2xl font-black text-amber-400 tracking-widest">
                          {booking.completionOtp}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Worker & Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Cooperative Worker</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        {booking.workerName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{booking.workerName}</h4>
                        <p className="text-[11px] text-slate-500">{booking.cooperativeName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Schedule & Window</span>
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {booking.scheduledDate} ({booking.timeSlot})
                    </p>
                    <p className="text-[11px] text-slate-500">FairMatch Compatibility: {booking.matchScore}%</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Address</span>
                    <p className="text-xs font-medium text-slate-800 flex items-start gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{booking.customerLocation?.address || 'Hazratganj, Lucknow'}</span>
                    </p>
                  </div>
                </div>

                {/* Hackathon Simulation Bar (Allows testing status changes dynamically) */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 text-[11px]">⚡ SIH Demo Simulator:</span>
                    {booking.status === 'REQUESTED' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'ASSIGNED')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100"
                      >
                        Simulate: Worker Accepts
                      </button>
                    )}
                    {booking.status === 'ASSIGNED' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'ARRIVED')}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold hover:bg-purple-100"
                      >
                        Simulate: Worker Arrives
                      </button>
                    )}
                    {booking.status === 'ARRIVED' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'IN_PROGRESS')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100"
                      >
                        Simulate: Start OTP Handshake
                      </button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'COMPLETED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow"
                      >
                        Simulate: Complete Job & Release Escrow
                      </button>
                    )}
                  </div>

                  {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'CANCELLED')}
                      className="text-rose-600 hover:text-rose-800 font-bold text-[11px]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Audit-Ready Transparent Bill
                </span>
                <h3 className="text-xl font-black text-slate-900">Cooperative Receipt</h3>
                <p className="text-xs text-slate-400">Order ID: #{selectedReceipt._id.slice(-8)}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Direct Worker Base Wage (100% credited):</span>
                <span className="font-bold text-slate-900">₹{selectedReceipt.pricing.baseWage}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cooperative Member Welfare Cess (7%):</span>
                <span className="font-bold text-teal-700">+₹{selectedReceipt.pricing.welfareCess}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Digital Platform Facilitation & GST (5%):</span>
                <span className="font-bold text-slate-900">+₹{selectedReceipt.pricing.platformFee}</span>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-3 flex justify-between text-sm font-black text-slate-900">
                <span>Total Paid by Customer:</span>
                <span className="text-emerald-700">₹{selectedReceipt.pricing.totalAmount}</span>
              </div>

              {/* Cooperative Social Impact Badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Non-Exploitative Guarantee
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  You saved ₹{selectedReceipt.pricing.savingsVsAggregator} compared to private aggregators. ₹{selectedReceipt.pricing.welfareCess} has been credited to {selectedReceipt.workerName}&apos;s cooperative health & accident welfare fund.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* COOPERATIVE DISPUTE HOTLINE MODAL */}
      {disputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Cooperative Grievance Redressal</h3>
                  <p className="text-xs text-slate-500">Cooperative Societies Act, Section 70</p>
                </div>
              </div>
              <button
                onClick={() => setDisputeOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                All service disputes on ShramSetu are governed by the elected <strong>Managing Committee of the Lucknow Labour Cooperative Society Ltd.</strong>
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">Toll-Free Worker & Customer Helpline:</span>
                <span className="text-emerald-700 font-black text-sm block">1800-SHRAM-SETU (1800-747-267)</span>
                <span className="text-[10px] text-slate-400 block">Available 24x7 in Hindi and English</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">Cooperative Society Office:</span>
                <p className="text-[11px] text-slate-600">
                  Pradeshik Shramik Sahakari Sangh, Hazratganj, Lucknow, UP — 226001.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDisputeOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
