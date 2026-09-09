"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Check
} from 'lucide-react';

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

export default function WorkerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [monthlyEarnings, setMonthlyEarnings] = useState(18450);
  const [welfarePoolBalance, setWelfarePoolBalance] = useState(7128);
  const [completedJobsCount, setCompletedJobsCount] = useState(142);
  const [countdown, setCountdown] = useState(45);

  // Active Job State
  const [currentJob, setCurrentJob] = useState<ActiveJob | null>({
    id: 'b-demo-1',
    orderNumber: 'ORD-8492',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    serviceTitle: 'Ceiling Fan & Switchboard Sparking Fix',
    serviceCategory: 'Electrical & Power',
    description: 'Ceiling fan speed controller smoking and buzzing; main bedroom switchboard sparking.',
    urgency: 'EMERGENCY_45_MIN',
    address: 'Flat 402, Hazratganj Heights, Hazratganj, Lucknow',
    distance: '1.8 km',
    baseWage: 400,
    welfareCess: 28,
    totalEarnings: 428,
    status: 'DISPATCHED',
    startOtp: '4829',
    completionOtp: '7103',
  });

  const [inputStartOtp, setInputStartOtp] = useState('');
  const [inputCompletionOtp, setInputCompletionOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [jobTimer, setJobTimer] = useState(18); // seconds elapsed in progress
  const [safetyChecklist, setSafetyChecklist] = useState({
    mcbSwitchedOff: true,
    safetyGlovesWorn: true,
    voltageTested: true,
  });

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
  const handleAcceptGig = () => {
    if (!currentJob) return;
    setCurrentJob({ ...currentJob, status: 'ASSIGNED' });
  };

  const handleDeclineGig = () => {
    // Cooperative member decline without penalty
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Worker Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            RK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Ramesh Kumar</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Level 4 Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified Electrician | Lucknow Labour Cooperative Society Ltd. (Reg: UP-LKO-COOP-2024-001)
            </p>
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
              onClick={() => setIsAvailable(!isAvailable)} 
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Direct Wallet Earnings</span>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">₹{monthlyEarnings.toLocaleString()}</span>
          <p className="text-[10px] text-emerald-700 font-semibold">100% Payout Credited Direct to Bank</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">7% Cooperative Health Shield</span>
            <HeartHandshake className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">₹{welfarePoolBalance.toLocaleString()}</span>
          <p className="text-[10px] text-slate-500">Cashless Hospital & Accident Cover</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Completed Gigs</span>
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{completedJobsCount}</span>
          <p className="text-[10px] text-slate-500">100% Fair Wage Settlement</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Member Reputation</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">4.9 / 5</span>
          <p className="text-[10px] text-slate-500">Based on 118 verified customer ratings</p>
        </div>
      </div>

      {/* ACTIVE JOB LIFECYCLE CONTROLLER */}
      {currentJob ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                  Live Cooperative Dispatch
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {currentJob.orderNumber}
                </span>
                {currentJob.urgency === 'EMERGENCY_45_MIN' && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 animate-pulse">
                    ⚡ 45-Min Express Dispatch
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">{currentJob.serviceTitle}</h2>
              <p className="text-xs text-slate-500">{currentJob.description}</p>
            </div>

            {/* Payout Tag */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Your Net Earnings</span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-2xl font-black text-emerald-900">₹{currentJob.baseWage}</span>
                <span className="text-[10px] font-bold text-teal-700">+₹{currentJob.welfareCess} welfare</span>
              </div>
            </div>
          </div>

          {/* STATE 1: DISPATCHED (Accept / Decline Timer) */}
          {currentJob.status === 'DISPATCHED' && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                    ⏱️ Auto-Cascades in {countdown}s
                  </span>
                  <h3 className="text-lg font-bold mt-2">New Customer Job Dispatched</h3>
                  <p className="text-xs text-slate-300">
                    Customer: <strong>{currentJob.customerName}</strong> ({currentJob.distance} away in {currentJob.address})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAcceptGig}
                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Accept Gig
                  </button>
                  <button
                    onClick={handleDeclineGig}
                    className="px-5 py-3.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-2xl transition-all"
                    title="No penalty on cooperative member score"
                  >
                    Decline / Pass
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Cooperative Non-Coercion Guarantee:</strong> Declining an order does NOT penalize your acceptance score or search ranking.
                </span>
              </div>
            </div>
          )}

          {/* STATE 2: ASSIGNED (En Route) */}
          {currentJob.status === 'ASSIGNED' && (
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    ● En Route to Customer Location
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">Navigate to Customer Doorstep</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-600" /> {currentJob.address}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${currentJob.customerPhone}`}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" /> Call Customer
                  </a>
                  <button
                    onClick={handleMarkArrived}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4" /> I Have Arrived at Doorstep
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: ARRIVED (Start OTP Verification) */}
          {currentJob.status === 'ARRIVED' && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Lock className="w-5 h-5 text-amber-600" />
                <span>Doorstep Anti-Fraud Handshake: Request Start OTP</span>
              </div>
              <p className="text-xs text-slate-600">
                Ask the customer ({currentJob.customerName}) to look at their ShramSetu app and provide their 4-digit <strong>Start OTP</strong> (Hint for demo: <code>{currentJob.startOtp}</code>).
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit OTP"
                  value={inputStartOtp}
                  onChange={(e) => setInputStartOtp(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-center text-lg font-black tracking-widest bg-white outline-none focus:ring-2 focus:ring-amber-500 w-48"
                />
                <button
                  onClick={handleValidateStartOtp}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow"
                >
                  Verify Start OTP & Begin Job
                </button>
              </div>

              {otpError && (
                <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> {otpError}
                </p>
              )}
            </div>
          )}

          {/* STATE 4: IN_PROGRESS (Execution Timer & Checklist) */}
          {currentJob.status === 'IN_PROGRESS' && (
            <div className="space-y-6">
              {/* Timer Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Job In Execution</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ⏱️ {formatTimer(jobTimer)} elapsed
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Cooperative Standards Active</span>
                </div>
              </div>

              {/* Safety & Protocol Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                  Mandatory Cooperative Safety Protocols
                </span>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.mcbSwitchedOff}
                    onChange={(e) => setSafetyChecklist({ ...safetyChecklist, mcbSwitchedOff: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Main Line Power MCB switched off before wire handling</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.safetyGlovesWorn}
                    onChange={(e) => setSafetyChecklist({ ...safetyChecklist, safetyGlovesWorn: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>ISI-marked insulated tools & rubber footwear utilized</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.voltageTested}
                    onChange={(e) => setSafetyChecklist({ ...safetyChecklist, voltageTested: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Earthing and voltage stability verified with tester</span>
                </label>
              </div>

              {/* Completion Handshake Box */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  <span>Work Finished: Request Completion OTP from Customer</span>
                </div>
                <p className="text-xs text-slate-600">
                  Demonstrate the working appliance/repair to the customer. Once satisfied, ask for the 4-digit <strong>Completion OTP</strong> (Hint for demo: <code>{currentJob.completionOtp}</code>).
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Completion OTP"
                    value={inputCompletionOtp}
                    onChange={(e) => setInputCompletionOtp(e.target.value)}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl text-center text-lg font-black tracking-widest bg-white outline-none focus:ring-2 focus:ring-emerald-500 w-48"
                  />
                  <button
                    onClick={handleValidateCompletionOtp}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    Submit Completion OTP & Settle Funds
                  </button>
                </div>

                {otpError && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> {otpError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STATE 5: COMPLETED (Settlement & Receipt) */}
          {currentJob.status === 'COMPLETED' && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Job Completed Successfully!</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">₹{currentJob.baseWage} Credited to Your Bank Account</h3>
                <p className="text-xs text-slate-600 mt-1">
                  100% of fair base wage transferred with zero platform commissions. ₹{currentJob.welfareCess} credited to your cooperative health shield pool.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 max-w-sm mx-auto text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Wage Received:</span>
                  <span className="font-bold text-slate-900">₹{currentJob.baseWage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cooperative Health Reserve Added:</span>
                  <span className="font-bold text-emerald-700">+₹{currentJob.welfareCess}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
                  <span className="text-slate-700">Total Worker Benefit:</span>
                  <span className="text-emerald-800">₹{currentJob.totalEarnings}</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentJob(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Close & Ready for Next Job
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">You Are Ready on Duty</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Your GPS is broadcasting active availability to the Lucknow Labour Cooperative Society matching engine. Incoming requests will alert here automatically.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentJob({
                id: `b-${Date.now()}`,
                orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                customerName: 'Priya Verma',
                customerPhone: '+91 98765 22446',
                serviceTitle: 'Kitchen Exhaust Fan & Regulator Replacement',
                serviceCategory: 'Electrical & Power',
                description: 'Exhaust fan stuck and regulator knob sparking intermittently.',
                urgency: 'EMERGENCY_45_MIN',
                address: 'C-24, Mahanagar Colony, Lucknow',
                distance: '2.4 km',
                baseWage: 450,
                welfareCess: 32,
                totalEarnings: 482,
                status: 'DISPATCHED',
                startOtp: '5914',
                completionOtp: '8241',
              });
              setCountdown(50);
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            ⚡ Simulate Incoming Cooperative Gig Alert
          </button>
        </div>
      )}
    </div>
  );
}
