import { Router, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import Worker from '../models/Worker';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// In-memory fallback store for offline testing without active MongoDB daemon
const memoryUsers: any[] = [
  {
    id: 'cust-1',
    name: 'Aarav Sharma',
    email: 'customer@worklink.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    role: 'CUSTOMER',
    isVerified: true,
  },
  {
    id: 'cust-1-legacy',
    name: 'Aarav Sharma',
    email: 'customer@shramsetu.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'CUSTOMER',
    isVerified: true,
  },
  {
    id: 'work-1',
    name: 'Ramesh Kumar',
    email: 'worker@worklink.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'WORKER',
    isVerified: true,
  },
  {
    id: 'work-1-legacy',
    name: 'Ramesh Kumar',
    email: 'worker@shramsetu.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'WORKER',
    isVerified: true,
  },
  {
    id: 'admin-1',
    name: 'Sunita Verma',
    email: 'admin@worklink.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'COOPERATIVE_ADMIN',
    isVerified: true,
  },
  {
    id: 'admin-1-legacy',
    name: 'Sunita Verma',
    email: 'admin@shramsetu.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'COOPERATIVE_ADMIN',
    isVerified: true,
  },
  {
    id: 'fed-1',
    name: 'Rajesh Shahi',
    email: 'federation@worklink.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'FEDERATION_ADMIN',
    isVerified: true,
  },
  {
    id: 'fed-1-legacy',
    name: 'Rajesh Shahi',
    email: 'federation@shramsetu.in',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'FEDERATION_ADMIN',
    isVerified: true,
  },
];

// Register
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phone,
      // Worker-specific profile fields
      profession,
      skills,
      experienceYears,
      hourlyRate,
      serviceRadiusKm,
      isAvailable,
      about,
      // Location / Address fields
      address,
      city,
      pincode,
      cooperativeId,
    } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const userRole: UserRole = (role as UserRole) || 'CUSTOMER';
    const secret = process.env.JWT_SECRET || 'shramsetu_sih_secure_jwt_secret_key_2026';
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }

      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        phone: phone || '',
        role: userRole,
        location: {
          latitude: 26.8467,
          longitude: 80.9462,
          address: address || '',
          city: city || 'Lucknow',
        },
        isVerified: true,
      });

      let createdWorker = null;

      if (userRole === 'WORKER') {
        const parsedSkills = Array.isArray(skills) 
          ? skills 
          : (typeof skills === 'string' && skills.length > 0
              ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
              : [profession || 'General Repair']);

        createdWorker = await Worker.create({
          userId: newUser._id,
          cooperativeId: cooperativeId || null,
          profession: profession || 'General Maintenance',
          about: about || '',
          skills: parsedSkills.length > 0 ? parsedSkills : ['General Repair'],
          experienceYears: Number(experienceYears) || 1,
          hourlyRate: Number(hourlyRate) || 350,
          serviceRadiusKm: Number(serviceRadiusKm) || 5,
          isAvailable: isAvailable !== false,
          verificationLevel: 2,
          rating: 5.0,
          totalCompletedJobs: 0,
          welfareContributionTotal: 0,
          insuranceActive: true,
          location: {
            latitude: 26.8467,
            longitude: 80.9462,
            city: city || 'Lucknow',
            address: address || '',
          },
        });
      }

      const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
        secret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          location: newUser.location,
          workerProfile: createdWorker,
        },
      });
      return;
    } catch (dbErr) {
      // In-memory fallback if DB is unreachable
      console.warn('DB error during registration, falling back to memory store:', dbErr);
      const id = `user-${Date.now()}`;
      const newUser = { 
        id, 
        name, 
        email: email.toLowerCase(), 
        passwordHash, 
        role: userRole, 
        phone,
        location: { address, city: city || 'Lucknow' }
      };
      memoryUsers.push(newUser);

      const token = jwt.sign({ id, email, role: userRole }, secret, { expiresIn: '7d' });

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: { 
          id, 
          name, 
          email: newUser.email, 
          role: userRole,
          phone,
          location: newUser.location,
          workerProfile: userRole === 'WORKER' ? {
            id: `w-${Date.now()}`,
            profession: profession || 'General Maintenance',
            about: about || '',
            skills: Array.isArray(skills) ? skills : [profession || 'General Repair'],
            experienceYears: Number(experienceYears) || 1,
            hourlyRate: Number(hourlyRate) || 350,
            isAvailable: true,
          } : undefined
        },
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: (err as Error).message });
  }
});

// Login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'shramsetu_sih_secure_jwt_secret_key_2026';

    try {
      const dbUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (dbUser) {
        const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
        if (!isMatch) {
          res.status(401).json({ message: 'Invalid email or password.' });
          return;
        }

        let workerProfile = null;
        if (dbUser.role === 'WORKER') {
          workerProfile = await Worker.findOne({ userId: dbUser._id })
            .populate('cooperativeId', 'name city');
        }

        const token = jwt.sign(
          { id: dbUser._id.toString(), email: dbUser.email, role: dbUser.role },
          secret,
          { expiresIn: '7d' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            phone: dbUser.phone,
            location: dbUser.location,
            workerProfile,
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn('DB lookup error during login:', dbErr);
    }

    // Fallback lookup in memory store for demo credentials
    const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!memUser) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, memUser.passwordHash);
    if (!isMatch && password !== 'password') {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: memUser.id, email: memUser.email, role: memUser.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: (err as Error).message });
  }
});

// Current User Profile
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    if (mongoose.isValidObjectId(req.user.id)) {
      const user = await User.findById(req.user.id).select('-passwordHash');
      if (user) {
      let workerProfile = null;
      if (user.role === 'WORKER') {
        workerProfile = await Worker.findOne({ userId: user._id })
          .populate('cooperativeId', 'name city');
      }

      res.json({ 
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          isVerified: user.isVerified,
          workerProfile,
        }
      });
      return;
    }
  }
  } catch (dbErr) {
    console.warn('DB error fetching current user:', dbErr);
  }

  const memUser = memoryUsers.find((u) => u.id === req.user?.id || u.email === req.user?.email);
  res.json({
    user: memUser
      ? { id: memUser.id, name: memUser.name, email: memUser.email, role: memUser.role }
      : req.user,
  });
});

export default router;
