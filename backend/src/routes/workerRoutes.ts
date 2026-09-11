import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Worker from '../models/Worker';
import User from '../models/User';
import Cooperative from '../models/Cooperative';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// In-memory fallback workers array for offline testing
const memoryWorkers: any[] = [
  {
    id: 'w1',
    _id: 'w1',
    name: 'Ramesh Kumar',
    email: 'worker@shramsetu.in',
    skills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols', 'Electrician'],
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
    cooperativeId: 'coop-1',
    certifications: [
      { title: 'ITI Electrical Certificate', issuer: 'Govt ITI Lucknow', verified: true },
      { title: 'National Safety Skill Council Badge', issuer: 'NSDC India', verified: true },
    ],
    location: { latitude: 26.8500, longitude: 80.9500, city: 'Lucknow' },
  },
  {
    id: 'w2',
    _id: 'w2',
    name: 'Suresh Chandra',
    email: 'suresh@shramsetu.in',
    skills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings', 'Water Tank Repair', 'Plumber'],
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
    cooperativeId: 'coop-1',
    certifications: [
      { title: 'Plumbing Skill Level 3 Badge', issuer: 'State Skill Mission', verified: true }
    ],
    location: { latitude: 26.8400, longitude: 80.9300, city: 'Lucknow' },
  },
  {
    id: 'w3',
    _id: 'w3',
    name: 'Rajesh Verma',
    email: 'rajesh@shramsetu.in',
    skills: ['Woodwork', 'Furniture Assembly', 'Door & Window Locks', 'Hinges', 'Carpenter'],
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
    cooperativeId: 'coop-1',
    certifications: [
      { title: 'Master Craftsman Carpentry Badge', issuer: 'UP Skill Development Mission', verified: true },
      { title: 'Safety at Workplace Standard', issuer: 'NSDC', verified: true }
    ],
    location: { latitude: 26.8600, longitude: 80.9400, city: 'Lucknow' },
  },
  {
    id: 'w4',
    _id: 'w4',
    name: 'Amit Kumar',
    email: 'amit@shramsetu.in',
    skills: ['AC Servicing', 'Gas Refill', 'Compressor Repair', 'Appliance Repair', 'AC Technician'],
    experienceYears: 6,
    verificationLevel: 4,
    isAvailable: true,
    serviceRadiusKm: 12,
    hourlyRate: 650,
    rating: 4.8,
    totalCompletedJobs: 135,
    welfareContributionTotal: 8775,
    insuranceActive: true,
    cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
    cooperativeId: 'coop-1',
    certifications: [
      { title: 'HVAC & Refrigeration Certified', issuer: 'State Technical Institute', verified: true }
    ],
    location: { latitude: 26.8350, longitude: 80.9250, city: 'Lucknow' },
  },
  {
    id: 'w5',
    _id: 'w5',
    name: 'Sunita Devi',
    email: 'sunita@shramsetu.in',
    skills: ['Deep House Cleaning', 'Sanitization', 'Floor Polishing', 'Kitchen Hygiene', 'Cleaner & Sanitation'],
    experienceYears: 4,
    verificationLevel: 4,
    isAvailable: true,
    serviceRadiusKm: 6,
    hourlyRate: 350,
    rating: 4.85,
    totalCompletedJobs: 160,
    welfareContributionTotal: 5600,
    insuranceActive: true,
    cooperativeName: 'Lucknow Mahila Shramik Sahakari Samiti',
    cooperativeId: 'coop-2',
    certifications: [
      { title: 'Sanitation & Hygiene Safety Certificate', issuer: 'Swachh Bharat Skill Academy', verified: true }
    ],
    location: { latitude: 26.8520, longitude: 80.9480, city: 'Lucknow' },
  }
];

