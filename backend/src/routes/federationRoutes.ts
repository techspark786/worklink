import { Router, Request, Response } from 'express';

const router = Router();

const statewideOverview = {
  federationName: 'Uttar Pradesh Labour Cooperative Federation (UPLCF)',
  registrationNumber: 'UP-STATE-FED-2022-004',
  headquarters: 'Lucknow, Uttar Pradesh',
  affiliatedSocietiesCount: 18,
  districtsCovered: 12,
  totalRegisteredWorkers: 1420,
  activeDutyWorkers: 1264,
  cumulativeGmv: 4820000,
  totalWelfarePoolBalance: 241000,
  solvencyRatio: '98.6%',
  statutoryWageFloorCompliance: '99.2%',
  districts: [
    {
      name: 'Lucknow',
      cooperativesCount: 6,
      workersCount: 450,
      activeDutyRate: '91%',
      monthlyGmv: 1845000,
      averageHourlyWage: 410,
      wageCompliance: '100%',
      healthFundBalance: 125060,
    },
    {
      name: 'Kanpur',
      cooperativesCount: 4,
      workersCount: 380,
      activeDutyRate: '88%',
      monthlyGmv: 1280000,
      averageHourlyWage: 395,
      wageCompliance: '99.1%',
      healthFundBalance: 84000,
    },
    {
      name: 'Varanasi',
      cooperativesCount: 4,
      workersCount: 290,
      activeDutyRate: '87%',
      monthlyGmv: 920000,
      averageHourlyWage: 380,
      wageCompliance: '98.8%',
      healthFundBalance: 61500,
    },
    {
      name: 'Agra',
      cooperativesCount: 2,
      workersCount: 180,
      activeDutyRate: '86%',
      monthlyGmv: 510000,
      averageHourlyWage: 375,
      wageCompliance: '98.4%',
      healthFundBalance: 42000,
    },
    {
      name: 'Gorakhpur',
      cooperativesCount: 2,
      workersCount: 120,
      activeDutyRate: '84%',
      monthlyGmv: 265000,
      averageHourlyWage: 360,
      wageCompliance: '98.2%',
      healthFundBalance: 28500,
    },
  ]
};

const institutionalContracts: any[] = [
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
];

// Get Federation Overview & District Stats
router.get('/overview', (_req: Request, res: Response): void => {
  res.json({ overview: statewideOverview });
});

// Get Institutional Contracts
router.get('/contracts', (_req: Request, res: Response): void => {
  res.json({ contracts: institutionalContracts });
});

// Create New Institutional RFP / Tender
router.post('/contracts', (req: Request, res: Response): void => {
  try {
    const {
      clientName,
      clientType,
      title,
      description,
      category,
      requiredHeadcount,
      duration,
      totalContractValue,
      statutoryMinimumDayRate = 500
    } = req.body;

    if (!clientName || !title || !requiredHeadcount || !totalContractValue) {
      res.status(400).json({ message: 'clientName, title, requiredHeadcount, and totalContractValue are required' });
      return;
    }

    const newContract = {
      id: `cnt-${Date.now()}`,
      contractNumber: `FED-TENDER-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      clientType: clientType || 'INSTITUTIONAL_BUYER',
      title,
      description: description || 'Institutional bulk workforce requisition tendered to UPLCF.',
      category: category || 'Facility Maintenance',
      requiredHeadcount: Number(requiredHeadcount),
      deployedHeadcount: 0,
      duration: duration || '30 Days',
      totalContractValue: Number(totalContractValue),
      statutoryMinimumDayRate: Number(statutoryMinimumDayRate),
      status: 'OPEN_REQUISITION',
      assignedSocieties: [],
      complianceAudited: true,
      issuedDate: new Date().toISOString().split('T')[0],
    };

    institutionalContracts.unshift(newContract);

    res.status(201).json({
      message: 'Institutional contract registered successfully with UPLCF',
      contract: newContract,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering contract', error: (err as Error).message });
  }
});

// Assign Member Society Quotas to Contract
router.post('/contracts/:id/assign', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { societyName, quotaCount } = req.body;

  const contract = institutionalContracts.find(c => c.id === id || c.contractNumber === id);
  if (!contract) {
    res.status(404).json({ message: 'Contract not found' });
    return;
  }

  const quota = Number(quotaCount) || 5;
  contract.assignedSocieties.push({
    name: societyName || 'Lucknow Labour Cooperative Society Ltd.',
    quota,
    filled: quota,
  });

  contract.deployedHeadcount = Math.min(contract.requiredHeadcount, contract.deployedHeadcount + quota);
  if (contract.deployedHeadcount >= contract.requiredHeadcount) {
    contract.status = 'FULLY_DEPLOYED';
  } else {
    contract.status = 'ACTIVE_DEPLOYMENT';
  }

  res.json({
    message: 'Cooperative society workforce quota assigned successfully',
    contract,
  });
});

export default router;
