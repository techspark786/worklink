export interface DiagnosisResult {
  queryText: string;
  detectedTrade: string;
  requiredSkills: string[];
  recommendedUrgency: 'EMERGENCY_45_MIN' | 'SAME_DAY' | 'SCHEDULED';
  safetyAdvisory: string;
  confidenceScore: number;
  parsedLanguage?: string;
  bookingUrl?: string;
}

export interface SuggestedAction {
  label: string;
  action: 'send_message' | 'navigate';
  payload: string;
  isPrimary?: boolean;
}

export interface AiChatResponse {
  success: boolean;
  response: string;
  diagnosis?: DiagnosisResult;
  suggestedActions?: SuggestedAction[];
  source: 'gemini' | 'domain_engine';
  isEmergency?: boolean;
}

// Check for emergency keywords across Hindi, Hinglish, English
function isEmergencyQuery(text: string): boolean {
  const emergencyRegex = /smoke|spark|fire|flame|burst|flood|shock|blast|burning|short\s*circuit|dhuan|aag|currant|dhuaan|धुआं|आग|शॉर्ट|करंट|विस्फोट|बाढ़|फटा/i;
  return emergencyRegex.test(text);
}

// Detect language
function detectLanguage(text: string): 'hi' | 'en' | 'hinglish' {
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  if (/kare|karna|chahiye|nahi|chal\s*raha|aa\s*raha|ho\s*raha|pani|bijli|pankha|kharab|gaya|gya|hai|karo|bhai|batao|kripya|mera|meri|mere|kaam|tut|toot|hua|hawa|band/i.test(text)) {
    return 'hinglish';
  }
  return 'en';
}

