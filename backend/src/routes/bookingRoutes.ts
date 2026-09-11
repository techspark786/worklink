import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking, { IBooking, BookingStatus, BookingUrgency } from '../models/Booking';
import Worker from '../models/Worker';
import User from '../models/User';
import Cooperative from '../models/Cooperative';

const router = Router();

// In-memory fallback bookings array for offline / initial testing
const memoryBookings: any[] = [
  {
    _id: 'b-demo-1',
    id: 'b-demo-1',
    customerId: 'cust-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    workerId: 'w1',
    workerName: 'Ramesh Kumar',
    workerPhone: '+91 91234 56789',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    serviceTitle: 'Ceiling Fan & Switchboard Repair',
    serviceCategory: 'Electrical & Power',
    description: 'Ceiling fan makes loud grinding noise and regulator knob is stuck.',
    urgency: 'SAME_DAY',
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 04:00 PM',
    customerLocation: {
      address: 'Flat 402, Hazratganj Heights',
      landmark: 'Near Capitol Cinema',
      city: 'Lucknow',
      pincode: '226001',
      coordinates: { latitude: 26.8500, longitude: 80.9500 }
    },
    pricing: {
      baseWage: 400,
      welfareCess: 28, // 7%
      platformFee: 20, // 5%
      totalAmount: 448,
      savingsVsAggregator: 182 // Aggregator price would be ~₹630
    },
    status: 'IN_PROGRESS' as BookingStatus,
    startOtp: '4829',
    completionOtp: '7103',
    matchScore: 96,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'b-demo-2',
    id: 'b-demo-2',
    customerId: 'cust-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    workerId: 'w2',
    workerName: 'Suresh Chandra',
    workerPhone: '+91 98765 11223',
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    serviceTitle: 'Main Pipeline Joint Leakage Fix',
    serviceCategory: 'Plumbing & Drainage',
    description: 'Bathroom washbasin outlet valve continuously dripping.',
    urgency: 'EMERGENCY_45_MIN',
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: 'Immediate (45 Min Express)',
    customerLocation: {
      address: 'B-12, Aliganj Sector J',
      landmark: 'Near Post Office',
      city: 'Lucknow',
      pincode: '226024',
      coordinates: { latitude: 26.8850, longitude: 80.9400 }
    },
    pricing: {
      baseWage: 450,
      welfareCess: 32,
      platformFee: 22,
      totalAmount: 504,
      savingsVsAggregator: 215
    },
    status: 'REQUESTED' as BookingStatus,
    startOtp: '6291',
    completionOtp: '8415',
    matchScore: 92,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Helper to generate a 4-digit OTP
const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Create a new Booking
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerId,
      workerId,
      cooperativeId,
      serviceTitle,
      serviceCategory,
      description,
      urgency = 'SAME_DAY',
      scheduledDate,
      timeSlot = '10:00 AM - 12:00 PM',
      customerLocation,
      baseWage = 400,
      matchScore = 95,
      customerNotes = '',
    } = req.body;

    if (!serviceTitle || !description || !customerLocation || !customerLocation.address) {
      res.status(400).json({ message: 'Service title, description, and address are required' });
      return;
    }

    const wageNum = Number(baseWage) || 400;
    const welfareCess = Math.round(wageNum * 0.07); // 7% Cooperative Welfare Cess
    const platformFee = Math.round(wageNum * 0.05); // 5% Tech operations
    const totalAmount = wageNum + welfareCess + platformFee;
    const savingsVsAggregator = Math.round(wageNum * 0.45); // Private apps charge ~45% markup

    const startOtp = generateOtp();
    const completionOtp = generateOtp();

    let validCustomerId: any = customerId;
    let validWorkerId: any = workerId;

    if (mongoose.connection.readyState === 1) {
      try {
        if (!validCustomerId || !mongoose.Types.ObjectId.isValid(validCustomerId)) {
          const defaultUser = await User.findOne({ role: 'CUSTOMER' });
          validCustomerId = defaultUser ? defaultUser._id : new mongoose.Types.ObjectId('65e000000000000000000001');
        }

        if (!validWorkerId || !mongoose.Types.ObjectId.isValid(validWorkerId)) {
          const defaultWorker = await Worker.findOne();
          validWorkerId = defaultWorker ? defaultWorker._id : new mongoose.Types.ObjectId('65e000000000000000000002');
        }

        const newBooking = await Booking.create({
          customerId: validCustomerId,
          workerId: validWorkerId,
          cooperativeId: cooperativeId && mongoose.Types.ObjectId.isValid(cooperativeId) ? cooperativeId : null,
          serviceTitle,
          serviceCategory: serviceCategory || 'General Service',
          description,
          urgency: urgency as BookingUrgency,
          scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
          timeSlot,
          customerLocation: {
            address: customerLocation.address,
            landmark: customerLocation.landmark || '',
            city: customerLocation.city || 'Lucknow',
            pincode: customerLocation.pincode || '226001',
            coordinates: customerLocation.coordinates || { latitude: 26.8467, longitude: 80.9462 },
          },
          pricing: {
            baseWage: wageNum,
            welfareCess,
            platformFee,
            totalAmount,
            savingsVsAggregator,
          },
          status: 'REQUESTED',
          startOtp,
          completionOtp,
          matchScore: Number(matchScore) || 95,
          customerNotes,
        });

        res.status(201).json({
          message: 'Booking created successfully',
          booking: newBooking,
        });
        return;
      } catch (dbErr) {
        console.warn('MongoDB booking create failed, falling back to memory store:', (dbErr as Error).message);
      }
    }
      // Fallback for memory store
      const bookingId = `b-${Date.now()}`;
      const memBooking = {
        _id: bookingId,
        id: bookingId,
        customerId: customerId || 'cust-1',
        workerId: workerId || 'w1',
        workerName: req.body.workerName || 'Ramesh Kumar',
        workerPhone: '+91 91234 56789',
        cooperativeName: req.body.cooperativeName || 'Lucknow Labour Cooperative Society Ltd.',
        serviceTitle,
        serviceCategory: serviceCategory || 'General Service',
        description,
        urgency: urgency as BookingUrgency,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        timeSlot,
        customerLocation: {
          address: customerLocation.address,
          landmark: customerLocation.landmark || '',
          city: customerLocation.city || 'Lucknow',
          pincode: customerLocation.pincode || '226001',
          coordinates: customerLocation.coordinates || { latitude: 26.8467, longitude: 80.9462 },
        },
        pricing: {
          baseWage: wageNum,
          welfareCess,
          platformFee,
          totalAmount,
          savingsVsAggregator,
        },
        status: 'REQUESTED' as BookingStatus,
        startOtp,
        completionOtp,
        matchScore: Number(matchScore) || 95,
        customerNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryBookings.unshift(memBooking);

      res.status(201).json({
        message: 'Booking created successfully (offline mode)',
        booking: memBooking,
      });
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: (err as Error).message });
  }
});

