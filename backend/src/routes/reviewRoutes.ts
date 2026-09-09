import { Router, Request, Response } from 'express';

export const reviewRouter = Router();

let mockReviews = [
  {
    reviewId: 'REV-LKO-8812',
    bookingId: 'BK-LKO-2026-4401',
    workerId: 'w-101',
    workerName: 'Ramesh Kumar',
    customerName: 'Ananya Deshmukh',
    overallRating: 5,
    skillRating: 5,
    behaviourRating: 5,
    punctualityRating: 4,
    serviceQualityRating: 5,
    comment: 'Exceptional electrical diagnosis! Diagnosed the MCB trip in 10 minutes. Fair cooperative pricing with zero hidden charges.',
    isVerifiedBooking: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
  },
  {
    reviewId: 'REV-LKO-8813',
    bookingId: 'BK-LKO-2026-4395',
    workerId: 'w-102',
    workerName: 'Suresh Patel',
    customerName: 'Vivek Singhania',
    overallRating: 4,
    skillRating: 5,
    behaviourRating: 4,
    punctualityRating: 5,
    serviceQualityRating: 4,
    comment: 'Punctual plumber from Hazratganj Cooperative. Fixed the kitchen faucet leak quickly and cleaned up after work.',
    isVerifiedBooking: true,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000),
  },
  {
    reviewId: 'REV-LKO-8814',
    bookingId: 'BK-LKO-2026-4389',
    workerId: 'w-103',
    workerName: 'Mohd. Salim',
    customerName: 'Kavita Joshi',
    overallRating: 5,
    skillRating: 5,
    behaviourRating: 5,
    punctualityRating: 5,
    serviceQualityRating: 5,
    comment: 'Master craftsman carpenter. Repaired the wooden door latch with great precision. Very polite and verified worker.',
    isVerifiedBooking: true,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000),
  },
];

// GET /api/reviews
reviewRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { workerId } = req.query;
    let filtered = [...mockReviews];

    if (workerId && typeof workerId === 'string') {
      filtered = filtered.filter((r) => r.workerId === workerId);
    }

    res.json({
      success: true,
      count: filtered.length,
      reviews: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews', error });
  }
});

// POST /api/reviews
reviewRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      bookingId,
      workerId,
      workerName,
      customerName,
      overallRating,
      skillRating,
      behaviourRating,
      punctualityRating,
      serviceQualityRating,
      comment,
    } = req.body;

    if (!bookingId || !overallRating || !comment) {
      res.status(400).json({ success: false, message: 'bookingId, overallRating, and comment are required' });
      return;
    }

    const newReview = {
      reviewId: `REV-${Date.now().toString().slice(-6)}`,
      bookingId,
      workerId: workerId || 'w-101',
      workerName: workerName || 'Assigned Worker',
      customerName: customerName || 'Verified Customer',
      overallRating: Math.min(5, Math.max(1, Number(overallRating))),
      skillRating: Math.min(5, Math.max(1, Number(skillRating || overallRating))),
      behaviourRating: Math.min(5, Math.max(1, Number(behaviourRating || overallRating))),
      punctualityRating: Math.min(5, Math.max(1, Number(punctualityRating || overallRating))),
      serviceQualityRating: Math.min(5, Math.max(1, Number(serviceQualityRating || overallRating))),
      comment,
      isVerifiedBooking: true,
      createdAt: new Date(),
    };

    mockReviews.unshift(newReview);

    res.status(201).json({
      success: true,
      message: 'Verified review submitted and trust score updated successfully',
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error });
  }
});