// Domain Diagnosis Engine
export function diagnoseIssue(text: string): DiagnosisResult | null {
  const lower = text.toLowerCase();
  const lang = detectLanguage(text);

  // 1. Electrician (supports English, Hindi Devanagari, and Hinglish Romanized)
  if (/fan|pankha|pankhe|pankho|switch|board|switchboard|light|batti|roshni|wiring|spark|sparking|mcb|smoke|voltage|shock|bulb|current|currant|power|socket|wire|taar|tar|fuse|bijli|bijlee|inverter|stabilizer|cooler|heater|geyser\s*switch|पंखा|तार|धुआं|करंट|शॉर्ट|बिजली|मीटर|स्विच|बोर्ड|रोशनी|शार्ट|फ्यूज/i.test(lower)) {
    const isEmerg = isEmergencyQuery(text);
    return {
      queryText: text,
      detectedTrade: 'Electrician',
      requiredSkills: ['Electrical Wiring', 'MCB Fixing', 'Ceiling Fan Repair', 'Safety Protocols'],
      recommendedUrgency: isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: isEmerg 
        ? 'High Voltage Hazard: Switch off your main distribution MCB breaker immediately. Do not touch outlets, switches, or pooled water.'
        : 'Ensure main breaker is accessible. Avoid operating flickering switches or bare wires.',
      confidenceScore: 0.94,
      parsedLanguage: lang,
      bookingUrl: `/customer/dashboard?service=Electrician&urgency=${isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY'}&query=${encodeURIComponent(text)}`,
    };
  }

  // 2. Plumber (supports English, Hindi Devanagari, and Hinglish Romanized)
  if (/pipe|paip|leak|leaking|leakage|tap|toti|toty|drain|water|pani|paani|sink|washbasin|basin|flush|sewer|tank|tanki|tankee|overflow|geyser|valve|clog|choke|choked|submersible|motor|नल|पानी|पाइप|टपक|लीक|नाली|गीजर|टंकी|सीवर/i.test(lower)) {
    const isEmerg = isEmergencyQuery(text) || /heavy|burst|overflow|flooding|बाढ़|तेज़/i.test(lower);
    return {
      queryText: text,
      detectedTrade: 'Plumber',
      requiredSkills: ['Pipe Fitting', 'Leakage Fix', 'Sanitary Fittings', 'Water Tank Repair'],
      recommendedUrgency: isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: 'Water Damage Hazard: Turn off the main inlet stop-cock valve behind your water meter or overhead tank. Keep power appliances away from damp areas.',
      confidenceScore: 0.93,
      parsedLanguage: lang,
      bookingUrl: `/customer/dashboard?service=Plumber&urgency=${isEmerg ? 'EMERGENCY_45_MIN' : 'SAME_DAY'}&query=${encodeURIComponent(text)}`,
    };
  }

  // 3. Carpenter (supports English, Hindi Devanagari, and Hinglish Romanized)
  if (/door|darwaza|darwaja|darwaje|wood|lakdi|lakadi|lock|tala|taala|chabi|hinge|kabza|qabza|cupboard|almirah|almari|table|chair|kursi|bed|palang|drawer|latch|kundi|furniture|badhai|barhai|दरवाजा|ताला|लकड़ी|कब्जा|कुर्सी|मेज़|अलमारी|पलंग/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Carpenter',
      requiredSkills: ['Woodwork', 'Furniture Assembly', 'Door & Window Locks', 'Hinges'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Structural Safety: Do not force jammed doors or compromised hinges to prevent heavy panels from falling. Keep children clear of unstable furniture.',
      confidenceScore: 0.90,
      parsedLanguage: lang,
      bookingUrl: `/customer/dashboard?service=Carpenter&urgency=SAME_DAY&query=${encodeURIComponent(text)}`,
    };
  }

  // 4. AC & Appliance Technician
  if (/ac|air\s*conditioner|cooling|gas|compressor|filter|chilled|refrigerator|fridge|freezer|washing\s*machine|microwave|thanda|garam\s*hawa|कूलिंग|एसी|गैस|फ्रिज|वाशिंग\s*मशीन/i.test(lower)) {
    const isGasLeak = /gas|smell|hiss|leak|गैस/i.test(lower);
    return {
      queryText: text,
      detectedTrade: 'AC Technician',
      requiredSkills: ['AC Servicing', 'Gas Refill', 'Compressor Repair', 'Appliance Repair'],
      recommendedUrgency: isGasLeak ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
      safetyAdvisory: isGasLeak 
        ? 'Refrigerant Warning: Ventilate the room immediately and avoid spark-generating switches. Keep unit turned OFF.'
        : 'Isolate appliance power switch. Avoid DIY internal disassembly of pressurized components.',
      confidenceScore: 0.90,
      parsedLanguage: lang,
      bookingUrl: `/customer/dashboard?service=AC%20Technician&urgency=${isGasLeak ? 'EMERGENCY_45_MIN' : 'SAME_DAY'}&query=${encodeURIComponent(text)}`,
    };
  }

  // 5. House Cleaning & Sanitation
  if (/clean|cleaning|sanitize|wash|washing|sofa|carpet|deep\s*clean|dusting|pest|cockroach|keede|kide|disinfect|safai|dhulai|jhaadu|pochha|सफाई|धुलाई|कीड़े|सैनिटाइज/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Cleaner & Sanitation',
      requiredSkills: ['Deep House Cleaning', 'Sanitization', 'Floor Polishing', 'Kitchen Hygiene'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Chemical Hygiene: Keep windows open for adequate cross-ventilation when sanitizing solutions are utilized.',
      confidenceScore: 0.89,
      parsedLanguage: lang,
      bookingUrl: `/customer/dashboard?service=Cleaner%20%26%20Sanitation&urgency=SAME_DAY&query=${encodeURIComponent(text)}`,
    };
  }

  // 6. Painter
  if (/paint|painter|painting|wall|colour|color|distemper|waterproofing|varnish|seepage|seelan|silan|putty|rang|rangai|safedi|deewar|diwar|दीवार|पेंट|रंग|पुट्टी|सीलन/i.test(lower)) {
    return {
      queryText: text,
      detectedTrade: 'Painter',
      requiredSkills: ['Interior Painting', 'Wall Putty', 'Exterior Waterproofing', 'Surface Finishing'],
      recommendedUrgency: 'SAME_DAY',
      safetyAdvisory: 'Surface Caution: Ensure proper ventilation and protect surrounding electrical fixtures prior to surface prep.',
      confidenceScore: 0.88,
      parsedLanguage: lang,
      bookingUrl: `/customer/dashboard?service=Painter&urgency=SAME_DAY&query=${encodeURIComponent(text)}`,
    };
  }

  return null;
}

