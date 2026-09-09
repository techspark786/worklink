"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowLeft, 
  PlusCircle, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Check, 
  AlertCircle,
  X
} from 'lucide-react';

interface InstitutionalContract {
  id: string;
  contractNumber: string;
  clientName: string;
  clientType: string;
  title: string;
  description: string;
  category: string;
  requiredHeadcount: number;
  deployedHeadcount: number;
  duration: string;
  totalContractValue: number;
  statutoryMinimumDayRate: number;
  status: 'ACTIVE_DEPLOYMENT' | 'FULLY_DEPLOYED' | 'OPEN_REQUISITION';
  assignedSocieties: {
    name: string;
    quota: number;
    filled: number;
  }[];
  complianceAudited: boolean;
  issuedDate: string;
}

export default function FederationContractsPage() {
  const [contracts, setContracts] = useState<InstitutionalContract[]>([
    {
      id: 'cnt-1',
      contractNumber: 'UP-GOV-MUNICIPAL-2026-081',
      clientName: 'Lucknow Municipal Corporation (Nagar Nigam)',
      clientType: 'MUNICIPAL_GOVERNMENT',
      title: 'Monsoon Storm Drainage De-silting & Ward Sanitation Works',
      description: 'Specialized drainage clearing, silt extraction, and sewer desilting across Zone 1 and Zone 3 wards.',
      category: 'Sanitation & Civil Maintenance',
      requiredHeadcount: 50,
      deployedHeadcount: 42,
      duration: '30 Days',
      totalContractValue: 750000,
      statutoryMinimumDayRate: 500,
      status: 'ACTIVE_DEPLOYMENT',
      assignedSocieties: [
        { name: 'Lucknow Labour Cooperative Society Ltd.', quota: 30, filled: 28 },
        { name: 'Lucknow Mahila Shramik Sahakari Samiti', quota: 20, filled: 14 }
      ],
      complianceAudited: true,
      issuedDate: '2026-08-15',
    },
    {
      id: 'cnt-2',
      contractNumber: 'RWA-LKO-HAZRAT-2026-012',
      clientName: 'Hazratganj Residents Welfare Association (RWA)',
      clientType: 'HOUSING_SOCIETY_CONSORTIUM',
      title: 'Annual Comprehensive Electrical & Plumbing Retainer Contract',
      description: 'On-demand 24x7 electrical and plumbing emergency care for 640 apartment units in Hazratganj zone.',
      category: 'Multi-Trade Facility Maintenance',
      requiredHeadcount: 12,
      deployedHeadcount: 12,
      duration: '12 Months (Retainer)',
      totalContractValue: 2160000,
      statutoryMinimumDayRate: 600,
      status: 'FULLY_DEPLOYED',
      assignedSocieties: [
        { name: 'Lucknow Labour Cooperative Society Ltd.', quota: 12, filled: 12 }
      ],
      complianceAudited: true,
      issuedDate: '2026-06-01',
    },
    {
      id: 'cnt-3',
      contractNumber: 'KGMU-CAMPUS-2026-044',
      clientName: 'King George Medical University (KGMU)',
      clientType: 'PUBLIC_INSTITUTION',
      title: 'Hospital Complex Sanitation, Sanitization & Facility Care',
      description: 'Cleanroom sanitation, waste handling, and general campus hygiene maintenance.',
      category: 'Healthcare Facility Hygiene',
      requiredHeadcount: 30,
      deployedHeadcount: 15,
      duration: '60 Days',
      totalContractValue: 1080000,
      statutoryMinimumDayRate: 600,
      status: 'OPEN_REQUISITION',
      assignedSocieties: [
        { name: 'Lucknow Mahila Shramik Sahakari Samiti', quota: 30, filled: 15 }
      ],
      complianceAudited: true,
      issuedDate: '2026-09-01',
    }
  ]);

  // Modal States
  const [selectedContractForQuota, setSelectedContractForQuota] = useState<InstitutionalContract | null>(null);
  const [quotaSocietyName, setQuotaSocietyName] = useState('Lucknow Labour Cooperative Society Ltd.');
  const [quotaCount, setQuotaCount] = useState('8');

  const [tenderModalOpen, setTenderModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientType, setNewClientType] = useState('MUNICIPAL_GOVERNMENT');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHeadcount, setNewHeadcount] = useState('20');
  const [newDuration, setNewDuration] = useState('45 Days');
  const [newValue, setNewValue] = useState('450000');
  const [successToast, setSuccessToast] = useState('');

  // Fetch contracts from backend
  useEffect(() => {
    async function fetchContracts() {
      try {
        const res = await fetch('http://localhost:5000/api/federation/contracts');
        if (res.ok) {
          const data = await res.json();
          if (data.contracts && data.contracts.length > 0) {
            setContracts(data.contracts);
          }
        }
      } catch (e) {
        // default mock
      }
    }
    fetchContracts();
  }, []);

  const handleAssignQuota = async () => {
    if (!selectedContractForQuota) return;
    const addCount = Number(quotaCount) || 5;

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContractForQuota.id) {
          const newDeployed = Math.min(c.requiredHeadcount, c.deployedHeadcount + addCount);
          return {
            ...c,
            deployedHeadcount: newDeployed,
            status: newDeployed >= c.requiredHeadcount ? 'FULLY_DEPLOYED' : 'ACTIVE_DEPLOYMENT',
            assignedSocieties: [
              ...c.assignedSocieties,
              { name: quotaSocietyName, quota: addCount, filled: addCount },
            ],
          };
        }
        return c;
      })
    );

    setSuccessToast(`Allocated ${addCount} workers from ${quotaSocietyName}.`);
    setSelectedContractForQuota(null);

    try {
      await fetch(`http://localhost:5000/api/federation/contracts/${selectedContractForQuota.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ societyName: quotaSocietyName, quotaCount: addCount }),
      });
    } catch (e) {
      // offline
    }
  };

  const handleCreateTender = async () => {
    if (!newClientName || !newTitle) return;

    const newTender: InstitutionalContract = {
      id: `cnt-${Date.now()}`,
      contractNumber: `FED-TENDER-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newClientName,
      clientType: newClientType,
      title: newTitle,
      description: newDescription || 'Institutional bulk workforce requisition.',
      category: 'Institutional Facility Management',
      requiredHeadcount: Number(newHeadcount) || 20,
      deployedHeadcount: 0,
      duration: newDuration,
      totalContractValue: Number(newValue) || 400000,
      statutoryMinimumDayRate: 500,
      status: 'OPEN_REQUISITION',
      assignedSocieties: [],
      complianceAudited: true,
      issuedDate: new Date().toISOString().split('T')[0],
    };

    setContracts([newTender, ...contracts]);
    setTenderModalOpen(false);
    setSuccessToast(`New institutional tender '${newTitle}' published to federation consortia.`);

    try {
      await fetch('http://localhost:5000/api/federation/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTender),
      });
    } catch (e) {
      // offline
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Link
            href="/federation/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Federation Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Institutional & Government Bulk Procurement Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              B2B & Public Sector
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enabling Municipal Bodies (Nagar Nigam), Resident Welfare Associations, Universities, and Hospitals to contract certified cooperative workforce consortia with statutory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTenderModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <PlusCircle className="w-4 h-4" /> Issue Institutional RFP / Tender
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Active Tenders & Contracts</span>
          <span className="text-3xl font-black text-slate-900 block">{contracts.length}</span>
          <span className="text-[10px] text-emerald-600 font-bold">100% Consortium Backed</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Deployed Member Workforce</span>
          <span className="text-3xl font-black text-slate-900 block">
            {contracts.reduce((acc, c) => acc + c.deployedHeadcount, 0)} Workers
          </span>
          <span className="text-[10px] text-slate-500">Across 18 Cooperatives</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Bulk Contract Value</span>
          <span className="text-3xl font-black text-emerald-600 block">
            ₹{(contracts.reduce((acc, c) => acc + c.totalContractValue, 0) / 100000).toFixed(1)} Lakh
          </span>
          <span className="text-[10px] text-slate-500">Zero Middleman Cut</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Statutory Assurance</span>
          <span className="text-3xl font-black text-slate-900 block flex items-center gap-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600" /> 100%
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">ESIC, EPFO, Gazette Wage Compliant</span>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Current Institutional Requisitions</h2>
          <span className="text-xs font-bold text-slate-400">Open to All Affiliated Societies</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {contracts.map((contract) => {
            const fillPercentage = Math.min(100, Math.round((contract.deployedHeadcount / contract.requiredHeadcount) * 100));

            return (
              <div
                key={contract.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 transition-all p-6 sm:p-8 space-y-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold font-mono">
                        {contract.contractNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        {contract.clientType.replace('_', ' ')}
                      </span>
                      {contract.status === 'FULLY_DEPLOYED' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          ✓ Quota Fully Deployed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold animate-pulse">
                          ● Open for Society Quota
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{contract.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Client: <strong>{contract.clientName}</strong> • Category: {contract.category}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                      {contract.description}
                    </p>
                  </div>

                  {/* Value & Day Rate */}
                  <div className="text-right shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Contract Value</span>
                    <span className="text-2xl font-black text-emerald-700 block">
                      ₹{contract.totalContractValue.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block mt-0.5">
                      ₹{contract.statutoryMinimumDayRate}/day statutory wage floor
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Deployment */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Workforce Deployment Quota: {contract.deployedHeadcount} of {contract.requiredHeadcount} Workers</span>
                    <span>{fillPercentage}% Fulfilled</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        fillPercentage >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Assigned Societies & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Assigned Member Societies:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {contract.assignedSocieties.length > 0 ? (
                        contract.assignedSocieties.map((soc, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            {soc.name} ({soc.filled} Workers)
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No society quotas allocated yet</span>
                      )}
                    </div>
                  </div>

                  {contract.status !== 'FULLY_DEPLOYED' && (
                    <button
                      onClick={() => setSelectedContractForQuota(contract)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" /> Allocate Cooperative Quota
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALLOCATE QUOTA MODAL */}
      {selectedContractForQuota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Federation Consortium Deployment</span>
                <h3 className="text-xl font-black text-slate-900">Allocate Cooperative Quota</h3>
                <p className="text-xs text-slate-500">{selectedContractForQuota.title}</p>
              </div>
              <button
                onClick={() => setSelectedContractForQuota(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Member Society</label>
                <select
                  value={quotaSocietyName}
                  onChange={(e) => setQuotaSocietyName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Lucknow Labour Cooperative Society Ltd.">Lucknow Labour Cooperative Society Ltd. (Electricians & Plumbers)</option>
                  <option value="Lucknow Mahila Shramik Sahakari Samiti">Lucknow Mahila Shramik Sahakari Samiti (Sanitation & Housekeeping)</option>
                  <option value="Kanpur Skill Workers Cooperative Society">Kanpur Skill Workers Cooperative Society (Woodwork & Carpentry)</option>
                  <option value="Varanasi Janhit Sahakari Samiti">Varanasi Janhit Sahakari Samiti (Civil & Masons)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Worker Headcount Quota (Remaining: {selectedContractForQuota.requiredHeadcount - selectedContractForQuota.deployedHeadcount})
                </label>
                <input
                  type="number"
                  max={selectedContractForQuota.requiredHeadcount - selectedContractForQuota.deployedHeadcount}
                  min={1}
                  value={quotaCount}
                  onChange={(e) => setQuotaCount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Statutory Protection Clause
                </span>
                <p>
                  Deploying workers under this institutional contract guarantees direct statutory minimum wage payments of ₹{selectedContractForQuota.statutoryMinimumDayRate}/day, zero commission deductions, and accident insurance coverage.
                </p>
              </div>
            </div>

            <button
              onClick={handleAssignQuota}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow"
            >
              Confirm Quota Allocation
            </button>
          </div>
        </div>
      )}

      {/* CREATE NEW TENDER RFP MODAL */}
      {tenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Institutional Bulk Procurement</span>
                <h3 className="text-xl font-black text-slate-900">Post Institutional Workforce RFP</h3>
              </div>
              <button
                onClick={() => setTenderModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Organization / Buyer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lucknow Smart City Limited, Aliganj RWA..."
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Buyer Category</label>
                  <select
                    value={newClientType}
                    onChange={(e) => setNewClientType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="MUNICIPAL_GOVERNMENT">Municipal Government (Nagar Nigam)</option>
                    <option value="HOUSING_SOCIETY_CONSORTIUM">Housing Society (RWA)</option>
                    <option value="PUBLIC_INSTITUTION">Public Hospital / University</option>
                    <option value="COMMERCIAL_ENTERPRISE">Commercial Enterprise / PSU</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contract Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 Days, 12 Months"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contract Tender Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ward Sanitation & Waste Segregation Retainer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Headcount</label>
                  <input
                    type="number"
                    value={newHeadcount}
                    onChange={(e) => setNewHeadcount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Contract Budget (₹)</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Scope of Work</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe the operational requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateTender}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow"
            >
              Publish Institutional RFP to Federation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
