import { Router, Request, Response } from 'express';

const router = Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

interface DiagnosisResult {
  queryText: string;
  detectedTrade: string;
  requiredSkills: string[];
  recommendedUrgency: string;
  safetyAdvisory: string;
  confidenceScore: number;
  parsedLanguage?: string;
}

// Fallback diagnosis rules if AI service is temporarily offline
function fallbackDiagnose(text: string): DiagnosisResult {
  const lower = text.toLowerCase();
  
  if (/fan|switch|board|light|wiring|spark|mcb|smoke|पंखा|तार|धुआं|करंट|शॉर्ट/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Electrician',
      requiredSkills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
      recommendedUrgency: /smoke|spark|fire|धुआं|आग|शॉर्ट/i.test(lower) ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: 'High voltage risk: Please switch off the main circuit breaker (MCB) immediately.',
      confidenceScore: 0.88,
    };
  }
  
  if (/pipe|leak|tap|drain|water|sink|flush|sewer|नल|पानी|पाइप|टपक|लीक|नाली/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Plumber',
      requiredSkills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings', 'Water Tank Repair'],
      recommendedUrgency: /flood|burst|overflow|बाढ़/i.test(lower) ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: 'Water damage risk: Turn off the main inlet valve behind the meter or tank.',
      confidenceScore: 0.88,
    };
  }

  if (/door|wood|lock|hinge|cupboard|table|chair|दरवाजा|ताला|लकड़ी|कब्जा|कुर्सी/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Carpenter',
      requiredSkills: ['Woodwork', 'Furniture Assembly', 'Door & Window Locks', 'Hinges'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Ensure no loose hinges fall; keep pets and children clear of jammed doors.',
      confidenceScore: 0.85,
    };
  }

  if (/ac|cooling|gas|compressor|filter|chilled|कूलिंग|एसी|गैस/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'AC Technician',
      requiredSkills: ['AC Servicing', 'Gas Refill', 'Compressor Repair', 'Appliance Repair'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Do not attempt DIY refrigerant handling; keep AC isolated until certified technician inspects.',
      confidenceScore: 0.85,
    };
  }

  if (/clean|sanitize|wash|sofa|carpet|deep clean|सफाई|धुलाई/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Cleaner & Sanitation',
      requiredSkills: ['Deep House Cleaning', 'Sanitization', 'Floor Polishing', 'Kitchen Hygiene'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Ensure proper room ventilation when chemical cleaning agents are utilized.',
      confidenceScore: 0.85,
    };
  }

  return {
    queryText: text,
    detectedTrade: 'General Home Maintenance',
    requiredSkills: ['Handyman Maintenance', 'General Household Repair'],
    recommendedUrgency: 'SAME_DAY',
    safetyAdvisory: 'Ensure general workspace safety before worker arrival.',
    confidenceScore: 0.70,
  };
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
    const timeout = setTimeout(() => controller.abort(), 3000);
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
    console.warn('AI microservice request failed, falling back to local NLP parser');
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

  let diagnosis: DiagnosisResult | null = null;
  let isAiServiceOnline = true;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
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
    console.warn('AI Service communication error:', (err as Error).message);
  }

  // If AI service completely offline and requested failure response
  if (!diagnosis && !isAiServiceOnline) {
    // Generate graceful response with fallback diagnosis
    diagnosis = fallbackDiagnose(message);
  }

  if (!diagnosis) {
    res.status(503).json({
      success: false,
      response: 'AI Assistant is temporarily unavailable. Please check the AI configuration.',
    });
    return;
  }

  // Construct structured conversational response
  const isEmergency = diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN';
  let chatText = `Namaste! Based on your description, I recommend booking a **${diagnosis.detectedTrade}**.\n\n`;
  
  if (isEmergency) {
    chatText += `⚠️ **High Priority Alert (${diagnosis.recommendedUrgency}):** ${diagnosis.safetyAdvisory}\n\n`;
  } else {
    chatText += `🛡️ **Safety Advisory:** ${diagnosis.safetyAdvisory}\n\n`;
  }

  chatText += `Recommended Trade: **${diagnosis.detectedTrade}**\nRequired Skills: ${diagnosis.requiredSkills.join(', ')}\nUrgency: **${diagnosis.recommendedUrgency}**`;

  res.json({
    success: true,
    response: chatText,
    diagnosis,
    aiServiceStatus: isAiServiceOnline ? 'ONLINE' : 'FALLBACK',
  });
});

export default router;
