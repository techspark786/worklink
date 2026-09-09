import { Router, Request, Response } from 'express';
import { Complaint } from '../models/Complaint';

export const complaintRouter = Router();

// In-memory mock store for standalone demo/testing when MongoDB is running or offline
let mockComplaints = [
  {
    complaintId: 'CMP-2026-081',
    bookingId: 'BK-LKO-2026-4401',
    customerName: 'Priya Sharma',
    workerName: 'Ramesh Kumar',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    category: 'LATE_ARRIVAL',
    severity: 'MEDIUM',
    description: 'Worker arrived 45 minutes past the scheduled 10:00 AM slot due to heavy traffic on Kanpur Road.',
    status: 'UNDER_REVIEW',
    arbitrationNotes: 'Worker provided GPS route proof showing police barricade detour. Customer offered priority slot.',
    resolutionAction: 'Apology notice issued and 10% cooperative transit voucher credited to customer.',
    refundAmount: 50,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000),
  },
  {
    complaintId: 'CMP-2026-082',
    bookingId: 'BK-LKO-2026-4408',
    customerName: 'Amit Verma',
    workerName: 'Suresh Patel',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    category: 'INCORRECT_BILLING',
    severity: 'HIGH',
    description: 'Dispute regarding ₹350 extra charged for CPVC pipe brass elbow without prior customer pre-approval.',
    status: 'PENDING',
    arbitrationNotes: 'Awaiting submission of hardware store bill by technician.',
    resolutionAction: '',
    refundAmount: 0,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000),
  },
  {
    complaintId: 'CMP-2026-079',
    bookingId: 'BK-LKO-2026-4392',
    customerName: 'Sunita Gupta',
    workerName: 'Rajesh Verma',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    category: 'PROPERTY_DAMAGE',
    severity: 'LOW',
    description: 'Minor superficial plaster scratch on wall next to switchboard during heavy drill installation.',
    status: 'RESOLVED',
    arbitrationNotes: 'Cooperative representative inspected site. Technician assisted in touch-up putty application.',
    resolutionAction: '₹200 touch-up goodwill allowance disbursed from Cooperative Welfare Contingency Pool.',
    refundAmount: 200,
    resolvedAt: new Date(Date.now() - 48 * 3600 * 1000),
    createdAt: new Date(Date.now() - 72 * 3600 * 1000),
  },
];

// GET /api/complaints
complaintRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, severity } = req.query;
    let filtered = [...mockComplaints];

    if (status && typeof status === 'string' && status !== 'ALL') {
      filtered = filtered.filter((c) => c.status === status);
    }
    if (severity && typeof severity === 'string' && severity !== 'ALL') {
      filtered = filtered.filter((c) => c.severity === severity);
    }

    res.json({
      success: true,
      count: filtered.length,
      complaints: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve complaints', error });
  }
});

// POST /api/complaints
complaintRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, customerName, workerName, cooperativeName, category, severity, description } = req.body;

    if (!bookingId || !description) {
      res.status(400).json({ success: false, message: 'bookingId and description are required' });
      return;
    }

    const newComplaint = {
      complaintId: `CMP-${Date.now().toString().slice(-6)}`,
      bookingId,
      customerName: customerName || 'Verified Customer',
      workerName: workerName || 'Assigned Worker',
      cooperativeName: cooperativeName || 'Lucknow Labour Cooperative Society Ltd.',
      category: category || 'POOR_SERVICE',
      severity: severity || 'MEDIUM',
      description,
      status: 'PENDING',
      arbitrationNotes: 'Case docket registered. Assigned to Cooperative Arbitration Panel.',
      resolutionAction: '',
      refundAmount: 0,
      createdAt: new Date(),
    };

    mockComplaints.unshift(newComplaint);

    res.status(201).json({
      success: true,
      message: 'Grievance submitted to Cooperative Arbitration Committee successfully',
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to lodge complaint', error });
  }
});

// PATCH /api/complaints/:id/resolve
complaintRouter.patch('/:id/resolve', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, arbitrationNotes, resolutionAction, refundAmount } = req.body;

    const complaint = mockComplaints.find((c) => c.complaintId === id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found' });
      return;
    }

    complaint.status = status || 'RESOLVED';
    if (arbitrationNotes) complaint.arbitrationNotes = arbitrationNotes;
    if (resolutionAction) complaint.resolutionAction = resolutionAction;
    if (refundAmount !== undefined) complaint.refundAmount = Number(refundAmount);
    complaint.resolvedAt = new Date();

    res.json({
      success: true,
      message: `Grievance ${id} updated to ${complaint.status} by Cooperative Committee`,
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resolve complaint', error });
  }
});
