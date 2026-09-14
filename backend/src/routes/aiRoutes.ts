import { Router, Request, Response } from 'express';

const router = Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface DiagnosisResult {
  queryText: string;
  detectedTrade: string;
  requiredSkills: string[];
  recommendedUrgency: string;
  safetyAdvisory: string;
  confidenceScore: number;
  parsedLanguage?: string;
  bookingUrl?: string;
}

interface SuggestedAction {
  label: string;
  action: 'send_message' | 'navigate';
  payload: string;
  isPrimary?: boolean;
}

// Check for emergency keywords across Hindi, Hinglish, English
function isEmergencyQuery(text: string): boolean {
  const emergencyRegex = /smoke|spark|fire|flame|burst|flood|shock|blast|burning|short\s*circuit|dhuan|aag|currant|dhuaan|धुआं|आग|शॉर्ट|करंट|विस्फोट|बाढ़|फटा/i;
  return emergencyRegex.test(text);
}

// Fallback diagnosis rules if AI service is offline
function fallbackDiagnose(text: string): DiagnosisResult {
  const lower = text.toLowerCase();
  
  if (/fan|pankha|pankhe|pankho|switch|board|switchboard|light|batti|roshni|wiring|spark|sparking|mcb|smoke|voltage|shock|bulb|current|currant|power|socket|wire|taar|tar|fuse|bijli|bijlee|inverter|stabilizer|cooler|heater|geyser\s*switch|पंखा|तार|धुआं|करंट|शॉर्ट|बिजली|मीटर|स्विच|बोर्ड|रोशनी|शार्ट|फ्यूज/i.test(lower)) {
    const isEmerg = isEmergencyQuery(text);
    return {
      queryText: text,
      detectedTrade: 'Electrician',
      requiredSkills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
      recommendedUrgency: isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: 'High voltage risk: Please switch off the main circuit breaker (MCB) immediately. Do not touch bare wires or damp outlets.',
      confidenceScore: 0.94,
      bookingUrl: `/customer/dashboard?service=Electrician&urgency=${isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY'}&query=${encodeURIComponent(text)}`,
    };
  }
  
  if (/pipe|paip|leak|leaking|leakage|tap|toti|toty|drain|water|pani|paani|sink|washbasin|basin|flush|sewer|tank|tanki|tankee|overflow|geyser|valve|clog|choke|choked|submersible|motor|नल|पानी|पाइप|टपक|लीक|नाली|टंकी|गीजर/i.test(lower)) {
    const isEmerg = isEmergencyQuery(text) || /burst|flood|heavy/i.test(lower);
    return {
      queryText: text,
      detectedTrade: 'Plumber',
      requiredSkills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings', 'Water Tank Repair'],
      recommendedUrgency: isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: 'Water damage risk: Turn off the main inlet stop valve behind the water meter or tank. Keep electrical appliances clear.',
      confidenceScore: 0.93,
      bookingUrl: `/customer/dashboard?service=Plumber&urgency=${isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY'}&query=${encodeURIComponent(text)}`,
    };
  }

  if (/door|darwaza|darwaja|darwaje|wood|lakdi|lakadi|lock|tala|taala|chabi|hinge|kabza|qabza|cupboard|almirah|almari|table|chair|kursi|bed|palang|drawer|latch|kundi|furniture|badhai|barhai|दरवाजा|ताला|लकड़ी|कब्जा|कुर्सी|मेज़|अलमारी/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Carpenter',
      requiredSkills: ['Woodwork', 'Furniture Assembly', 'Door & Window Locks', 'Hinges'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Structural safety: Ensure loose hinges or door panels do not fall; keep children clear of jammed furniture.',
      confidenceScore: 0.90,
      bookingUrl: `/customer/dashboard?service=Carpenter&urgency=SAME_DAY&query=${encodeURIComponent(text)}`,
    };
  }

  if (/ac|air\s*conditioner|cooling|gas|compressor|filter|chilled|refrigerator|fridge|freezer|washing\s*machine|microwave|thanda|garam\s*hawa|कूलिंग|एसी|गैस|फ्रिज/i.test(lower)) {
    const isGas = /gas|smell|leak|गैस/i.test(lower);
    return {
      queryText: text,
      detectedTrade: 'AC Technician',
      requiredSkills: ['AC Servicing', 'Gas Refill', 'Compressor Repair', 'Appliance Repair'],
      recommendedUrgency: isGas ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: 'Do not attempt DIY refrigerant handling; isolate appliance power switch until certified technician arrives.',
      confidenceScore: 0.90,
      bookingUrl: `/customer/dashboard?service=AC%20Technician&urgency=${isGas ? 'EMERGENCY_45_MIN' : 'SAME_DAY'}&query=${encodeURIComponent(text)}`,
    };
  }

  if (/clean|cleaning|sanitize|wash|washing|sofa|carpet|deep\s*clean|dusting|pest|cockroach|keede|kide|disinfect|safai|dhulai|jhaadu|pochha|सफाई|धुलाई|कीड़े/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Cleaner & Sanitation',
      requiredSkills: ['Deep House Cleaning', 'Sanitization', 'Floor Polishing', 'Kitchen Hygiene'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Ensure proper room ventilation when chemical cleaning agents are utilized.',
      confidenceScore: 0.89,
      bookingUrl: `/customer/dashboard?service=Cleaner%20%26%20Sanitation&urgency=SAME_DAY&query=${encodeURIComponent(text)}`,
    };
  }

  if (/paint|painter|painting|wall|colour|color|distemper|waterproofing|varnish|seepage|seelan|silan|putty|rang|rangai|safedi|deewar|diwar|दीवार|पेंट|रंग/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Painter',
      requiredSkills: ['Interior Painting', 'Wall Putty', 'Exterior Waterproofing', 'Surface Finishing'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Keep area ventilated and cover surrounding sockets and fixtures.',
      confidenceScore: 0.88,
      bookingUrl: `/customer/dashboard?service=Painter&urgency=SAME_DAY&query=${encodeURIComponent(text)}`,
    };
  }

  return {
    queryText: text,
    detectedTrade: 'General Home Maintenance',
    requiredSkills: ['Handyman Maintenance', 'General Household Repair'],
    recommendedUrgency: 'SAME_DAY',
    safetyAdvisory: 'Ensure general workspace safety before worker arrival.',
    confidenceScore: 0.70,
    bookingUrl: `/customer/dashboard?service=General%20Home%20Maintenance&query=${encodeURIComponent(text)}`,
  };
}

