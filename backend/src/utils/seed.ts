import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Cooperative from '../models/Cooperative';
import Service from '../models/Service';
import Worker from '../models/Worker';

dotenv.config();

const seed = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shramsetu';
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB');

    await User.deleteMany({});
    await Cooperative.deleteMany({});
    await Service.deleteMany({});
    await Worker.deleteMany({});

    console.log('[Seed] Cleared existing data');

    // Create Cooperatives
    const coop1 = await Cooperative.create({
      name: 'Lucknow Labour Service Cooperative Society Ltd.',
      registrationNumber: 'UP-LKO-COOP-2024-001',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      totalWorkers: 45,
      welfareFundBalance: 125000,
      contactEmail: 'contact@lko-coop.org',
      contactPhone: '+91 9876543210',
    });

    const coop2 = await Cooperative.create({
      name: 'Kanpur Skill Workers Cooperative Federation',
      registrationNumber: 'UP-KNP-FED-2023-088',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      totalWorkers: 120,
      welfareFundBalance: 450000,
      contactEmail: 'info@kanpurworkers.coop',
      contactPhone: '+91 9876500000',
    });

    // Create Base Users & Workers
    const defaultPassword = await bcrypt.hash('password', 10);

    const userCustomer = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@shramsetu.in',
      passwordHash: defaultPassword,
      role: 'CUSTOMER',
      phone: '+91 9988776655',
      isVerified: true,
      location: { latitude: 26.8467, longitude: 80.9462, city: 'Lucknow', address: 'Hazratganj, Lucknow' },
    });

    const userWorker1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'worker@shramsetu.in',
      passwordHash: defaultPassword,
      role: 'WORKER',
      phone: '+91 9876541122',
      isVerified: true,
      location: { latitude: 26.8500, longitude: 80.9500, city: 'Lucknow' },
    });

    await Worker.create({
      userId: userWorker1._id,
      cooperativeId: coop1._id,
      skills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
      experienceYears: 7,
      verificationLevel: 4,
      isAvailable: true,
      serviceRadiusKm: 8,
      hourlyRate: 400,
      rating: 4.9,
      totalCompletedJobs: 142,
      welfareContributionTotal: 7100,
      insuranceActive: true,
      certifications: [
        { title: 'ITI Electrical Certificate', issuer: 'Govt ITI Lucknow', verified: true },
        { title: 'National Safety Skill Council Badge', issuer: 'NSDC India', verified: true },
      ],
      location: { latitude: 26.8500, longitude: 80.9500, city: 'Lucknow' },
    });

    const userAdmin = await User.create({
      name: 'Sunita Verma',
      email: 'admin@shramsetu.in',
      passwordHash: defaultPassword,
      role: 'COOPERATIVE_ADMIN',
      phone: '+91 9123456789',
      isVerified: true,
    });

    const userFed = await User.create({
      name: 'Rajesh Shahi',
      email: 'federation@shramsetu.in',
      passwordHash: defaultPassword,
      role: 'FEDERATION_ADMIN',
      phone: '+91 9999988888',
      isVerified: true,
    });

    // Create Services
    await Service.insertMany([
      {
        name: 'Electrician',
        category: 'Electrical & Power',
        description: 'Ceiling fan repair, MCB installation, wiring, lighting, switchboard fixes.',
        iconName: 'Zap',
        basePrice: 400,
        emergencySupported: true,
        requiredSkills: ['Wiring', 'MCB', 'Fan Repair'],
      },
      {
        name: 'Plumber',
        category: 'Plumbing & Drainage',
        description: 'Pipe leakages, tap replacement, drainage unblocking, water tank installation.',
        iconName: 'Droplets',
        basePrice: 450,
        emergencySupported: true,
        requiredSkills: ['Pipe Repair', 'Leakage', 'Drainage'],
      },
      {
        name: 'Carpenter',
        category: 'Woodwork & Furniture',
        description: 'Door repair, furniture assembly, cabinet hinges, lock replacement.',
        iconName: 'Hammer',
        basePrice: 500,
        emergencySupported: false,
        requiredSkills: ['Woodwork', 'Locks', 'Fittings'],
      },
    ]);

    console.log('[Seed] Successfully seeded ShramSetu database!');
    console.log('Sample Accounts (Password for all: password):');
    console.log(` - Customer: ${userCustomer.email}`);
    console.log(` - Worker: ${userWorker1.email}`);
    console.log(` - Coop Admin: ${userAdmin.email}`);
    console.log(` - Federation Admin: ${userFed.email}`);

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seed();
