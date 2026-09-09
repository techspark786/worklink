import { Router, Response } from 'express';
import Service from '../models/Service';

const router = Router();

const defaultServices = [
  {
    id: 'srv-1',
    name: 'Electrician',
    category: 'Electrical & Power',
    description: 'Ceiling fan repair, MCB installation, wiring, lighting, switchboard fixes.',
    iconName: 'Zap',
    basePrice: 400,
    emergencySupported: true,
    requiredSkills: ['Wiring', 'MCB', 'Fan Repair', 'Safety'],
  },
  {
    id: 'srv-2',
    name: 'Plumber',
    category: 'Plumbing & Drainage',
    description: 'Pipe leakages, tap replacement, drainage unblocking, water tank installation.',
    iconName: 'Droplets',
    basePrice: 450,
    emergencySupported: true,
    requiredSkills: ['Pipe Repair', 'Leakage', 'Drainage', 'Fittings'],
  },
  {
    id: 'srv-3',
    name: 'Carpenter',
    category: 'Woodwork & Furniture',
    description: 'Door repair, furniture assembly, cabinet hinges, lock replacement.',
    iconName: 'Hammer',
    basePrice: 500,
    emergencySupported: false,
    requiredSkills: ['Woodwork', 'Locks', 'Fittings'],
  },
  {
    id: 'srv-4',
    name: 'Painter',
    category: 'Wall & Finishing',
    description: 'Interior touchups, waterproof coating, exterior painting, texture wall art.',
    iconName: 'Paintbrush',
    basePrice: 800,
    emergencySupported: false,
    requiredSkills: ['Painting', 'Wall Prep', 'Waterproofing'],
  },
  {
    id: 'srv-5',
    name: 'Cleaner & Sanitation',
    category: 'Cleaning & Hygiene',
    description: 'Deep house cleaning, bathroom sanitization, sofa & carpet shampooing.',
    iconName: 'Sparkles',
    basePrice: 600,
    emergencySupported: false,
    requiredSkills: ['Deep Clean', 'Sanitization'],
  },
  {
    id: 'srv-6',
    name: 'Domestic Helper',
    category: 'Household Care',
    description: 'Daily housekeeping, cooking assistance, laundry, elderly care assistance.',
    iconName: 'Home',
    basePrice: 350,
    emergencySupported: true,
    requiredSkills: ['Cooking', 'Housekeeping'],
  },
  {
    id: 'srv-7',
    name: 'AC Technician',
    category: 'Appliance Repair',
    description: 'AC servicing, gas refill, compressor troubleshooting, installation.',
    iconName: 'Wind',
    basePrice: 650,
    emergencySupported: true,
    requiredSkills: ['Gas Refill', 'Compressor', 'Servicing'],
  },
  {
    id: 'srv-8',
    name: 'Appliance Repair',
    category: 'Appliance Repair',
    description: 'Washing machine, microwave, refrigerator, RO water purifier repair.',
    iconName: 'Wrench',
    basePrice: 450,
    emergencySupported: true,
    requiredSkills: ['RO Repair', 'Washing Machine', 'Refrigerator'],
  },
];

router.get('/', async (_req, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isActive: true });
    if (services && services.length > 0) {
      res.json({ services });
      return;
    }
  } catch (err) {
    // DB fallback
  }

  res.json({ services: defaultServices });
});

export default router;