// Haversine Distance Calculation (in kilometers)
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// FairMatch™ 5-Factor Scoring Algorithm
function computeFairMatch(
  worker: any,
  customerLat: number,
  customerLng: number,
  serviceQuery: string,
  urgency: string = 'SAME_DAY'
) {
  const workerLat = worker.location?.latitude || 26.8467;
  const workerLng = worker.location?.longitude || 80.9462;
  const distanceKm = calculateHaversineDistance(customerLat, customerLng, workerLat, workerLng);

  // 1. Skill Match Score (Max: 30 pts)
  let skillScore = 10;
  const queryLower = (serviceQuery || '').toLowerCase();
  const workerSkillsLower = (worker.skills || []).map((s: string) => s.toLowerCase());
  
  const hasExactCategory = workerSkillsLower.some((s: string) => queryLower.includes(s) || s.includes(queryLower));
  if (hasExactCategory || queryLower.length === 0) {
    skillScore = 30;
  } else {
    const keywordMatches = workerSkillsLower.filter((s: string) => 
      queryLower.split(' ').some((word: string) => word.length > 2 && s.includes(word))
    );
    skillScore = Math.min(30, 15 + keywordMatches.length * 5);
  }

  // 2. Distance Proximity Score (Max: 25 pts)
  let distanceScore = 25;
  if (distanceKm <= 2.0) {
    distanceScore = 25;
  } else if (distanceKm <= 5.0) {
    distanceScore = 22;
  } else if (distanceKm <= 10.0) {
    distanceScore = 18;
  } else if (distanceKm <= 15.0) {
    distanceScore = 12;
  } else {
    distanceScore = Math.max(5, Math.round(25 - distanceKm));
  }

  // 3. Availability Score (Max: 20 pts)
  let availabilityScore = worker.isAvailable ? 20 : 0;
  if (urgency === 'EMERGENCY_45_MIN' && !worker.isAvailable) {
    availabilityScore = 0;
  }

  // 4. Trust & Verification Level Score (Max: 15 pts)
  // Verification Levels 0 to 5
  const levelScores = [3, 6, 9, 12, 14, 15];
  const levelIdx = Math.min(5, Math.max(0, worker.verificationLevel || 1));
  const trustScore = levelScores[levelIdx];

  // 5. Experience & Job Track Record (Max: 10 pts)
  const experienceYears = worker.experienceYears || 1;
  const experienceScore = Math.min(10, Math.round(5 + experienceYears * 0.7));

  const totalScore = Math.min(100, Math.max(0, skillScore + distanceScore + availabilityScore + trustScore + experienceScore));

  return {
    distanceKm,
    matchBreakdown: {
      skillScore,
      distanceScore,
      availabilityScore,
      trustScore,
      experienceScore,
      totalScore,
    }
  };
}

// Onboard / Create Worker Profile
router.post('/onboard', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      cooperativeId, 
      skills, 
      experienceYears, 
      serviceRadiusKm, 
      hourlyRate, 
      certifications 
    } = req.body;

    if (!name || !skills || skills.length === 0) {
      res.status(400).json({ message: 'Name and at least one skill are required' });
      return;
    }

    try {
      let user = await User.findOne({ email: email?.toLowerCase() });
      if (!user) {
        user = await User.create({
          name,
          email: email ? email.toLowerCase() : `worker-${Date.now()}@shramsetu.in`,
          passwordHash: 'seeded_hash',
          role: 'WORKER',
          isVerified: true,
        });
      }

      const newWorker = await Worker.create({
        userId: user._id,
        cooperativeId: cooperativeId || null,
        skills,
        experienceYears: Number(experienceYears) || 1,
        serviceRadiusKm: Number(serviceRadiusKm) || 5,
        hourlyRate: Number(hourlyRate) || 350,
        verificationLevel: certifications && certifications.length > 0 ? 3 : 2,
        certifications: certifications || [],
        isAvailable: true,
      });

      res.status(201).json({
        message: 'Worker onboarded successfully',
        worker: newWorker,
      });
      return;
    } catch (dbErr) {
      // Fallback
      const workerId = `w-${Date.now()}`;
      const memWorker = {
        id: workerId,
        name,
        email: email || 'newworker@shramsetu.in',
        skills,
        experienceYears: Number(experienceYears) || 1,
        serviceRadiusKm: Number(serviceRadiusKm) || 5,
        hourlyRate: Number(hourlyRate) || 350,
        verificationLevel: 2,
        isAvailable: true,
        rating: 5.0,
        totalCompletedJobs: 0,
        welfareContributionTotal: 0,
        insuranceActive: true,
        cooperativeName: 'Lucknow Labour Cooperative Society Ltd.',
        certifications: certifications || [],
      };
      memoryWorkers.push(memWorker);

      res.status(201).json({
        message: 'Worker onboarded successfully (offline mode)',
        worker: memWorker,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error onboarding worker', error: (err as Error).message });
  }
});