// List Bookings with filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, workerId, status } = req.query;

    try {
      let query: any = {};
      if (customerId && mongoose.Types.ObjectId.isValid(customerId as string)) {
        query.customerId = customerId;
      }
      if (workerId && mongoose.Types.ObjectId.isValid(workerId as string)) {
        query.workerId = workerId;
      }
      if (status) query.status = status;

      const dbBookings = await Booking.find(query)
        .populate('customerId', 'name email phone avatar')
        .populate('workerId')
        .populate('cooperativeId', 'name city state')
        .sort({ createdAt: -1 });

      // If user queried with specific customerId or workerId, return dbBookings (even if empty [])
      if (customerId || workerId || (dbBookings && dbBookings.length > 0)) {
        res.json({ bookings: dbBookings });
        return;
      }
    } catch (dbErr) {
      console.warn('DB error in GET /bookings:', dbErr);
    }

    let filtered = [...memoryBookings];
    if (status) {
      filtered = filtered.filter(b => b.status === status);
    }
    if (customerId) {
      filtered = filtered.filter(b => b.customerId === customerId);
    }
    if (workerId) {
      filtered = filtered.filter(b => b.workerId === workerId);
    }
    res.json({ bookings: filtered });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: (err as Error).message });
  }
});

// Get Single Booking by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    try {
      const dbBooking = await Booking.findById(id)
        .populate('customerId', 'name email phone avatar')
        .populate('workerId')
        .populate('cooperativeId', 'name city state');

      if (dbBooking) {
        res.json({ booking: dbBooking });
        return;
      }
    } catch (dbErr) {
      // Fallback
    }

    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      res.json({ booking: memBooking });
      return;
    }

    res.status(404).json({ message: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving booking', error: (err as Error).message });
  }
});