// Conversational intent check
function getConversationalResponse(message: string): { response: string; suggestedActions: SuggestedAction[] } | null {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|pranam|hola|greetings|good\s*(morning|evening|afternoon))[\s!.]*$/i.test(lower)) {
    return {
      response: `Namaste! 🙏 I am your **WorkLink AI Sahayak** (Conversational Assistant).\n\nI can help you with:\n• ⚡ **Emergency Repair Diagnosis** (Electrical MCB trips, Plumbing leaks, AC issues)\n• 🔍 **Finding Verified Cooperative Workers** (0% middleman commission)\n• 💼 **Worker Onboarding & Level 4 Verification**\n• 🛡️ **Cooperative Fair Wage Policies & Dual-OTP Security**\n\nHow may I assist you today?`,
      suggestedActions: [
        { label: '⚡ Tripping MCB Switch', action: 'send_message', payload: 'Main electricity MCB switch keeps tripping and sparking' },
        { label: '🚰 Water Pipe Leaking', action: 'send_message', payload: 'Bathroom washbasin pipe is leaking heavily' },
        { label: '💼 Join as Worker', action: 'navigate', payload: '/register?role=worker' },
        { label: '❓ What is WorkLink?', action: 'send_message', payload: 'What is WorkLink and how does it work?' },
      ],
    };
  }

  // What is WorkLink
  if (/what\s*is\s*worklink|about\s*worklink|how\s*does\s*it\s*work|shramsetu/i.test(lower)) {
    return {
      response: `🏛️ **About WorkLink (Code Craft 3.0 / ShramSetu)**\n\nWorkLink is a democratic, cooperative-owned local workforce & services marketplace platform:\n\n1. **0% Aggregator Cut**: 100% of fair wages go straight to cooperative workers without 25% private platform cuts.\n2. **Section 70 Welfare Fund**: 7% of every gig pool is reserved for healthcare cover, tool subsidies, and social protection.\n3. **FairMatch™ 5-Factor Ranking**: Ranks workers scientifically by proximity (25%), skills (30%), availability (20%), cooperative trust (15%), and workload equity (10%).\n4. **Dual-OTP Handshake**: Security with Start OTP at arrival and Completion OTP upon customer satisfaction.`,
      suggestedActions: [
        { label: 'Find a Verified Worker', action: 'navigate', payload: '/customer/dashboard', isPrimary: true },
        { label: 'Explore Services', action: 'navigate', payload: '/services' },
        { label: 'Join Cooperative', action: 'navigate', payload: '/register?role=worker' },
      ],
    };
  }

  // How to register as worker
  if (/worker\s*(registration|join|onboard|apply|sign\s*up)|join\s*as\s*worker/i.test(lower)) {
    return {
      response: `👷 **Join WorkLink as a Certified Cooperative Worker**\n\n1. Register via the portal choosing the **Worker** role.\n2. Select your trades & skills (Electrician, Plumber, Carpentry, Painting, etc.).\n3. Upload government ID and trade certification for the **Cooperative Admin Level 4 Verification Seal**.\n4. Enjoy fair minimum wage floors, 0% middleman fees, and health welfare fund coverage!`,
      suggestedActions: [
        { label: 'Start Worker Registration', action: 'navigate', payload: '/register?role=worker', isPrimary: true },
        { label: 'View Onboarding Guide', action: 'navigate', payload: '/worker/onboarding' },
      ],
    };
  }

  // How to book
  if (/how\s*(to|can\s*i)\s*book|booking\s*process|book\s*a\s*worker/i.test(lower)) {
    return {
      response: `📅 **Booking a Verified Worker on WorkLink**\n\n1. Go to the Customer Portal or describe your repair here.\n2. Choose **⚡ Emergency 45-Min Express** for critical hazards, or **📅 Same-Day** for scheduled visits.\n3. Verify worker credentials, track arrival via GPS, and provide Start OTP upon arrival.\n4. Inspect work and provide Completion OTP to release escrow payment.`,
      suggestedActions: [
        { label: 'Book Worker Now', action: 'navigate', payload: '/customer/dashboard', isPrimary: true },
        { label: 'Browse Services', action: 'navigate', payload: '/services' },
      ],
    };
  }

  // Pricing
  if (/pricing|rate|rates|cost|price|fees|charge/i.test(lower)) {
    return {
      response: `💰 **Statutory Cooperative Fair Pricing Floors**\n\n• **Electrician**: ₹350 - ₹500/hr\n• **Plumber**: ₹300 - ₹450/hr\n• **AC Servicing**: ₹450 - ₹750/hr\n• **Carpenter**: ₹350 - ₹500/hr\n• **Cleaner**: ₹250 - ₹400/hr\n\n*All payments are protected under Dual-OTP escrow. 100% of fair base rates go to the worker member.*`,
      suggestedActions: [
        { label: 'Book Electrician', action: 'navigate', payload: '/customer/dashboard?service=Electrician' },
        { label: 'Book Plumber', action: 'navigate', payload: '/customer/dashboard?service=Plumber' },
      ],
    };
  }

  return null;
}

