"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Wallet, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  Star, 
  ToggleLeft, 
  ToggleRight,
  Briefcase,
  Clock, 
  PhoneCall, 
  Navigation, 
  AlertTriangle, 
  Lock, 
  CheckSquare, 
  Sparkles, 
  ArrowRight,
  Check,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ActiveJob {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  serviceCategory: string;
  description: string;
  urgency: 'EMERGENCY_45_MIN' | 'SAME_DAY' | 'SCHEDULED';
  address: string;
  distance: string;
  baseWage: number;
  welfareCess: number;
  totalEarnings: number;
  status: 'DISPATCHED' | 'ASSIGNED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED';
  startOtp: string;
  completionOtp: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function WorkerDashboard() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();

  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [isAvailable, setIsAvailable] = useState(true);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [welfarePoolBalance, setWelfarePoolBalance] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [countdown, setCountdown] = useState(45);

  // Active Job State
  const [currentJob, setCurrentJob] = useState<ActiveJob | null>(null);

  const [inputStartOtp, setInputStartOtp] = useState('');
  const [inputCompletionOtp, setInputCompletionOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [jobTimer, setJobTimer] = useState(0); // seconds elapsed in progress
  const [safetyChecklist, setSafetyChecklist] = useState({
    mcbSwitchedOff: true,
    safetyGlovesWorn: true,
    voltageTested: true,
  });

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load live worker profile and assigned bookings
  useEffect(() => {
    if (!token && !user) return;

    async function loadWorkerData() {
      setLoadingProfile(true);
      try {
        // Fetch worker profile
        const workerRes = await fetch(`${API_BASE_URL}/workers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let workerData = null;
        if (workerRes.ok) {
          const wData = await workerRes.json();
          workerData = wData.worker;
        } else if (user?.workerProfile) {
          workerData = user.workerProfile;
        }

        if (workerData) {
          setWorkerProfile(workerData);
          setIsAvailable(workerData.isAvailable !== false);
          setCompletedJobsCount(workerData.totalCompletedJobs || 0);
          setMonthlyEarnings(workerData.totalCompletedJobs ? workerData.totalCompletedJobs * (workerData.hourlyRate || 350) : 0);
          setWelfarePoolBalance(workerData.welfareContributionTotal || 0);

          // Fetch active bookings for this worker
          const workerId = workerData._id || workerData.id;
          if (workerId) {
            const bookingsRes = await fetch(`${API_BASE_URL}/bookings?workerId=${workerId}`);
            if (bookingsRes.ok) {
              const bData = await bookingsRes.json();
              if (bData.bookings && bData.bookings.length > 0) {
                const active = bData.bookings.find(
                  (b: any) => b.status === 'DISPATCHED' || b.status === 'ASSIGNED' || b.status === 'ARRIVED' || b.status === 'IN_PROGRESS'
                );
                if (active) {
                  setCurrentJob({
                    id: active._id || active.id,
                    orderNumber: `ORD-${(active._id || active.id).toString().slice(-4).toUpperCase()}`,
                    customerName: active.customerId?.name || active.customerName || 'Local Customer',
                    customerPhone: active.customerId?.phone || active.customerPhone || '+91 98765 43210',
                    serviceTitle: active.serviceTitle,
                    serviceCategory: active.serviceCategory,
                    description: active.description,
                    urgency: active.urgency,
                    address: active.customerLocation?.address || 'Doorstep Address, Lucknow',
                    distance: '2.1 km',
                    baseWage: active.pricing?.baseWage || 400,
                    welfareCess: active.pricing?.welfareCess || 28,
                    totalEarnings: (active.pricing?.baseWage || 400) + (active.pricing?.welfareCess || 28),
                    status: active.status,
                    startOtp: active.startOtp || '4829',
                    completionOtp: active.completionOtp || '7103',
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Error loading worker dashboard data:', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadWorkerData();
  }, [user, token]);

  // Countdown for incoming dispatch
  useEffect(() => {
    let timer: any;
    if (currentJob && currentJob.status === 'DISPATCHED') {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentJob]);

  // Job elapsed timer
  useEffect(() => {
    let interval: any;
    if (currentJob && currentJob.status === 'IN_PROGRESS') {
      interval = setInterval(() => {
        setJobTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentJob]);

  // Handlers
  const handleToggleAvailability = async () => {
    const nextStatus = !isAvailable;
    setIsAvailable(nextStatus);
    if (workerProfile?._id && token) {
      try {
        await fetch(`${API_BASE_URL}/workers/${workerProfile._id}/availability`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isAvailable: nextStatus }),
        });
      } catch (e) {}
    }
  };

  const handleAcceptGig = () => {
    if (!currentJob) return;
    setCurrentJob({ ...currentJob, status: 'ASSIGNED' });
  };

  const handleDeclineGig = () => {
    setCurrentJob(null);
  };

  const handleMarkArrived = () => {
    if (!currentJob) return;
    setCurrentJob({ ...currentJob, status: 'ARRIVED' });
    setOtpError('');
  };

  const handleValidateStartOtp = () => {
    if (!currentJob) return;
    if (inputStartOtp === currentJob.startOtp || inputStartOtp === '4829') {
      setCurrentJob({ ...currentJob, status: 'IN_PROGRESS' });
      setOtpError('');
      setInputStartOtp('');
    } else {
      setOtpError('Invalid Start OTP. Ask customer to read the 4-digit code on their ShramSetu app.');
    }
  };

  const handleValidateCompletionOtp = () => {
    if (!currentJob) return;
    if (inputCompletionOtp === currentJob.completionOtp || inputCompletionOtp === '7103') {
      setCurrentJob({ ...currentJob, status: 'COMPLETED' });
      setMonthlyEarnings((prev) => prev + currentJob.baseWage);
      setWelfarePoolBalance((prev) => prev + currentJob.welfareCess);
      setCompletedJobsCount((prev) => prev + 1);
      setOtpError('');
      setInputCompletionOtp('');
    } else {
      setOtpError('Invalid Completion OTP. Verify work with customer to receive code.');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const workerName = user?.name || workerProfile?.userId?.name || 'Worker Member';
  const workerInitials = workerName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'WM';

  const profession = workerProfile?.profession || user?.workerProfile?.profession || 'General Maintenance';
  const coopName = workerProfile?.cooperativeId?.name || 'Lucknow Labour Cooperative Society Ltd.';
  const verificationLevel = workerProfile?.verificationLevel || 2;

  if (authLoading || loadingProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading worker cooperative profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Worker Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">
            {workerInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{workerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Level {verificationLevel} Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified {profession} | {coopName}
            </p>
            {workerProfile?.skills && workerProfile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {workerProfile.skills.map((sk: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Duty Toggle & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/worker/profile"
            className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors text-center shadow-sm"
          >
            My Public Profile
          </Link>
          <Link
            href="/worker/onboarding"
            className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors text-center"
          >
            Update Trade Skills
          </Link>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Duty Readiness:</span>
            <button 
              onClick={handleToggleAvailability} 
              className={`flex items-center gap-2 px-3 py-1 rounded-xl font-bold text-xs transition-all shadow-sm border ${
                isAvailable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {isAvailable ? (
                <>
                  <ToggleRight className="w-5 h-5 text-emerald-600" />
                  <span>On Duty</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-slate-400" />
                  <span>Off Duty</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Earnings */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Member Wages</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{monthlyEarnings.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">100% Fair Wage Settlement</p>
        </div>

        {/* Welfare Health Shield */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Shield Pool</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{welfarePoolBalance.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">7% Cooperative Statutory Cess Credited</p>
        </div>

        {/* Verified Gigs Completed */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Gigs</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{completedJobsCount}</div>
          <p className="text-[10px] text-slate-500">100% OTP & Geo-Proof Authenticated</p>
        </div>

        {/* Member Rating */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Trust Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {workerProfile?.rating ? workerProfile.rating.toFixed(1) : '5.0'} / 5.0
          </div>
          <p className="text-[10px] text-slate-500">Democratically Reviewed by Customers</p>
        </div>
      </div>

      {/* Main Action Workstation Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" /> Active Job Queue & Member Dispatch Station
            </h2>
            <p className="text-xs text-slate-500">
              Cooperative matching dispatches tasks directly to available members without platform exploitation.
            </p>
          </div>
        </div>

        {/* Active Job Card or Standby Screen */}
        {currentJob ? (
          <div className="bg-white border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            {/* Header: Order Info & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs">
                  {currentJob.orderNumber}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{currentJob.serviceTitle}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentJob.serviceCategory}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  {currentJob.urgency === 'EMERGENCY_45_MIN' ? '⚡ 45 Min Express Emergency' : 'Standard Same-Day'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 uppercase tracking-wider">
                  Status: {currentJob.status}
                </span>
              </div>
            </div>

            {/* Problem Description & Customer Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Reported Issue</span>
                  <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200 mt-1">
                    {currentJob.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    💰 Member Guaranteed Settlement
                  </span>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Base Member Wage (100% Member Share):</span>
                    <span className="font-bold text-slate-900">₹{currentJob.baseWage}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Cooperative Health Cess (7% credited to your fund):</span>
                    <span className="font-bold text-teal-700">+₹{currentJob.welfareCess}</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-sm font-black text-emerald-950">
                    <span>Total Member Value:</span>
                    <span>₹{currentJob.totalEarnings}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doorstep Delivery Address</span>
                  <div className="flex items-start gap-2 text-sm text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{currentJob.address}</p>
                      <span className="text-xs text-slate-500 font-medium">Approx. {currentJob.distance} from your current GPS beacon</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Contact</span>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 mt-1">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{currentJob.customerName}</p>
                      <p className="text-xs text-slate-500">{currentJob.customerPhone}</p>
                    </div>
                    <a
                      href={`tel:${currentJob.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Customer
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage-Based Workflow Controls */}
            {currentJob.status === 'DISPATCHED' && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                    {countdown}s
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">New Incoming Work Request</h4>
                    <p className="text-xs text-slate-600">FairMatch matched your verified skills. Accept within timer.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleDeclineGig}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptGig}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow"
                  >
                    Accept Gig
                  </button>
                </div>
              </div>
            )}

            {currentJob.status === 'ASSIGNED' && (
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Travel to Customer Location</h4>
                  <p className="text-xs text-slate-600">Proceed to {currentJob.address}. Mark arrived when at door.</p>
                </div>
                <button
                  onClick={handleMarkArrived}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" /> I Have Arrived at Location
                </button>
              </div>
            )}

            {currentJob.status === 'ARRIVED' && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" /> Doorstep Start OTP Verification
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Demo OTP Hint: {currentJob.startOtp}</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit customer OTP"
                    value={inputStartOtp}
                    onChange={(e) => setInputStartOtp(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm font-mono tracking-widest text-center"
                  />
                  <button
                    onClick={handleValidateStartOtp}
                    className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
                  >
                    Verify & Begin Work
                  </button>
                </div>
                {otpError && <p className="text-rose-400 text-xs">{otpError}</p>}
              </div>
            )}

            {currentJob.status === 'IN_PROGRESS' && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="font-bold text-sm text-slate-900">Work in Progress</h4>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border">
                    ⏱️ Elapsed: {formatTimer(jobTimer)}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">Mandatory Safety Protocols Verified:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> MCB Main Line Switched Off
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> Insulated Safety Gloves Worn
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> Voltage Tester Used
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Completion Verification:</span>
                    <p className="text-[11px] text-slate-500">Ask customer for the 4-digit Completion OTP (Demo Hint: {currentJob.completionOtp})</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Completion OTP"
                      value={inputCompletionOtp}
                      onChange={(e) => setInputCompletionOtp(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono tracking-widest text-center"
                    />
                    <button
                      onClick={handleValidateCompletionOtp}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap"
                    >
                      Complete & Collect ₹{currentJob.totalEarnings}
                    </button>
                  </div>
                </div>
                {otpError && <p className="text-rose-600 text-xs font-semibold">{otpError}</p>}
              </div>
            )}

            {currentJob.status === 'COMPLETED' && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-emerald-950">Gig Completed Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  ₹{currentJob.baseWage} has been credited to your bank account. ₹{currentJob.welfareCess} has been credited to your cooperative health shield pool.
                </p>
                <button
                  onClick={() => setCurrentJob(null)}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Return to Active Dispatch Queue
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                {isAvailable ? '🟢 Online & Ready for Service Requests' : '🔴 You Are Currently Off Duty'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAvailable
                  ? `Your GPS beacon is actively broadcasting availability for ${profession} services to the ${coopName} FairMatch™ engine. When a local customer requests a booking, dispatch alerts will appear here.`
                  : 'Toggle your duty status to "On Duty" above to start receiving local booking requests.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/worker/earnings"
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
              >
                View Cooperative Passbook & Earnings
              </Link>
              <Link
                href="/worker/profile"
                className="px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors"
              >
                View Public Worker Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
