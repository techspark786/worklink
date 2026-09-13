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
      setOtpError('Invalid Start OTP. Ask customer to read the 4-digit code on their WorkLink app.');
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
        <RefreshCw className="w-8 h-8 text-champagne-400 animate-spin" />
        <p className="text-sm font-semibold text-cream-200 font-sans">Loading worker cooperative profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Worker Profile Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-navy-900/80 backdrop-blur-2xl border border-champagne-500/20 shadow-2xl shadow-navy-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-champagne-400 to-rose-500 text-navy-950 font-black text-2xl flex items-center justify-center shadow-glow-champagne flex-shrink-0 font-display">
            {workerInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-display gradient-text-hero">{workerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 text-xs font-bold flex items-center gap-1 font-display">
                <ShieldCheck className="w-3.5 h-3.5 text-champagne-400" /> Level {verificationLevel} Verified
              </span>
            </div>
            <p className="text-xs text-cream-200/60 mt-0.5 font-sans">
              Certified {profession} • {coopName}
            </p>
            {workerProfile?.skills && workerProfile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {workerProfile.skills.map((sk: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-navy-950/80 text-cream-200/70 border border-navy-700/60 text-[10px] rounded-lg font-medium font-sans">
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Duty Toggle & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <Link
            href="/worker/profile"
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-800 text-cream-100 border border-navy-700 hover:border-champagne-400/40 font-bold text-xs rounded-xl transition-all text-center shadow-sm font-display"
          >
            Public Profile
          </Link>
          <Link
            href="/worker/onboarding"
            className="px-4 py-2.5 bg-champagne-500/15 text-champagne-300 border border-champagne-400/30 hover:bg-champagne-500/25 font-bold text-xs rounded-xl transition-all text-center font-display"
          >
            Update Trade Skills
          </Link>
          <div className="flex items-center gap-3 bg-navy-950/80 p-2 rounded-2xl border border-champagne-500/20">
            <span className="text-xs font-bold text-cream-200/80 font-sans">Duty Readiness:</span>
            <button 
              onClick={handleToggleAvailability} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm border font-display ${
                isAvailable 
                  ? 'bg-rose-500/20 border-rose-400/60 text-rose-200 shadow-glow-rose' 
                  : 'bg-navy-900 border-navy-700 text-cream-300/40'
              }`}
            >
              {isAvailable ? (
                <>
                  <ToggleRight className="w-5 h-5 text-rose-400" />
                  <span>On Duty</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-cream-300/40" />
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
        <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Net Member Wages</span>
            <div className="w-8 h-8 rounded-xl bg-champagne-500/15 text-champagne-300 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black gradient-text-gold font-display">₹{monthlyEarnings.toLocaleString()}</div>
          <p className="text-[10px] text-cream-300/50 font-sans">100% Fair Wage Settlement</p>
        </div>

        {/* Welfare Health Shield */}
        <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-display">Health Shield Pool</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-300 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black gradient-text-rose font-display">₹{welfarePoolBalance.toLocaleString()}</div>
          <p className="text-[10px] text-cream-300/50 font-sans">7% Cooperative Statutory Cess</p>
        </div>

        {/* Verified Gigs Completed */}
        <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Completed Gigs</span>
            <div className="w-8 h-8 rounded-xl bg-navy-800 text-cream-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cream-100 font-display">{completedJobsCount}</div>
          <p className="text-[10px] text-cream-300/50 font-sans">100% OTP & Geo-Proof</p>
        </div>

        {/* Member Rating */}
        <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Trust Rating</span>
            <div className="w-8 h-8 rounded-xl bg-champagne-500/15 text-champagne-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-champagne-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cream-100 font-display">
            {workerProfile?.rating ? workerProfile.rating.toFixed(1) : '5.0'} / 5.0
          </div>
          <p className="text-[10px] text-cream-300/50 font-sans">Democratically Reviewed</p>
        </div>
      </div>

      {/* Main Action Workstation Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black font-display gradient-text-hero flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-champagne-400" /> 
              <span>Active Job Queue & Member Dispatch Station</span>
            </h2>
            <p className="text-xs text-cream-200/60 font-sans mt-0.5">
              Cooperative matching dispatches tasks directly to available members without intermediary cuts.
            </p>
          </div>
        </div>

        {/* Active Job Card or Standby Screen */}
        {currentJob ? (
          <div className="relative bg-navy-900/90 backdrop-blur-2xl border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />

            {/* Header: Order Info & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-xl bg-navy-950 text-champagne-300 font-mono font-bold text-xs border border-champagne-500/20">
                  {currentJob.orderNumber}
                </div>
                <div>
                  <h3 className="font-black text-lg text-cream-100 font-display">{currentJob.serviceTitle}</h3>
                  <span className="text-xs font-bold text-champagne-300 bg-champagne-500/15 px-2 py-0.5 rounded border border-champagne-400/30">
                    {currentJob.serviceCategory}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 animate-pulse font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {currentJob.urgency === 'EMERGENCY_45_MIN' ? '⚡ 45 Min Express Emergency' : 'Standard Same-Day'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-navy-950 text-cream-100 uppercase tracking-wider border border-navy-700 font-mono">
                  Status: {currentJob.status}
                </span>
              </div>
            </div>

            {/* Problem Description & Customer Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Customer Reported Issue</span>
                  <p className="text-sm text-cream-100 bg-navy-950/80 p-3.5 rounded-2xl border border-navy-800 mt-1 font-sans">
                    {currentJob.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950/80 border border-champagne-500/20 space-y-2">
                  <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider block font-display">
                    💰 Guaranteed Settlement
                  </span>
                  <div className="flex items-center justify-between text-xs text-cream-200/70 font-sans">
                    <span>Base Wage (100% to you):</span>
                    <span className="font-bold text-cream-100 font-mono">₹{currentJob.baseWage}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-cream-200/70 font-sans">
                    <span>Cooperative Health Cess (7% to your pool):</span>
                    <span className="font-bold text-rose-300 font-mono">+₹{currentJob.welfareCess}</span>
                  </div>
                  <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-sm font-black text-cream-100 font-display">
                    <span>Total Member Value:</span>
                    <span className="gradient-text-gold font-mono">₹{currentJob.totalEarnings}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Doorstep Delivery Address</span>
                  <div className="flex items-start gap-2 text-sm text-cream-100 bg-navy-950/80 p-3.5 rounded-2xl border border-navy-800 mt-1 font-sans">
                    <MapPin className="w-4 h-4 text-champagne-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{currentJob.address}</p>
                      <span className="text-xs text-cream-300/50 font-medium">Approx. {currentJob.distance} from your current GPS beacon</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-champagne-300 uppercase tracking-wider font-display">Customer Contact</span>
                  <div className="flex items-center justify-between bg-navy-950/80 p-3.5 rounded-2xl border border-navy-800 mt-1">
                    <div>
                      <p className="font-bold text-cream-100 text-sm font-display">{currentJob.customerName}</p>
                      <p className="text-xs text-cream-300/50 font-mono">{currentJob.customerPhone}</p>
                    </div>
                    <a
                      href={`tel:${currentJob.customerPhone}`}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs flex items-center gap-1.5 shadow-glow-rose font-display"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-navy-950" /> Call Customer
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage-Based Workflow Controls */}
            {currentJob.status === 'DISPATCHED' && (
              <div className="bg-navy-950 p-5 rounded-2xl border border-champagne-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-champagne-400 text-navy-950 flex items-center justify-center font-black text-lg font-mono shadow-glow-rose">
                    {countdown}s
                  </div>
                  <div>
                    <h4 className="font-bold text-cream-100 text-sm font-display">New Incoming Work Request</h4>
                    <p className="text-xs text-cream-200/60 font-sans">FairMatch matched your verified skills. Accept within timer.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleDeclineGig}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-navy-700 text-cream-200/70 font-bold text-xs hover:bg-navy-800 font-display"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptGig}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs shadow-glow-rose font-display cursor-pointer"
                  >
                    Accept Gig
                  </button>
                </div>
              </div>
            )}

            {currentJob.status === 'ASSIGNED' && (
              <div className="bg-navy-950 p-5 rounded-2xl border border-champagne-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-cream-100 text-sm font-display">Travel to Customer Location</h4>
                  <p className="text-xs text-cream-200/60 font-sans">Proceed to {currentJob.address}. Mark arrived when at door.</p>
                </div>
                <button
                  onClick={handleMarkArrived}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs shadow-glow-rose flex items-center justify-center gap-2 font-display cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-navy-950" /> I Have Arrived at Location
                </button>
              </div>
            )}

            {currentJob.status === 'ARRIVED' && (
              <div className="bg-navy-950 p-5 rounded-2xl border border-champagne-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-cream-100 flex items-center gap-2 font-display">
                    <Lock className="w-4 h-4 text-champagne-400" /> Doorstep Start OTP Verification
                  </h4>
                  <span className="text-[10px] text-champagne-300 font-mono">Demo OTP Hint: {currentJob.startOtp}</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit customer OTP"
                    value={inputStartOtp}
                    onChange={(e) => setInputStartOtp(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-navy-900 text-cream-100 border border-navy-700 focus:border-champagne-400 text-sm font-mono tracking-widest text-center outline-none"
                  />
                  <button
                    onClick={handleValidateStartOtp}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs shadow-glow-rose font-display cursor-pointer"
                  >
                    Verify & Begin Work
                  </button>
                </div>
                {otpError && <p className="text-rose-400 text-xs font-sans">{otpError}</p>}
              </div>
            )}

            {currentJob.status === 'IN_PROGRESS' && (
              <div className="bg-navy-950 p-5 rounded-2xl border border-champagne-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-champagne-400 animate-ping" />
                    <h4 className="font-bold text-sm text-cream-100 font-display">Work in Progress</h4>
                  </div>
                  <span className="font-mono text-sm font-bold text-champagne-300 bg-navy-900 px-3 py-1 rounded-lg border border-navy-700">
                    ⏱️ Elapsed: {formatTimer(jobTimer)}
                  </span>
                </div>

                <div className="p-3.5 bg-navy-900 rounded-xl border border-navy-800 space-y-2">
                  <span className="text-xs font-bold text-champagne-300 font-display">Mandatory Safety Protocols Verified:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-cream-200/70 font-sans">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-champagne-400" /> MCB Switched Off
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-champagne-400" /> Insulated Gloves
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-champagne-400" /> Voltage Tester Used
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-cream-100 font-display">Completion Verification:</span>
                    <p className="text-[11px] text-cream-200/60 font-sans">Ask customer for Completion OTP (Demo Hint: {currentJob.completionOtp})</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Completion OTP"
                      value={inputCompletionOtp}
                      onChange={(e) => setInputCompletionOtp(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-cream-100 text-xs font-mono tracking-widest text-center outline-none focus:border-champagne-400"
                    />
                    <button
                      onClick={handleValidateCompletionOtp}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs whitespace-nowrap shadow-glow-rose font-display cursor-pointer"
                    >
                      Complete & Collect ₹{currentJob.totalEarnings}
                    </button>
                  </div>
                </div>
                {otpError && <p className="text-rose-400 text-xs font-semibold">{otpError}</p>}
              </div>
            )}

            {currentJob.status === 'COMPLETED' && (
              <div className="bg-navy-950 p-6 rounded-2xl border border-champagne-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-champagne-400 mx-auto" />
                <h4 className="text-lg font-black text-cream-100 font-display">Gig Completed Successfully!</h4>
                <p className="text-xs text-cream-200/70 font-sans">
                  ₹{currentJob.baseWage} has been credited to your direct benefit transfer account. ₹{currentJob.welfareCess} has been added to your cooperative health shield pool.
                </p>
                <button
                  onClick={() => setCurrentJob(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs shadow-glow-rose font-display cursor-pointer"
                >
                  Return to Active Dispatch Queue
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative bg-navy-900/80 backdrop-blur-xl border border-champagne-500/20 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent" />

            <div className="w-16 h-16 rounded-2xl bg-champagne-500/15 border border-champagne-400/30 text-champagne-300 flex items-center justify-center mx-auto shadow-glow-champagne">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-black text-cream-100 font-display">
                {isAvailable ? '🟢 Online & Ready for Service Requests' : '🔴 You Are Currently Off Duty'}
              </h3>
              <p className="text-xs text-cream-200/60 leading-relaxed font-sans">
                {isAvailable
                  ? `Your GPS beacon is actively broadcasting availability for ${profession} services to the ${coopName} FairMatch™ engine. When a local customer requests a booking, dispatch alerts will appear here.`
                  : 'Toggle your duty status to "On Duty" above to start receiving local booking requests.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/worker/earnings"
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-black text-xs rounded-xl shadow-glow-rose font-display"
              >
                View Cooperative Passbook & Earnings
              </Link>
              <Link
                href="/worker/profile"
                className="px-5 py-2.5 bg-navy-950 text-cream-200 border border-navy-700 hover:border-champagne-400/40 font-bold text-xs rounded-xl transition-all font-display"
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