// Health check
router.get('/health', async (_req: Request, res: Response): Promise<void> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const aiRes = await fetch(`${AI_SERVICE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (aiRes.ok) {
      const data = await aiRes.json();
      res.json({ status: 'ONLINE', microservice: data });
      return;
    }
  } catch (e) {
    // Microservice offline
  }

  res.json({ 
    status: 'DEGRADED', 
    message: 'Python AI microservice offline, using built-in fallback NLP engine' 
  });
});

// Diagnose symptom endpoint
router.post('/diagnose', async (req: Request, res: Response): Promise<void> => {
  const { queryText } = req.body;
  if (!queryText || typeof queryText !== 'string') {
    res.status(400).json({ message: 'queryText string is required' });
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const aiRes = await fetch(`${AI_SERVICE_URL}/api/v1/nlp/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (aiRes.ok) {
      const diagnosis = await aiRes.json();
      res.json({ success: true, diagnosis, source: 'ai_microservice' });
      return;
    }
  } catch (err) {
    // Fall back to local NLP parser
  }

  const fallback = fallbackDiagnose(queryText);
  res.json({ success: true, diagnosis: fallback, source: 'fallback_engine' });
});

// Conversational AI Assistant Chat
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ message: 'message string is required' });
    return;
  }

  // 1. Check if it's a conversational / FAQ question first (unless it contains clear repair symptoms)
  const isSymptom = /fan|pankha|pankhe|switch|board|light|batti|wiring|spark|mcb|smoke|taar|pipe|leak|tap|toti|drain|water|pani|paani|sink|flush|sewer|tanki|door|darwaza|wood|lakdi|lock|tala|hinge|kabza|ac|cooling|compressor|clean|safai|paint|rang|पंखा|तार|धुआं|करंट|शॉर्ट|नल|पानी|पाइप|दरवाजा|ताला/i.test(message);
  
  if (!isSymptom) {
    const conversational = getConversationalResponse(message);
    if (conversational) {
      res.json({
        success: true,
        response: conversational.response,
        suggestedActions: conversational.suggestedActions,
        aiServiceStatus: 'ONLINE_NLP',
      });
      return;
    }

    // Friendly non-symptom general reply (NO false General Home Maintenance)
    res.json({
      success: true,
      response: "Namaste! 🙏 I'm here to assist you with household repair diagnosis, fair pricing, and booking verified cooperative workers.\n\nCould you describe what you need help with (e.g. electrical sparking, plumbing leakage, AC cooling, lock repair) or ask any question about the platform?",
      suggestedActions: [
        { label: '⚡ Electrical Issue', action: 'send_message', payload: 'Main electricity switch keeps tripping' },
        { label: '🚰 Plumbing Leakage', action: 'send_message', payload: 'Water pipe is leaking heavily under sink' },
        { label: '❄️ AC Repair', action: 'send_message', payload: 'AC cooling is low and blowing warm air' },
        { label: '💼 Join as Worker', action: 'navigate', payload: '/register?role=worker' },
      ],
      aiServiceStatus: 'ONLINE_NLP',
    });
    return;
  }

  // 2. Perform diagnosis (check Python microservice first, then robust fallback)
  let diagnosis: DiagnosisResult | null = null;
  let isAiServiceOnline = true;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const aiRes = await fetch(`${AI_SERVICE_URL}/api/v1/nlp/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText: message }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (aiRes.ok) {
      diagnosis = await aiRes.json();
    } else {
      isAiServiceOnline = false;
    }
  } catch (err) {
    isAiServiceOnline = false;
  }

  if (!diagnosis) {
    diagnosis = fallbackDiagnose(message);
  }

  // 3. Construct structured conversational response with safety advisory
  const isEmergency = diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN';
  let chatText = `Namaste! Based on your description, I recommend booking a **${diagnosis.detectedTrade}**.\n\n`;
  
  if (isEmergency) {
    chatText += `⚠️ **High Priority Alert (${diagnosis.recommendedUrgency}):** ${diagnosis.safetyAdvisory}\n\n`;
  } else {
    chatText += `🛡️ **Safety Advisory:** ${diagnosis.safetyAdvisory}\n\n`;
  }

  chatText += `Recommended Trade: **${diagnosis.detectedTrade}**\nRequired Skills: ${diagnosis.requiredSkills.join(', ')}\nUrgency: **${diagnosis.recommendedUrgency}**`;

  const suggestedActions: SuggestedAction[] = [
    {
      label: `Book Verified ${diagnosis.detectedTrade}`,
      action: 'navigate',
      payload: diagnosis.bookingUrl || `/customer/dashboard?service=${encodeURIComponent(diagnosis.detectedTrade)}`,
      isPrimary: true,
    },
    {
      label: 'View Fair Pricing Rates',
      action: 'send_message',
      payload: `What is the rate for a ${diagnosis.detectedTrade}?`,
    },
  ];

  res.json({
    success: true,
    response: chatText,
    diagnosis,
    suggestedActions,
    isEmergency,
    aiServiceStatus: isAiServiceOnline ? 'ONLINE' : 'FALLBACK',
  });
});

export default router;