// List All Workers
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const { skill, available, minLevel } = req.query;
    try {
      let query: any = {};
      if (available === 'true') query.isAvailable = true;
      if (minLevel) query.verificationLevel = { $gte: Number(minLevel) };
      if (skill) query.skills = { $in: [String(skill)] };

      const dbWorkers = await Worker.find(query).populate('userId', 'name email phone avatar').populate('cooperativeId', 'name city');
      if (dbWorkers && dbWorkers.length > 0) {
        res.json({ workers: dbWorkers });
        return;
      }
    } catch (dbErr) {
      // Fallback
    }

    res.json({ workers: memoryWorkers });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workers', error: (err as Error).message });
  }
});

// FairMatch™ Worker Discovery & Ranking Engine (POST)
router.post('/match', async (req, res: Response): Promise<void> => {
  try {
    const { 
      latitude = 26.8467, 
      longitude = 80.9462, 
      category = '', 
      query = '', 
      urgency = 'SAME_DAY',
      minLevel = 0,
      maxDistanceKm = 25
    } = req.body;

    const serviceQuery = `${category} ${query}`.trim();
    let candidates = [...memoryWorkers];

    try {
      const dbWorkers = await Worker.find({}).populate('userId', 'name email phone avatar').populate('cooperativeId', 'name city');
      if (dbWorkers && dbWorkers.length > 0) {
        candidates = dbWorkers.map(w => ({
          id: w._id.toString(),
          _id: w._id.toString(),
          name: (w.userId as any)?.name || 'Cooperative Worker',
          email: (w.userId as any)?.email,
          skills: w.skills,
          experienceYears: w.experienceYears,
          verificationLevel: w.verificationLevel,
          isAvailable: w.isAvailable,
          serviceRadiusKm: w.serviceRadiusKm,
          hourlyRate: w.hourlyRate,
          rating: w.rating,
          totalCompletedJobs: w.totalCompletedJobs,
          welfareContributionTotal: w.welfareContributionTotal,
          insuranceActive: w.insuranceActive,
          cooperativeName: (w.cooperativeId as any)?.name || 'Lucknow Labour Cooperative Society Ltd.',
          cooperativeId: w.cooperativeId?._id,
          certifications: w.certifications,
          location: w.location,
        }));
      }
    } catch (dbErr) {
      // Fallback to memoryWorkers
    }

    if (minLevel) {
      candidates = candidates.filter(w => (w.verificationLevel || 0) >= Number(minLevel));
    }

    if (urgency === 'EMERGENCY_45_MIN') {
      candidates = candidates.filter(w => w.isAvailable);
    }

    const scoredWorkers = candidates.map(worker => {
      const { distanceKm, matchBreakdown } = computeFairMatch(
        worker,
        Number(latitude),
        Number(longitude),
        serviceQuery,
        urgency
      );

      return {
        ...worker,
        distanceKm,
        distanceText: `${distanceKm} km`,
        matchScore: matchBreakdown.totalScore,
        matchBreakdown,
      };
    })
    .filter(w => w.distanceKm <= Number(maxDistanceKm))
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      query: serviceQuery,
      urgency,
      customerLocation: { latitude: Number(latitude), longitude: Number(longitude) },
      totalFound: scoredWorkers.length,
      workers: scoredWorkers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error matching workers', error: (err as Error).message });
  }
});

