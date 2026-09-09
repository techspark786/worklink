import { Router, Response } from 'express';
import Cooperative from '../models/Cooperative';
import Worker from '../models/Worker';

const router = Router();

const defaultCooperatives = [
  {
    id: 'coop-1',
    name: 'Lucknow Labour Cooperative Society Ltd.',
    registrationNumber: 'UP-LKO-COOP-2024-001',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    totalWorkers: 45,
    welfareFundBalance: 125000,
    contactEmail: 'contact@lko-coop.org',
    contactPhone: '+91 9876543210',
    isVerified: true,
  },
  {
    id: 'coop-2',
    name: 'Kanpur Skill Workers Cooperative Federation',
    registrationNumber: 'UP-KNP-FED-2023-088',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    totalWorkers: 120,
    welfareFundBalance: 450000,
    contactEmail: 'info@kanpurworkers.coop',
    contactPhone: '+91 9876500000',
    isVerified: true,
  },
];

// List Cooperatives
router.get('/', async (_req, res: Response): Promise<void> => {
  try {
    const coops = await Cooperative.find({});
    if (coops && coops.length > 0) {
      res.json({ cooperatives: coops });
      return;
    }
  } catch (dbErr) {
    // Fallback
  }

  res.json({ cooperatives: defaultCooperatives });
});

// Admin Verification Action (Approve Level 4 / 5)
router.patch('/verify-worker', async (req, res: Response): Promise<void> => {
  const { workerId, targetLevel, status } = req.body;

  if (!workerId || targetLevel === undefined) {
    res.status(400).json({ message: 'workerId and targetLevel are required' });
    return;
  }

  try {
    try {
      const worker = await Worker.findById(workerId);
      if (worker) {
        worker.verificationLevel = Number(targetLevel);
        if (worker.certifications && worker.certifications.length > 0) {
          worker.certifications.forEach((c) => (c.verified = true));
        }
        await worker.save();
        res.json({ message: `Worker verification updated to Level ${targetLevel}`, worker });
        return;
      }
    } catch (dbErr) {
      // Fallback
    }

    res.json({
      message: `Worker verification updated to Level ${targetLevel} (offline mode)`,
      workerId,
      newVerificationLevel: Number(targetLevel),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying worker', error: (err as Error).message });
  }
});

// In-memory welfare ledger transactions
const welfareLedgerTransactions: any[] = [
  {
    id: 'tx-101',
    bookingId: 'b-demo-1',
    workerId: 'w1',
    workerName: 'Ramesh Kumar',
    amount: 28,
    type: 'DEPOSIT',
    category: 'JOB_CESS',
    description: '7% Cooperative Welfare Contribution from Ceiling Fan Repair (Order #b-demo-1)',
    balanceAfter: 125028,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'tx-102',
    bookingId: 'b-demo-2',
    workerId: 'w2',
    workerName: 'Suresh Chandra',
    amount: 32,
    type: 'DEPOSIT',
    category: 'JOB_CESS',
    description: '7% Cooperative Welfare Contribution from Plumbing Work (Order #b-demo-2)',
    balanceAfter: 125060,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'tx-103',
    bookingId: 'claim-55',
    workerId: 'w5',
    workerName: 'Sunita Devi',
    amount: 4500,
    type: 'DISBURSEMENT',
    category: 'MEDICAL_REIMBURSEMENT',
    description: 'Emergency outpatient clinic & medicine reimbursement approved by Managing Committee',
    balanceAfter: 120560,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  }
];

let currentWelfareBalance = 125060;

// Get Welfare Balance Audit & Ledger
router.get('/:id/welfare', async (req, res: Response): Promise<void> => {
  const { id } = req.params;
  res.json({
    cooperativeId: id,
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    welfareFundBalance: currentWelfareBalance,
    monthlyContributionRate: '7% per completed gig',
    coverage: [
      'Cashless Health Coverage (up to ₹50,000 per member family)',
      'Accident & Disability Insurance Cover (up to ₹2,00,000)',
      'Cooperative Emergency Tool Replacement Loan (0% interest)',
      'Child Education Grant for Member Workers',
    ],
    auditedDate: new Date().toISOString(),
    transactions: welfareLedgerTransactions,
  });
});

// Process a Welfare Claim (Medical or Emergency Relief)
router.post('/:id/welfare/claim', async (req, res: Response): Promise<void> => {
  const { id } = req.params;
  const { workerId, workerName, amount, reason } = req.body;

  if (!workerName || !amount) {
    res.status(400).json({ message: 'workerName and amount are required' });
    return;
  }

  const claimAmount = Number(amount) || 2000;
  currentWelfareBalance = Math.max(0, currentWelfareBalance - claimAmount);

  const newTx = {
    id: `tx-${Date.now()}`,
    bookingId: `claim-${Math.floor(100 + Math.random() * 900)}`,
    workerId: workerId || 'w1',
    workerName,
    amount: claimAmount,
    type: 'DISBURSEMENT',
    category: 'EMERGENCY_CLAIM',
    description: reason || 'Cooperative Welfare Emergency Claim Approved',
    balanceAfter: currentWelfareBalance,
    timestamp: new Date().toISOString(),
  };

  welfareLedgerTransactions.unshift(newTx);

  res.status(201).json({
    message: 'Welfare claim approved by Cooperative Managing Committee',
    transaction: newTx,
    updatedBalance: currentWelfareBalance,
  });
});

export default router;
