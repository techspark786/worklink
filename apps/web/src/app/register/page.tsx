"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Wrench, 
  MapPin, 
  Briefcase, 
  Clock, 
  FileText, 
  Building2, 
  Award,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PROFESSIONS = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'AC Technician',
  'Cleaner & Sanitation',
  'Painter',
  'Domestic Helper',
  'Appliance Repair',
  'General Maintenance',
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Electrician': ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
  'Plumber': ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings', 'Water Tank Repair'],
  'Carpenter': ['Woodwork', 'Furniture Assembly', 'Door & Window Locks', 'Hinges'],
  'AC Technician': ['AC Servicing', 'Gas Refill', 'Compressor Repair', 'Appliance Repair'],
  'Cleaner & Sanitation': ['Deep House Cleaning', 'Sanitization', 'Floor Polishing', 'Kitchen Hygiene'],
  'Painter': ['Wall Painting', 'Waterproof Coating', 'Texture Art', 'Putty Finishing'],
  'Domestic Helper': ['Daily Housekeeping', 'Cooking Assistance', 'Elderly Care', 'Kitchen Assistance'],
  'Appliance Repair': ['Washing Machine', 'Microwave Repair', 'Refrigerator', 'RO Purifier'],
  'General Maintenance': ['Handyman Repairs', 'General Maintenance', 'Fixture Installation'],
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<'CUSTOMER' | 'WORKER' | 'COOPERATIVE_ADMIN' | 'FEDERATION_ADMIN'>('CUSTOMER');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lucknow');
  const [pincode, setPincode] = useState('226001');

  // Worker-specific Fields
  const [profession, setProfession] = useState('Electrician');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(SKILL_SUGGESTIONS['Electrician']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(400);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(8);
  const [isAvailable, setIsAvailable] = useState(true);
  const [about, setAbout] = useState('');

  // Admin-specific Fields
  const [cooperativeName, setCooperativeName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfessionChange = (newProf: string) => {
    setProfession(newProf);
    if (SKILL_SUGGESTIONS[newProf]) {
      setSelectedSkills(SKILL_SUGGESTIONS[newProf]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(customSkillInput.trim())) {
        setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      }
      setCustomSkillInput('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const payload: any = {
      name,
      email,
      password,
      role,
      phone,
      address,
      city,
      pincode,
    };

    if (role === 'WORKER') {
      payload.profession = profession;
      payload.skills = selectedSkills;
      payload.experienceYears = Number(experienceYears);
      payload.hourlyRate = Number(hourlyRate);
      payload.serviceRadiusKm = Number(serviceRadiusKm);
      payload.isAvailable = isAvailable;
      payload.about = about || `Certified ${profession} with ${experienceYears} years of experience in ${city}.`;
    } else if (role === 'COOPERATIVE_ADMIN') {
      payload.cooperativeName = cooperativeName || 'Labour Cooperative Society';
      payload.registrationNumber = registrationNumber || 'UP-LKO-COOP-2026';
    } else if (role === 'FEDERATION_ADMIN') {
      payload.cooperativeName = 'State Apex Federation of Labour Cooperatives';
      payload.registrationNumber = 'FED-APEX-UP-2026';
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed. Please check details and try again.');
      }

      // Establish authenticated session
      login(data.token, data.user);

      // Redirect to role dashboard
      if (role === 'WORKER') {
        router.push('/worker/dashboard');
      } else if (role === 'COOPERATIVE_ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'FEDERATION_ADMIN') {
        router.push('/federation/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Please ensure backend server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Create ShramSetu Account</h1>
          <p className="text-xs sm:text-sm text-slate-500">Join the cooperative-powered local service ecosystem</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2.5 rounded-xl transition-all ${role === 'CUSTOMER' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('WORKER')}
            className={`py-2.5 rounded-xl transition-all ${role === 'WORKER' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🛠️ Worker
          </button>
          <button
            type="button"
            onClick={() => setRole('COOPERATIVE_ADMIN')}
            className={`py-2.5 rounded-xl transition-all ${role === 'COOPERATIVE_ADMIN' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🏢 Coop Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('FEDERATION_ADMIN')}
            className={`py-2.5 rounded-xl transition-all ${role === 'FEDERATION_ADMIN' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🏛️ Federation
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Section 1: Account Credentials */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Basic Credentials
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Location & Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doorstep / Street Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Green Park Avenue"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Worker Specific Profile Setup */}
          {role === 'WORKER' && (
            <div className="space-y-4 pt-3 border-t border-slate-100 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Worker Trade & Competency Profile
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Profession / Service Category
                  </label>
                  <select
                    value={profession}
                    onChange={(e) => handleProfessionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {PROFESSIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hourly Rate (₹)
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={25}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills checklist & tag selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specific Skills & Proficiencies (Select or type custom)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(SKILL_SUGGESTIONS[profession] || []).map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Type additional skill and press Enter..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={handleAddCustomSkill}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Service Radius & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Radius (km): <span className="text-emerald-700 font-bold">{serviceRadiusKm} km</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={30}
                    value={serviceRadiusKm}
                    onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="isAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Available for Immediate Gigs (On Duty)
                  </label>
                </div>
              </div>

              {/* About / Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  About You / Work Experience Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your practical experience, past projects, or cooperative background..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Section 4: Coop Admin Specific Profile Setup */}
          {role === 'COOPERATIVE_ADMIN' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Cooperative Society Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cooperative Society Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lucknow Labour Cooperative Society Ltd."
                    value={cooperativeName}
                    onChange={(e) => setCooperativeName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Certificate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="UP-LKO-COOP-2024-001"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account & Setting Up Profile...</span>
              </>
            ) : (
              <span>Complete Registration & Open Dashboard</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