// Conversational Domain Engine (for non-symptom or general guidance queries)
export function handleConversationalQuery(message: string): AiChatResponse {
  const text = message.trim();
  const lower = text.toLowerCase();
  const lang = detectLanguage(text);

  // 1. Check for repair symptom diagnosis first
  const diagnosis = diagnoseIssue(text);
  if (diagnosis) {
    const isEmerg = diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN';
    let responseText = '';

    if (lang === 'hi' || lang === 'hinglish') {
      responseText = `नमस्ते! आपकी समस्या के आधार पर, हम एक प्रमाणित **${diagnosis.detectedTrade} (कारीगर)** बुक करने की सलाह देते हैं।\n\n`;
      if (isEmerg) {
        responseText += `⚠️ **उच्च प्राथमिकता आपातकालीन चेतावनी (${diagnosis.recommendedUrgency}):**\n${diagnosis.safetyAdvisory}\n\n`;
      } else {
        responseText += `🛡️ **सुरक्षा सलाह:**\n${diagnosis.safetyAdvisory}\n\n`;
      }
      responseText += `• **अनुशंसित ट्रेड:** ${diagnosis.detectedTrade}\n• **आवश्यक कौशल:** ${diagnosis.requiredSkills.join(', ')}\n• **प्राथमिकता:** ${isEmerg ? '⚡ 45 मिनट एक्सप्रेस आपातकाल' : '📅 उसी दिन सेवा (Same Day)'}\n• **सहकारी गारंटी:** 0% बिचौलिया कमीशन व 100% उचित मजदूरी`;
    } else {
      responseText = `Namaste! Based on your problem description, I recommend booking a certified **${diagnosis.detectedTrade}** from our registered Labour Cooperatives.\n\n`;
      if (isEmerg) {
        responseText += `⚠️ **High Priority Emergency Alert (${diagnosis.recommendedUrgency}):**\n${diagnosis.safetyAdvisory}\n\n`;
      } else {
        responseText += `🛡️ **Safety Advisory:**\n${diagnosis.safetyAdvisory}\n\n`;
      }
      responseText += `• **Recommended Trade:** ${diagnosis.detectedTrade}\n• **Required Skills:** ${diagnosis.requiredSkills.join(', ')}\n• **Urgency:** ${isEmerg ? '⚡ 45-Min Express Emergency' : '📅 Same Day Service'}\n• **Cooperative Guarantee:** 100% Fair Wage & Dual-OTP Security`;
    }

    return {
      success: true,
      response: responseText,
      diagnosis,
      isEmergency: isEmerg,
      suggestedActions: [
        {
          label: `Book Verified ${diagnosis.detectedTrade}`,
          action: 'navigate',
          payload: diagnosis.bookingUrl || `/customer/dashboard?service=${encodeURIComponent(diagnosis.detectedTrade)}`,
          isPrimary: true,
        },
        {
          label: 'View Fair Pricing Rates',
          action: 'send_message',
          payload: `What is the fair pricing rate for a ${diagnosis.detectedTrade}?`,
        },
        {
          label: 'Emergency Safety Steps',
          action: 'send_message',
          payload: `What safety steps should I take for this ${diagnosis.detectedTrade} issue?`,
        },
      ],
      source: 'domain_engine',
    };
  }

  // 2. Greetings
  if (/^(hi|hello|hey|namaste|pranam|ram ram|hola|greetings|sup|good\s*(morning|evening|afternoon))[\s!.]*$/i.test(lower)) {
    const greetingText = lang === 'hi' 
      ? `नमस्ते! 🙏 मैं **WorkLink AI सहायक** हूँ।\n\nमैं आपकी घरेलू मरम्मत, कारीगर चयन, सुरक्षा जांच और श्रम सहकारी सेवाओं में पूरी सहायता कर सकता हूँ।\n\nआप किसी भी समस्या (जैसे: "पंखा नहीं चल रहा", "नल से पानी टपक रहा है") को लिख सकते हैं या नीचे दिए गए विकल्पों पर क्लिक कर सकते हैं:`
      : `Namaste! 🙏 I am your **WorkLink AI Sahayak**.\n\nI can assist you with:\n• ⚡ **Repair Diagnosis & Safety Alerts** (Electrical, Plumbing, AC, Carpentry)\n• ⚖️ **FairMatch™ Cooperative Allocation** (0% Middleman Cut)\n• 📅 **Booking Verified Cooperative Technicians**\n• 💼 **Worker Onboarding & Level 4 Seal Verification**\n\nHow can I help you today?`;

    return {
      success: true,
      response: greetingText,
      suggestedActions: [
        { label: '⚡ Main MCB Tripping', action: 'send_message', payload: 'Main electricity MCB switch keeps tripping and sparking' },
        { label: '🚰 Water Pipe Leaking', action: 'send_message', payload: 'Kitchen sink pipe is leaking water heavily' },
        { label: '❄️ AC Warm Air / Not Cooling', action: 'send_message', payload: 'Split AC is blowing warm air and not cooling' },
        { label: '❓ What is WorkLink?', action: 'send_message', payload: 'What is WorkLink and how does it work?' },
      ],
      source: 'domain_engine',
    };
  }

  // 3. How are you / Well-being
  if (/how\s*are\s*you|kaise\s*ho|kya\s*haal|how('s|\s*is)\s*it\s*going/i.test(lower)) {
    return {
      success: true,
      response: lang === 'hi'
        ? `मैं बहुत बढ़िया हूँ, पूछने के लिए धन्यवाद! 😊🙏\n\nमैं आपकी घरेलू मरम्मत के निदान, उचित दर की जानकारी या सत्यापित सहकारी कारीगर बुक करने में सहायता के लिए हमेशा तैयार हूँ। आप आज क्या ठीक करवाना चाहते हैं?`
        : `I'm doing great, thank you for asking! 😊🙏\n\nI'm ready to help you diagnose household repair issues, find fair wage rates, or book certified cooperative workers. How is your day going, and how may I assist you?`,
      suggestedActions: [
        { label: '⚡ Electrician Repair', action: 'send_message', payload: 'Need an electrician for ceiling fan and switchboard' },
        { label: '🚰 Plumber Repair', action: 'send_message', payload: 'Water pipe is leaking heavily under sink' },
        { label: '❄️ AC Servicing', action: 'send_message', payload: 'AC cooling is low and blowing warm air' },
        { label: '💼 Join as Worker', action: 'navigate', payload: '/register?role=worker' },
      ],
      source: 'domain_engine',
    };
  }

  // 4. Who are you / Identity
  if (/who\s*are\s*you|what\s*is\s*your\s*name|who\s*made\s*you|aap\s*kaun\s*ho|tum\s*kaun\s*ho/i.test(lower)) {
    return {
      success: true,
      response: `🤖 **I am WorkLink AI Sahayak**\n\nI am your smart virtual assistant built for **WorkLink (Code Craft 3.0 / ShramSetu)**. My goal is to make local services fair, transparent, and safe by:\n\n• Diagnosing electrical, plumbing, carpentry, AC, and cleaning issues.\n• Flagging critical hazards (sparks, floods, gas leaks) with urgent safety advisories.\n• Connecting you directly with certified members of Section 70 registered Labour Cooperatives.\n• Ensuring 0% middleman exploitation with guaranteed fair wages.`,
      suggestedActions: [
        { label: 'Find a Verified Worker', action: 'navigate', payload: '/customer/dashboard', isPrimary: true },
        { label: 'Explore Services', action: 'navigate', payload: '/services' },
        { label: 'How to Book?', action: 'send_message', payload: 'How do I book a worker?' },
      ],
      source: 'domain_engine',
    };
  }

  // 5. Capabilities / What can you do / Help
  if (/what\s*can\s*you\s*do|help|features|capabilities|madad|kya\s*kar\s*sakte/i.test(lower)) {
    return {
      success: true,
      response: `✨ **Here is how I can assist you:**\n\n1. 🛠️ **Diagnose Household Repairs**: Tell me what's broken in Hindi or English (e.g. *"पंखा नहीं चल रहा"* or *"water pipe leaking"*).\n2. ⚡ **Emergency Safety Warnings**: Immediate instructions for tripping MCBs, sparks, water pipe bursts, or gas leaks.\n3. ⚖️ **Cooperative Fair Wages**: Transparent rates without aggregator commissions.\n4. 📅 **Instant 1-Click Booking**: Find verified workers nearby using FairMatch™.\n5. 👷 **Worker Onboarding**: Guidance on registration, certification, and cooperative welfare benefits.`,
      suggestedActions: [
        { label: '⚡ Tripping MCB', action: 'send_message', payload: 'Main electricity MCB switch keeps tripping and sparking' },
        { label: '🚰 Leaking Pipe', action: 'send_message', payload: 'Kitchen sink pipe is leaking water heavily' },
        { label: '💰 Check Pricing', action: 'send_message', payload: 'What are the pricing rates for services?' },
        { label: '💼 Join as Worker', action: 'navigate', payload: '/register?role=worker' },
      ],
      source: 'domain_engine',
    };
  }

  // 6. Gratitude / Thanks
  if (/(thanks|thank\s*you|dhanyawad|shukriya|shukriyaa|grateful|appreciate|great\s*job|good\s*job)/i.test(lower)) {
    return {
      success: true,
      response: `You're very welcome! 😊 Glad I could help.\n\nFeel free to ask whenever you need a repair diagnosed or want to connect with certified cooperative workers. Have a wonderful day! 🙏`,
      suggestedActions: [
        { label: 'Find a Worker', action: 'navigate', payload: '/customer/dashboard', isPrimary: true },
        { label: 'Browse All Services', action: 'navigate', payload: '/services' },
      ],
      source: 'domain_engine',
    };
  }

  // 7. Acknowledgement / OK / Alright / Bye
  if (/(^(ok|okay|alright|theek\s*hai|got\s*it|sure|understood)[\s!.]*$)|bye|goodbye|alvida|tata/i.test(lower)) {
    return {
      success: true,
      response: lower.includes('bye') || lower.includes('alvida')
        ? `Goodbye! Stay safe, and remember WorkLink is here whenever you need verified local services. 🙏`
        : `Understood! Let me know if you need assistance with any home repairs, checking service prices, or booking a verified cooperative professional. 👍`,
      suggestedActions: [
        { label: 'Book a Service', action: 'navigate', payload: '/customer/dashboard' },
        { label: 'View Fair Rates', action: 'send_message', payload: 'What are the fair pricing rates?' },
      ],
      source: 'domain_engine',
    };
  }


  // 8. What is WorkLink / ShramSetu / Cooperative Platform
  if (/what\s*is\s*worklink|about\s*worklink|shramsetu|cooperative|how\s*does\s*it\s*work|worklink\s*kya\s*hai/i.test(lower)) {
    return {
      success: true,
      response: `🏛️ **About WorkLink (Code Craft 3.0 / ShramSetu)**\n\nWorkLink is a democratic, cooperative-powered local workforce & services marketplace built for Code Craft 3.0.\n\n**Key Differentiators:**\n1. **0% Aggregator Commission**: Unlike private corporate aggregators who take 20-30% cuts, WorkLink passes 100% of fair wages directly to cooperative worker members.\n2. **Section 70 Welfare Shield**: 7% of every gig is contributed to worker social security, healthcare pools, and tool subsidies.\n3. **FairMatch™ 5-Factor Ranking**: Algorithms balance proximity (25%), skills (30%), availability (20%), cooperative trust (15%), and workload equity (10%).\n4. **Dual-OTP Security**: Customers provide a Start OTP upon worker arrival and a Completion OTP only after 100% job satisfaction.`,
      suggestedActions: [
        { label: 'Find a Verified Worker', action: 'navigate', payload: '/customer/dashboard', isPrimary: true },
        { label: 'Explore All Services', action: 'navigate', payload: '/services' },
        { label: 'Join Cooperative', action: 'navigate', payload: '/register?role=worker' },
      ],
      source: 'domain_engine',
    };
  }

  // 9. How to Register as Worker / Join Cooperative
  if (/worker\s*(registration|join|onboard|apply|kaise\s*bane|banna\s*hai)|join\s*as\s*worker/i.test(lower)) {
    return {
      success: true,
      response: `👷 **Join WorkLink as a Certified Cooperative Member**\n\nWorkLink empowers skilled gig workers through registered Labour Cooperatives:\n\n1. **Register Online**: Create an account with your phone, trade expertise, and experience.\n2. **Select Skills**: Choose your trades (Electrical, Plumbing, Carpentry, Painting, etc.).\n3. **Upload Certifications**: Submit trade certificates or ITI diplomas for **Level 4 Cooperative Admin Seal**.\n4. **100% Fair Wage Guarantee**: Earn directly with guaranteed statutory wage floors and healthcare pool coverage.\n\nReady to get started? Click below to start onboarding!`,
      suggestedActions: [
        { label: 'Start Worker Registration', action: 'navigate', payload: '/register?role=worker', isPrimary: true },
        { label: 'View Worker Onboarding Guide', action: 'navigate', payload: '/worker/onboarding' },
        { label: 'Explore Welfare Benefits', action: 'send_message', payload: 'What are the Section 70 Welfare Fund benefits?' },
      ],
      source: 'domain_engine',
    };
  }

  // 10. How to Book a Service
  if (/how\s*(to|can\s*i)\s*book|booking\s*process|book\s*a\s*service|kaise\s*book\s*kare/i.test(lower)) {
    return {
      success: true,
      response: `📅 **How to Book on WorkLink in 3 Easy Steps**\n\n1. **Search or Diagnose**: Describe your problem or pick a trade (Electrician, Plumber, AC, Carpenter, etc.).\n2. **Select Urgency**: Choose **⚡ Emergency 45-Min Express** for critical leaks or power outages, or **📅 Same-Day / Scheduled** for routine maintenance.\n3. **Dual-OTP Confirmation**: Review worker profile with verified cooperative badges. Share Start OTP when the technician arrives, and Completion OTP when satisfied.`,
      suggestedActions: [
        { label: 'Go to Customer Portal', action: 'navigate', payload: '/customer/dashboard', isPrimary: true },
        { label: 'Explore Service Catalog', action: 'navigate', payload: '/services' },
      ],
      source: 'domain_engine',
    };
  }

  // 11. Pricing, Rates & Minimum Wages
  if (/pricing|rate|cost|fees|price|charge|kharcha|kitna\s*lagega/i.test(lower)) {
    return {
      success: true,
      response: `💰 **Transparent Cooperative Fair Pricing Architecture**\n\nWorkLink implements statutory minimum wage floors compliant with the State Labour Gazette to prevent worker exploitation:\n\n• **Electrician**: ₹350 - ₹500 / hr (MCB, wiring, fixtures)\n• **Plumber**: ₹300 - ₹450 / hr (leakages, pipe fitments)\n• **AC & Refrigeration**: ₹450 - ₹750 / hr (gas refill, diagnostics)\n• **Carpenter**: ₹350 - ₹500 / hr (locks, hinges, cabinetry)\n• **Deep Cleaning**: ₹250 - ₹400 / hr (sanitization, surface care)\n\n*Emergency 45-Min Express dispatches include a standard statutory mobilization multiplier with 100% going to the worker.*`,
      suggestedActions: [
        { label: 'Book Electrician', action: 'navigate', payload: '/customer/dashboard?service=Electrician' },
        { label: 'Book Plumber', action: 'navigate', payload: '/customer/dashboard?service=Plumber' },
      ],
      source: 'domain_engine',
    };
  }

  // 12. Grievances, Complaints & Safety
  if (/complaint|dispute|grievance|problem|shikayat|refund|cancel/i.test(lower)) {
    return {
      success: true,
      response: `🛡️ **WorkLink Grievance & Dispute Redressal Mechanism**\n\nWe provide institutional consumer and worker protection:\n\n1. **Cooperative Arbitration**: Complaints are handled transparently by cooperative administrators, not automated bots.\n2. **Dual-OTP Shield**: Payments remain protected in escrow until you approve the Completion OTP.\n3. **File a Dispute**: You can submit a grievance ticket directly with photo evidence and order IDs.`,
      suggestedActions: [
        { label: 'Submit Grievance Ticket', action: 'navigate', payload: '/admin/complaints', isPrimary: true },
        { label: 'View Customer Bookings', action: 'navigate', payload: '/customer/bookings' },
      ],
      source: 'domain_engine',
    };
  }

  // 13. General / Natural Conversational Fallback (NO false "General Home Maintenance" card!)
  return {
    success: true,
    response: lang === 'hi'
      ? `नमस्ते! मैं आपकी बात समझ रहा हूँ। 🙏\n\nकृपया अपनी समस्या बताएं—जैसे बिजली का फॉल्ट, पानी की लीकेज, बढ़ईगीरी, या एसी रिपेयर। आप नीचे दिए गए त्वरित विकल्पों में से भी चुन सकते हैं:`
      : `I'm here to help! 🙏\n\nCould you describe the household repair or platform question you have in mind? For example, you can tell me about electrical tripping, plumbing leaks, AC cooling, carpentry, or ask about booking cooperative workers.\n\nYou can also pick from these common topics:`,
    diagnosis: undefined,
    suggestedActions: [
      { label: '⚡ Electrical Issue', action: 'send_message', payload: 'Main electricity MCB switch keeps tripping' },
      { label: '🚰 Plumbing Leakage', action: 'send_message', payload: 'Water pipe is leaking heavily under sink' },
      { label: '❄️ AC Repair', action: 'send_message', payload: 'AC cooling is low and blowing warm air' },
      { label: '💼 Join as Worker', action: 'navigate', payload: '/register?role=worker' },
    ],
    source: 'domain_engine',
  };
}

// Call Google Gemini API if key is available
export async function callGeminiApi(
  message: string,
  apiKey: string,
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
): Promise<AiChatResponse | null> {
  try {
    const systemPrompt = `You are WorkLink AI Sahayak, the intelligent, vernacular AI Assistant for WorkLink (Code Craft 3.0 / ShramSetu) — a cooperative-owned local workforce & services marketplace platform.
Key platform facts:
- Owned by Section 70 registered Labour Cooperatives.
- 0% middleman commission (100% of fair wages go directly to worker members).
- 7% Section 70 Welfare Fund pooled for medical insurance, tool subsidies, and social security.
- Dual-OTP verification: Start OTP on worker doorstep arrival, Completion OTP upon customer satisfaction.
- FairMatch™ 5-factor algorithmic ranking (proximity, verified skills, availability, cooperative trust, workload equity).
- Available trades: Electrician, Plumber, Carpenter, AC & Appliance Technician, Painter, Cleaner & Sanitation, Masonry.
- Urgency tiers: EMERGENCY_45_MIN (for hazardous leaks, smoke, sparking MCBs, gas) and SAME_DAY / SCHEDULED.

Guidelines:
1. Warm, respectful, helpful tone (Namaste!). Support Hindi, Hinglish, and English fluently.
2. If the user describes a household repair issue or symptom:
   - Identify the primary trade (e.g. Electrician, Plumber, Carpenter, AC Technician, Painter, Cleaner).
   - Evaluate safety risks immediately and give urgent safety instructions (e.g. switch off MCB, shut main water valve).
   - Determine urgency (EMERGENCY_45_MIN vs SAME_DAY).
   - At the very end of your response, output a strict JSON block wrapped in \`\`\`json ... \`\`\` containing:
     {"detectedTrade": string, "requiredSkills": string[], "recommendedUrgency": "EMERGENCY_45_MIN" | "SAME_DAY", "safetyAdvisory": string}
3. If the user asks about the platform, registration, pricing, grievances, or how to book, answer thoroughly with Markdown formatting.`;

    const contents = [
      ...history,
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Message: ${message}` }],
      },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn('Gemini API returned status', response.status);
      return null;
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) return null;

    // Extract diagnosis JSON if present
    let diagnosis: DiagnosisResult | undefined = undefined;
    const jsonMatch = textOutput.match(/```json\s*([\s\S]*?)\s*```/);
    let cleanResponse = textOutput;

    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.detectedTrade) {
          diagnosis = {
            queryText: message,
            detectedTrade: parsed.detectedTrade,
            requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : ['General Maintenance'],
            recommendedUrgency: parsed.recommendedUrgency === 'EMERGENCY_45_MIN' ? 'EMERGENCY_45_MIN' : 'SAME_DAY',
            safetyAdvisory: parsed.safetyAdvisory || 'Ensure workspace safety before technician arrival.',
            confidenceScore: 0.95,
            bookingUrl: `/customer/dashboard?service=${encodeURIComponent(parsed.detectedTrade)}&urgency=${parsed.recommendedUrgency || 'SAME_DAY'}&query=${encodeURIComponent(message)}`,
          };
        }
        cleanResponse = textOutput.replace(/```json[\s\S]*?```/, '').trim();
      } catch (e) {
        console.warn('Failed to parse Gemini diagnosis JSON', e);
      }
    }

    // If no JSON was embedded but domain rules match a trade, supplement it
    if (!diagnosis) {
      const fallbackDiagnosis = diagnoseIssue(message);
      if (fallbackDiagnosis) {
        diagnosis = fallbackDiagnosis;
      }
    }

    const isEmerg = diagnosis?.recommendedUrgency === 'EMERGENCY_45_MIN';

    return {
      success: true,
      response: cleanResponse,
      diagnosis,
      isEmergency: isEmerg,
      suggestedActions: diagnosis ? [
        {
          label: `Book Verified ${diagnosis.detectedTrade}`,
          action: 'navigate',
          payload: diagnosis.bookingUrl || `/customer/dashboard?service=${encodeURIComponent(diagnosis.detectedTrade)}`,
          isPrimary: true,
        },
        {
          label: 'Check Fair Rates',
          action: 'send_message',
          payload: `What is the hourly rate for ${diagnosis.detectedTrade}?`,
        },
      ] : [
        { label: 'Book a Worker', action: 'navigate', payload: '/customer/dashboard' },
        { label: 'Join Cooperative', action: 'navigate', payload: '/register?role=worker' },
      ],
      source: 'gemini',
    };
  } catch (err) {
    console.warn('Gemini API invocation failed, switching to domain engine:', err);
    return null;
  }
}

// Master Chat Processing Function
export async function processAiMessage(message: string): Promise<AiChatResponse> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim() !== '') {
    const geminiResult = await callGeminiApi(message, geminiApiKey.trim());
    if (geminiResult) {
      return geminiResult;
    }
  }

  // Domain engine (always available, instant, 100% resilient)
  return handleConversationalQuery(message);
}
