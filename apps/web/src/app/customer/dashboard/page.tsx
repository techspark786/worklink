"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Mic,
  MicOff,
  Camera,
  Info,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  X,
  PhoneCall,
  Check
} from 'lucide-react';

interface WorkerCandidate {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  skills: string[];
  experienceYears: number;
  verificationLevel: number;
  isAvailable: boolean;
  serviceRadiusKm: number;
  hourlyRate: number;
  rating: number;
  totalCompletedJobs: number;
  welfareContributionTotal: number;
  insuranceActive: boolean;
  cooperativeName: string;
  distanceKm: number;
  distanceText: string;
  matchScore: number;
  matchBreakdown: {
    skillScore: number;
    distanceScore: number;
    availabilityScore: number;
    trustScore: number;
    experienceScore: number;
    totalScore: number;
  };
}

export default function CustomerDashboard() {
  const [problemQuery, setProblemQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'image'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [selectedUrgency, setSelectedUrgency] = useState<'SAME_DAY' | 'EMERGENCY_45_MIN' | 'SCHEDULED'>('SAME_DAY');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Hazratganj Heights, Hazratganj, Lucknow');
  
  // Modals state
  const [inspectWorker, setInspectWorker] = useState<WorkerCandidate | null>(null);
  const [bookingWorker, setBookingWorker] = useState<WorkerCandidate | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(null);

  // AI Classification state
  const [aiAnalysis, setAiAnalysis] = useState<{
    trade: string;
    detectedIssue: string;
    recommendedUrgency: string;
    statutoryMinimumWage: number;
    matchedSkills: string[];
  } | null>(null);

  // Workers state
  const [workers, setWorkers] = useState<WorkerCandidate[]>([
    {
      id: 'w1',
      _id: 'w1',
      name: 'Ramesh Kumar',
      skills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
      experienceYears: 7,
      verificationLevel: 4,
      isAvailable: true,
      serviceRadiusKm: 8,
      hourlyRate: 400,
      rating: 4.9,
      totalCompletedJobs: 142,
      welfareContributionTotal: 7100,
      insuranceActive: true,
      cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
      distanceKm: 1.8,
      distanceText: '1.8 km',
      matchScore: 96,
      matchBreakdown: {
        skillScore: 30,
        distanceScore: 25,
        availabilityScore: 20,
        trustScore: 13,
        experienceScore: 8,
        totalScore: 96,
      },
    },
    {
      id: 'w2',
      _id: 'w2',
      name: 'Suresh Chandra',
      skills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings', 'Water Tank Repair'],
      experienceYears: 5,
      verificationLevel: 3,
      isAvailable: true,
      serviceRadiusKm: 5,
      hourlyRate: 350,
      rating: 4.7,
      totalCompletedJobs: 89,
      welfareContributionTotal: 3950,
      insuranceActive: true,
      cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
      distanceKm: 3.2,
      distanceText: '3.2 km',
      matchScore: 88,
      matchBreakdown: {
        skillScore: 26,
        distanceScore: 22,
        availabilityScore: 20,
        trustScore: 11,
        experienceScore: 9,
        totalScore: 88,
      },
    },
    {
      id: 'w3',
      _id: 'w3',
      name: 'Rajesh Verma',
      skills: ['Woodwork', 'Furniture Assembly', 'Door & Window Locks', 'Hinges'],
      experienceYears: 8,
      verificationLevel: 5,
      isAvailable: true,
      serviceRadiusKm: 10,
      hourlyRate: 500,
      rating: 4.95,
      totalCompletedJobs: 210,
      welfareContributionTotal: 10500,
      insuranceActive: true,
      cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
      distanceKm: 4.5,
      distanceText: '4.5 km',
      matchScore: 92,
      matchBreakdown: {
        skillScore: 28,
        distanceScore: 22,
        availabilityScore: 20,
        trustScore: 15,
        experienceScore: 7,
        totalScore: 92,
      },
    },
    {
      id: 'w4',
      _id: 'w4',
      name: 'Amit Kumar',
      skills: ['AC Servicing', 'Gas Refill', 'Compressor Repair', 'Appliance Repair'],
      experienceYears: 6,
      verificationLevel: 4,
      isAvailable: false,
      serviceRadiusKm: 12,
      hourlyRate: 650,
      rating: 4.8,
      totalCompletedJobs: 135,
      welfareContributionTotal: 8775,
      insuranceActive: true,
      cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
      distanceKm: 5.8,
      distanceText: '5.8 km',
      matchScore: 74,
      matchBreakdown: {
        skillScore: 25,
        distanceScore: 18,
        availabilityScore: 0,
        trustScore: 13,
        experienceScore: 8,
        totalScore: 74,
      },
    },
  ]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle AI analysis
  const runAiAnalysis = (customQuery?: string) => {
    const textToAnalyze = customQuery || problemQuery;
    if (!textToAnalyze.trim()) return;

    const lower = textToAnalyze.toLowerCase();
    if (lower.includes('fan') || lower.includes('पंखा') || lower.includes('wire') || lower.includes('switch') || lower.includes('light')) {
      setAiAnalysis({
        trade: 'Electrician & Power Maintenance',
        detectedIssue: 'Ceiling Fan Regulator / Coil Burnout & High-Voltage Sparking',
        recommendedUrgency: 'EMERGENCY_45_MIN',
        statutoryMinimumWage: 380,
        matchedSkills: ['Electrical Wiring', 'Ceiling Fan Repair', 'MCB Fixing', 'Safety Protocols'],
      });
      setSelectedUrgency('EMERGENCY_45_MIN');
    } else if (lower.includes('pipe') || lower.includes('leak') || lower.includes('नल') || lower.includes('drain') || lower.includes('tap')) {
      setAiAnalysis({
        trade: 'Plumbing & Drainage Engineering',
        detectedIssue: 'Water Pipe Valve Joint Leakage & Pressure Washer Failure',
        recommendedUrgency: 'SAME_DAY',
        statutoryMinimumWage: 350,
        matchedSkills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings'],
      });
      setSelectedUrgency('SAME_DAY');
    } else if (lower.includes('carpenter') || lower.includes('door') || lower.includes('lock') || lower.includes('wood') || lower.includes('table')) {
      setAiAnalysis({
        trade: 'Carpentry & Woodwork Craft',
        detectedIssue: 'Internal Door Hinge Misalignment & Deadbolt Jamming',
        recommendedUrgency: 'SCHEDULED',
        statutoryMinimumWage: 450,
        matchedSkills: ['Woodwork', 'Furniture Assembly', 'Door & Window Locks'],
      });
      setSelectedUrgency('SCHEDULED');
    } else {
      setAiAnalysis({
        trade: 'General Home Maintenance',
        detectedIssue: 'General Household Appliance Inspection & Repair',
        recommendedUrgency: 'SAME_DAY',
        statutoryMinimumWage: 350,
        matchedSkills: ['Appliance Repair', 'Electrical Wiring', 'Sanitary Fittings'],
      });
    }
  };

  const handleSimulateVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const voiceText = "किचन का सीलिंग पंखा बहुत गर्म हो रहा है और उसमें से जलने की गंध आ रही है";
        setProblemQuery(voiceText);
        runAiAnalysis(voiceText);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSimulateImage = () => {
    setImageUploaded(true);
    const photoText = "Photo uploaded: Burnt electrical junction box with melted plastic insulation";
    setProblemQuery(photoText);
    runAiAnalysis(photoText);
  };

  const handleExecuteBooking = async (worker: WorkerCandidate) => {
    const baseWage = worker.hourlyRate;
    const welfareCess = Math.round(baseWage * 0.07);
    const platformFee = Math.round(baseWage * 0.05);
    const totalAmount = baseWage + welfareCess + platformFee;
    const savingsVsAggregator = Math.round(baseWage * 0.45);

    const bookingPayload = {
      customerId: 'cust-1',
      workerId: worker.id,
      workerName: worker.name,
      cooperativeName: worker.cooperativeName,
      serviceTitle: aiAnalysis?.trade || 'Local Cooperative Home Service',
      serviceCategory: worker.skills[0] || 'Household Maintenance',
      description: problemQuery || 'Urgent home repair requested through ShramSetu AI discovery portal.',
      urgency: selectedUrgency,
      scheduledDate: new Date().toISOString().split('T')[0],
      timeSlot: selectedUrgency === 'EMERGENCY_45_MIN' ? 'Immediate (45 Min Express)' : '02:00 PM - 04:00 PM',
      customerLocation: {
        address: customerAddress,
        city: 'Lucknow',
        pincode: '226001',
      },
      baseWage,
      matchScore: worker.matchScore,
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();
      setBookingSuccessData(data.booking || {
        ...bookingPayload,
        startOtp: '4829',
        completionOtp: '7103',
        pricing: { baseWage, welfareCess, platformFee, totalAmount, savingsVsAggregator }
      });
    } catch (e) {
      // Offline fallback
      setBookingSuccessData({
        _id: `b-${Date.now()}`,
        ...bookingPayload,
        startOtp: '4829',
        completionOtp: '7103',
        pricing: { baseWage, welfareCess, platformFee, totalAmount, savingsVsAggregator }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Customer Context & Location */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Cooperative Consumer Portal
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Geolocation Matching Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Find Trusted, Cooperative-Verified Local Workforce
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Serving Area: <strong>Hazratganj, Lucknow</strong> (Coordinates: 26.8467° N, 80.9462° E)</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customer/bookings"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-600" /> View My Bookings
          </Link>

          <button
            onClick={() => {
              setSelectedUrgency('EMERGENCY_45_MIN');
              setProblemQuery('Emergency short circuit in main switchboard with smoke');
              runAiAnalysis('Emergency short circuit in main switchboard with smoke');
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" /> 45-Min Emergency Worker
          </button>
        </div>
      </div>

      {/* AI Multi-Modal Requirement Parsing Studio */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                AI Service Requirement Understanding Engine
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  SIH Voice & Vision Core
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Explain what is broken in Hindi, English, or upload a photo. AI maps your problem to certified cooperative trades.
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'text' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Text Description
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'voice' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> Voice Memo (हिन्दी)
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'image' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Vision Upload
            </button>
          </div>
        </div>

        {/* Dynamic Mode Controls */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. 'Ceiling fan making loud noise and sparking', 'Washbasin pipe joint leaking'..."
                  value={problemQuery}
                  onChange={(e) => setProblemQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAiAnalysis()}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>
              <button
                onClick={() => runAiAnalysis()}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg shrink-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> AI Diagnose & Match
              </button>
            </div>

            {/* Quick Sample Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Try:</span>
              <button
                onClick={() => {
                  const q = "Ceiling fan speed controller smoking and buzzing";
                  setProblemQuery(q);
                  runAiAnalysis(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                ⚡ Ceiling fan smoking
              </button>
              <button
                onClick={() => {
                  const q = "Kitchen sink drainage pipe leaking water onto cabinet";
                  setProblemQuery(q);
                  runAiAnalysis(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                🚰 Sink drainage leak
              </button>
              <button
                onClick={() => {
                  const q = "Heavy wooden door lock jammed and hinges crooked";
                  setProblemQuery(q);
                  runAiAnalysis(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                🪚 Jammed door lock
              </button>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <Mic className="w-4 h-4 text-emerald-400" /> Vernacular Voice AI Engine (Hindi / Awadhi / Bhojpuri)
              </h3>
              <p className="text-xs text-slate-300">
                Workers and customers can speak naturally. Press record to capture your problem audio note.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isRecording && (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  Listening... 00:0{recordingSeconds}s
                </div>
              )}
              <button
                onClick={handleSimulateVoice}
                className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Stop & Process Voice' : 'Simulate Voice Note'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" /> Computer Vision Defect Diagnostics
              </h3>
              <p className="text-xs text-slate-300">
                Snap or upload a photo of the leaking valve, short-circuit board, or damaged door.
              </p>
            </div>

            <button
              onClick={handleSimulateImage}
              className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Camera className="w-4 h-4" />
              {imageUploaded ? 'Image Analyzed (Re-upload)' : 'Simulate Photo Upload'}
            </button>
          </div>
        )}

        {/* AI Requirement Diagnostic Card */}
        {aiAnalysis && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-xs space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-black text-emerald-400 text-sm">AI Diagnosis Generated</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300 font-semibold">{aiAnalysis.trade}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Recommended Urgency: {aiAnalysis.recommendedUrgency}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Fair Wage Floor: ≥₹{aiAnalysis.statutoryMinimumWage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Root Cause</span>
                <p className="text-white font-medium mt-0.5">{aiAnalysis.detectedIssue}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Competencies</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {aiAnalysis.matchedSkills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-medium border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Statutory Protection
                </span>
                <p className="text-[11px] text-slate-300 mt-1">
                  Rate strictly conforms to UP Govt Gazette Fair Labour Standards. No hidden platform markup.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI FairMatch Ranked Workers Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              FairMatch™ Cooperative Workforce Matches <Sparkles className="w-5 h-5 text-emerald-600" />
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by transparent 5-factor algorithm: Skill (30%) + Proximity (25%) + Availability (20%) + Verification (15%) + Track Record (10%)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Urgency Mode:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedUrgency('SAME_DAY')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedUrgency === 'SAME_DAY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Same Day
              </button>
              <button
                onClick={() => setSelectedUrgency('EMERGENCY_45_MIN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedUrgency === 'EMERGENCY_45_MIN' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                45-Min Express
              </button>
              <button
                onClick={() => setSelectedUrgency('SCHEDULED')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedUrgency === 'SCHEDULED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Scheduled
              </button>
            </div>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-6 space-y-5 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                      {worker.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg text-slate-900">{worker.name}</h3>
                        <span 
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black flex items-center gap-1"
                          title="Cooperative Verification Level"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Level {worker.verificationLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{worker.cooperativeName}</p>
                    </div>
                  </div>

                  {/* FairMatch Score Badge */}
                  <div className="text-right">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-black inline-flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {worker.matchScore}% FairMatch
                    </div>
                    <button
                      onClick={() => setInspectWorker(worker)}
                      className="block text-[11px] font-bold text-slate-500 hover:text-emerald-700 underline mt-1 ml-auto"
                    >
                      Inspect Breakdown
                    </button>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Distance</span>
                    <span className="font-black text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {worker.distanceText}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                    <span className="font-black text-amber-600 flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {worker.rating}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Experience</span>
                    <span className="font-black text-slate-800 mt-0.5 block">{worker.experienceYears} Years</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Duty Status</span>
                    <span className={`font-black text-[11px] mt-0.5 block ${worker.isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {worker.isAvailable ? '● Ready' : '○ Busy'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing & Booking Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Transparent Fair Base Wage</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900">₹{worker.hourlyRate}</span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      100% to Worker
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBookingWorker(worker)}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow hover:shadow-md flex items-center gap-1.5"
                  >
                    Book Cooperative Worker
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSPECT FAIRMATCH SCORE MODAL */}
      {inspectWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Algorithm Transparency</span>
                <h3 className="text-xl font-black text-slate-900">FairMatch™ Score Breakdown</h3>
                <p className="text-xs text-slate-500">Worker: {inspectWorker.name} ({inspectWorker.cooperativeName})</p>
              </div>
              <button
                onClick={() => setInspectWorker(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900">Total FairMatch Score</span>
                <p className="text-xs text-emerald-700">Multi-objective algorithmic fairness score</p>
              </div>
              <span className="text-3xl font-black text-emerald-700">{inspectWorker.matchBreakdown.totalScore}%</span>
            </div>

            {/* 5-Pillar Breakdown Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>1. Skill Overlap & Repertoire (30%)</span>
                  <span>{inspectWorker.matchBreakdown.skillScore} / 30 pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(inspectWorker.matchBreakdown.skillScore / 30) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>2. Distance Proximity & Haversine Decay (25%)</span>
                  <span>{inspectWorker.matchBreakdown.distanceScore} / 25 pts ({inspectWorker.distanceText})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${(inspectWorker.matchBreakdown.distanceScore / 25) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>3. Immediate Duty Availability (20%)</span>
                  <span>{inspectWorker.matchBreakdown.availabilityScore} / 20 pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(inspectWorker.matchBreakdown.availabilityScore / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>4. Cooperative Verification & Trust Level (15%)</span>
                  <span>{inspectWorker.matchBreakdown.trustScore} / 15 pts (Level {inspectWorker.verificationLevel})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(inspectWorker.matchBreakdown.trustScore / 15) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>5. Experience & Job Track Record (10%)</span>
                  <span>{inspectWorker.matchBreakdown.experienceScore} / 10 pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(inspectWorker.matchBreakdown.experienceScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <strong className="text-slate-800">Cooperative Guarantee:</strong>
              <p>
                Unlike proprietary algorithms that prioritize company margins, FairMatch is an open, auditable algorithm ensuring equitable job allocation among all cooperative society members.
              </p>
            </div>

            <button
              onClick={() => {
                const w = inspectWorker;
                setInspectWorker(null);
                setBookingWorker(w);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all shadow"
            >
              Proceed to Book Worker
            </button>
          </div>
        </div>
      )}

      {/* BOOKING INITIATION MODAL */}
      {bookingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Direct Cooperative Booking</span>
                <h3 className="text-xl font-black text-slate-900">Confirm Service Request</h3>
              </div>
              <button
                onClick={() => setBookingWorker(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Worker summary */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                {bookingWorker.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{bookingWorker.name}</h4>
                <p className="text-xs text-slate-500">{bookingWorker.cooperativeName}</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Cooperative Verified Member (Level {bookingWorker.verificationLevel})
                </span>
              </div>
            </div>

            {/* Service & Location fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Required</label>
                <input
                  type="text"
                  value={aiAnalysis?.trade || 'Electrician / Appliance Repair'}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={selectedUrgency}
                    onChange={(e: any) => setSelectedUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold"
                  >
                    <option value="SAME_DAY">Same Day Dispatch</option>
                    <option value="EMERGENCY_45_MIN">⚡ 45-Min Emergency</option>
                    <option value="SCHEDULED">Scheduled Tomorrow</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Window</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold">
                    {selectedUrgency === 'EMERGENCY_45_MIN' ? 'Immediate (<45 min)' : '02:00 PM - 04:00 PM'}
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Bill Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Worker Base Wage (100% directly to worker):</span>
                <span className="font-bold text-white">₹{bookingWorker.hourlyRate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cooperative Welfare Cess (7% pension/health):</span>
                <span className="font-bold text-white">₹{Math.round(bookingWorker.hourlyRate * 0.07)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Digital Platform & GST (5% ops):</span>
                <span className="font-bold text-white">₹{Math.round(bookingWorker.hourlyRate * 0.05)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm">
                <span className="text-emerald-400">Total Transparent Amount:</span>
                <span className="text-emerald-400">
                  ₹{bookingWorker.hourlyRate + Math.round(bookingWorker.hourlyRate * 0.07) + Math.round(bookingWorker.hourlyRate * 0.05)}
                </span>
              </div>

              {/* Private Aggregator comparison banner */}
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Cooperative Advantage:</strong> You save ₹{Math.round(bookingWorker.hourlyRate * 0.45)} vs private corporate gig apps, while worker earns ₹120 more!
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const w = bookingWorker;
                setBookingWorker(null);
                handleExecuteBooking(w);
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Confirm & Issue Booking OTPs
            </button>
          </div>
        </div>
      )}

      {/* BOOKING SUCCESS CONFIRMATION MODAL */}
      {bookingSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Booking Confirmed!</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Worker Has Been Notified</h3>
              <p className="text-xs text-slate-500 mt-1">
                {bookingSuccessData.workerName} from {bookingSuccessData.cooperativeName} is preparing for dispatch.
              </p>
            </div>

            {/* OTP Display Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                Doorstep Security Handshake
              </span>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-400 block">Start Job OTP</span>
                  <span className="text-2xl font-black tracking-widest text-emerald-400">
                    {bookingSuccessData.startOtp || '4829'}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Completion OTP</span>
                  <span className="text-2xl font-black tracking-widest text-amber-400">
                    {bookingSuccessData.completionOtp || '7103'}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Share the Start OTP with the worker when they arrive, and Completion OTP only after satisfactory work.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/customer/bookings"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all shadow"
              >
                Track Live Booking Status ➔
              </Link>
              <button
                onClick={() => setBookingSuccessData(null)}
                className="w-full py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
