"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  Briefcase, 
  Award, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  FileCheck
} from 'lucide-react';

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('Ramesh Kumar');
  const [cooperative, setCooperative] = useState('Lucknow Labour Cooperative Society Ltd.');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Electrical Wiring', 'MCB Fixing']);
  const [experience, setExperience] = useState('7');
  const [radius, setRadius] = useState('8');
  const [rate, setRate] = useState('400');

  // Certification Metadata
  const [certTitle, setCertTitle] = useState('ITI Electrical Certificate');
  const [certIssuer, setCertIssuer] = useState('Govt ITI Lucknow');
  const [certNum, setCertNum] = useState('ITI-UP-2021-88492');

  const [declarationSigned, setDeclarationSigned] = useState(true);

  const availableSkills = [
    'Electrical Wiring', 'MCB Fixing', 'Fan Repair', 'Safety Protocols',
    'Pipe Repair', 'Leakage Detection', 'Drainage', 'Sanitary Fittings',
    'Furniture Assembly', 'Lock Repair', 'Door Fixing', 'Painting', 'Deep Cleaning'
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/worker/profile');
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Wizard Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Worker Registration & Verification Wizard</h1>
          <p className="text-xs text-slate-500">Join your local Labour Cooperative Society & declare your skills</p>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`p-2 rounded-xl border transition-all ${step === 1 ? 'bg-emerald-600 text-white border-emerald-700 shadow' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            1. Coop & Trade
          </div>
          <div className={`p-2 rounded-xl border transition-all ${step === 2 ? 'bg-emerald-600 text-white border-emerald-700 shadow' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            2. Skills & Rate
          </div>
          <div className={`p-2 rounded-xl border transition-all ${step === 3 ? 'bg-emerald-600 text-white border-emerald-700 shadow' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            3. Certificates
          </div>
          <div className={`p-2 rounded-xl border transition-all ${step === 4 ? 'bg-emerald-600 text-white border-emerald-700 shadow' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            4. Self-Declare
          </div>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">

          {/* STEP 1: Cooperative Affiliation & Basic */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Step 1: Cooperative Affiliation
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Labour Cooperative Society</label>
                <select
                  value={cooperative}
                  onChange={(e) => setCooperative(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Lucknow Labour Cooperative Society Ltd.">Lucknow Labour Cooperative Society Ltd. (Reg: UP-LKO-COOP-2024-001)</option>
                  <option value="Kanpur Skill Workers Cooperative Federation">Kanpur Skill Workers Cooperative Federation (Reg: UP-KNP-FED-2023-088)</option>
                  <option value="Varanasi Local Artisans & Labour Society">Varanasi Local Artisans & Labour Society (Reg: UP-VNS-2022-104)</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  Next: Skills & Rates <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & Pricing */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" /> Step 2: Trade Skills & Service Rates
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Tag Your Trade Skills</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((sk) => {
                    const isSelected = selectedSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Radius (km)</label>
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  Next: Certifications <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Certifications Metadata */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" /> Step 3: Certification Metadata (For Level 4 Verification)
              </h2>

              <p className="text-xs text-slate-500">
                Upload certification details to receive the Cooperative Admin Level 4 Verification Seal.
              </p>

              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate Title</label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. ITI Electrical Trade Certificate"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="e.g. Govt ITI Lucknow / NSDC Skill India"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate / Roll Number</label>
                  <input
                    type="text"
                    value={certNum}
                    onChange={(e) => setCertNum(e.target.value)}
                    placeholder="e.g. ITI-UP-2021-88492"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  Next: Self-Declaration <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Mandatory Self Declaration */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" /> Step 4: Mandatory Self-Declaration
              </h2>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2 leading-relaxed">
                <p className="font-bold">I hereby declare that:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>The professional skills, experience, and certification details submitted are true and authentic.</li>
                  <li>I am a registered member of the selected Labour Cooperative Society.</li>
                  <li>I agree to adhere to cooperative fair wage guidelines and democratic governance policies.</li>
                  <li>5% of my gross earnings will be automatically pooled into member health & emergency welfare funds.</li>
                </ul>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={declarationSigned}
                  onChange={(e) => setDeclarationSigned(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                I agree to the Self-Declaration terms and request profile verification.
              </label>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!declarationSigned}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Complete Onboarding & View Profile
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