// FairMatch™ Worker Discovery & Ranking Engine (GET)
router.get('/match', async (req, res: Response): Promise<void> => {
  try {
    const { 
      lat = '26.8467', 
      lng = '80.9462', 
      category = '', 
      query = '', 
      urgency = 'SAME_DAY',
      minLevel = '0',
      maxDistanceKm = '25'
    } = req.query;

    const serviceQuery = `${category} ${query}`.trim();
    let candidates = [...memoryWorkers];

    const scoredWorkers = candidates.map(worker => {
      const { distanceKm, matchBreakdown } = computeFairMatch(
        worker,
        Number(lat),
        Number(lng),
        serviceQuery,
        String(urgency)
      );

      return {
        ...worker,
        distanceKm,
        distanceText: `${distanceKm} km`,
        matchScore: matchBreakdown.totalScore,
        matchBreakdown,
      };
    })
    .filter(w => w.distanceKm <= Number(maxDistanceKm))
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      query: serviceQuery,
      urgency,
      customerLocation: { latitude: Number(lat), longitude: Number(lng) },
      totalFound: scoredWorkers.length,
      workers: scoredWorkers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error matching workers', error: (err as Error).message });
  }
});

// Get Current Logged-in Worker Profile
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  try {
    const worker = await Worker.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone avatar location')
      .populate('cooperativeId', 'name city');
    if (worker) {
      res.json({ worker });
      return;
    }
  } catch (err) {
    console.warn('Error fetching worker profile by userId:', err);
  }

  const memWorker = memoryWorkers.find((w) => w.id === req.user?.id || w.email === req.user?.email);
  if (memWorker) {
    res.json({ worker: memWorker });
    return;
  }

  res.status(404).json({ message: 'Worker profile not found for authenticated user' });
});

// Get Single Worker by ID
router.get('/:id', async (req, res: Response): Promise<void> => {
  const { id } = req.params;
  if (id === 'me') {
    res.status(400).json({ message: 'Please use GET /api/workers/me with Authorization token' });
    return;
  }

  try {
    let dbWorker = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbWorker = await Worker.findById(id)
        .populate('userId', 'name email phone avatar location')
        .populate('cooperativeId', 'name city');
      if (!dbWorker) {
        dbWorker = await Worker.findOne({ userId: id })
          .populate('userId', 'name email phone avatar location')
          .populate('cooperativeId', 'name city');
      }
    }

    if (dbWorker) {
      res.json({ worker: dbWorker });
      return;
    }
  } catch (dbErr) {
    // Fallback
  }

  const memWorker = memoryWorkers.find((w) => w.id === id || w.email === id);
  if (memWorker) {
    res.json({ worker: memWorker });
    return;
  }

  res.status(404).json({ message: 'Worker not found' });
});

// Toggle Worker Availability
router.patch('/:id/availability', async (req, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  try {
    try {
      const updated = await Worker.findByIdAndUpdate(id, { isAvailable }, { new: true });
      if (updated) {
        res.json({ message: 'Availability status updated', isAvailable: updated.isAvailable });
        return;
      }
    } catch (dbErr) {
      // Fallback
    }

    const memWorker = memoryWorkers.find((w) => w.id === id || w.email === id);
    if (memWorker) {
      memWorker.isAvailable = Boolean(isAvailable);
    }
    res.json({ message: 'Availability status updated', isAvailable: Boolean(isAvailable) });
  } catch (err) {
    res.status(500).json({ message: 'Error updating availability', error: (err as Error).message });
  }
});

// Add Certification Metadata
router.post('/:id/certifications', async (req, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, issuer } = req.body;

  if (!title || !issuer) {
    res.status(400).json({ message: 'Title and issuer are required' });
    return;
  }

  const newCert = { title, issuer, verified: false };

  try {
    try {
      const worker = await Worker.findById(id);
      if (worker) {
        worker.certifications.push(newCert);
        if (worker.verificationLevel < 3) worker.verificationLevel = 3;
        await worker.save();
        res.status(201).json({ message: 'Certification submitted for verification', certifications: worker.certifications });
        return;
      }
    } catch (dbErr) {
      // Fallback
    }

    const memWorker = memoryWorkers.find((w) => w.id === id || w.email === id);
    if (memWorker) {
      memWorker.certifications.push({ ...newCert, verified: false });
      if (memWorker.verificationLevel < 3) memWorker.verificationLevel = 3;
      res.status(201).json({ message: 'Certification submitted for verification', certifications: memWorker.certifications });
      return;
    }

    res.status(404).json({ message: 'Worker not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding certification', error: (err as Error).message });
  }
});

export default router;