// Update Booking Status
router.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, cancellationReason } = req.body;

  try {
    try {
      const updateData: any = { status };
      if (cancellationReason) updateData.cancellationReason = cancellationReason;

      const updated = await Booking.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) {
        res.json({ message: 'Booking status updated', booking: updated });
        return;
      }
    } catch (dbErr) {
      // Fallback
    }

    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      memBooking.status = status;
      if (cancellationReason) memBooking.cancellationReason = cancellationReason;
      memBooking.updatedAt = new Date().toISOString();
      res.json({ message: 'Booking status updated (offline mode)', booking: memBooking });
      return;
    }

    res.status(404).json({ message: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking status', error: (err as Error).message });
  }
});

// Worker Accepts Booking (ASSIGNED)
router.post('/:id/accept', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      memBooking.status = 'ASSIGNED';
      memBooking.updatedAt = new Date().toISOString();
      res.json({ success: true, message: 'Gig accepted. Status updated to ASSIGNED.', booking: memBooking });
      return;
    }

    const dbBooking = await Booking.findByIdAndUpdate(id, { status: 'ASSIGNED' }, { new: true });
    if (dbBooking) {
      res.json({ success: true, message: 'Gig accepted. Status updated to ASSIGNED.', booking: dbBooking });
      return;
    }

    res.status(404).json({ message: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting booking', error: (err as Error).message });
  }
});

// Worker Declines Booking (Cascades to next cooperative member without penalty)
router.post('/:id/decline', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      // Re-assign to next cooperative member (e.g. w2 or w3)
      memBooking.workerId = 'w3';
      memBooking.workerName = 'Rajesh Verma';
      memBooking.updatedAt = new Date().toISOString();
      res.json({ success: true, message: 'Gig declined without rating penalty. Cascaded to next cooperative member.', booking: memBooking });
      return;
    }

    res.json({ success: true, message: 'Gig declined without penalty. Cascaded to next cooperative member.' });
  } catch (err) {
    res.status(500).json({ message: 'Error declining booking', error: (err as Error).message });
  }
});

// Worker Arrives at Customer Doorstep (ARRIVED)
router.post('/:id/arrived', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      memBooking.status = 'ARRIVED';
      memBooking.updatedAt = new Date().toISOString();
      res.json({ success: true, message: 'Worker arrived at customer premises. Awaiting Start OTP.', booking: memBooking });
      return;
    }

    const dbBooking = await Booking.findByIdAndUpdate(id, { status: 'ARRIVED' }, { new: true });
    if (dbBooking) {
      res.json({ success: true, message: 'Worker arrived at customer premises. Awaiting Start OTP.', booking: dbBooking });
      return;
    }

    res.status(404).json({ message: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking arrival', error: (err as Error).message });
  }
});

// Verify Start OTP
router.post('/:id/verify-start', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { otp } = req.body;

  try {
    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      if (memBooking.startOtp === otp) {
        memBooking.status = 'IN_PROGRESS';
        res.json({ success: true, message: 'Work started successfully', booking: memBooking });
        return;
      } else {
        res.status(400).json({ success: false, message: 'Invalid start OTP' });
        return;
      }
    }

    const dbBooking = await Booking.findById(id);
    if (dbBooking) {
      if (dbBooking.startOtp === otp) {
        dbBooking.status = 'IN_PROGRESS';
        await dbBooking.save();
        res.json({ success: true, message: 'Work started successfully', booking: dbBooking });
        return;
      } else {
        res.status(400).json({ success: false, message: 'Invalid start OTP' });
        return;
      }
    }

    res.status(404).json({ message: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: (err as Error).message });
  }
});

// Verify Completion OTP
router.post('/:id/verify-completion', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { otp } = req.body;

  try {
    const memBooking = memoryBookings.find(b => b._id === id || b.id === id);
    if (memBooking) {
      if (memBooking.completionOtp === otp) {
        memBooking.status = 'COMPLETED';
        res.json({ success: true, message: 'Work completed and verified. Cooperative payment released.', booking: memBooking });
        return;
      } else {
        res.status(400).json({ success: false, message: 'Invalid completion OTP' });
        return;
      }
    }

    const dbBooking = await Booking.findById(id);
    if (dbBooking) {
      if (dbBooking.completionOtp === otp) {
        dbBooking.status = 'COMPLETED';
        await dbBooking.save();
        res.json({ success: true, message: 'Work completed and verified. Cooperative payment released.', booking: dbBooking });
        return;
      } else {
        res.status(400).json({ success: false, message: 'Invalid completion OTP' });
        return;
      }
    }

    res.status(404).json({ message: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying completion OTP', error: (err as Error).message });
  }
});

export default router;
