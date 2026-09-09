import re
from typing import Dict, Any, List

class VernacularSymptomParser:
    """
    SIH 2026 Multilingual Vernacular Symptom Parser.
    Understands plain text and voice transcriptions in Hindi (Devanagari), Hinglish, and English.
    """

    KEYWORD_MAPPINGS = {
        "Electrician": {
            "keywords": ["fan", "switch", "board", "light", "wiring", "spark", "mcb", "smoke", "पंखा", "तार", "धुआं", "करंट", "शॉर्ट"],
            "skills": ["Electrical Wiring", "MCB Fixing", "Ceiling Fan Repair", "Safety Protocols"],
            "safety": "High voltage risk: Please switch off the main circuit breaker (MCB) immediately."
        },
        "Plumber": {
            "keywords": ["pipe", "leak", "tap", "drain", "water", "sink", "flush", "sewer", "नल", "पानी", "पाइप", "टपक", "लीक", "नाली"],
            "skills": ["Pipe Fitting", "Leakage Fix", "Sanitary Fittings", "Water Tank Repair"],
            "safety": "Water damage risk: Turn off the main inlet valve behind the meter or tank."
        },
        "Carpenter": {
            "keywords": ["door", "wood", "lock", "hinge", "cupboard", "table", "chair", "दरवाजा", "ताला", "लकड़ी", "कब्जा", "कुर्सी"],
            "skills": ["Woodwork", "Furniture Assembly", "Door & Window Locks", "Hinges"],
            "safety": "Ensure no loose hinges fall; keep pets and children clear of jammed doors."
        },
        "AC Technician": {
            "keywords": ["ac", "cooling", "gas", "compressor", "filter", "chilled", "कूलिंग", "एसी", "गैस"],
            "skills": ["AC Servicing", "Gas Refill", "Compressor Repair", "Appliance Repair"],
            "safety": "Do not attempt DIY refrigerant handling; keep AC isolated until certified technician inspects."
        },
        "Cleaner & Sanitation": {
            "keywords": ["clean", "sanitize", "wash", "sofa", "carpet", "deep clean", "सफाई", "धुलाई", "सैलून"],
            "skills": ["Deep House Cleaning", "Sanitization", "Floor Polishing", "Kitchen Hygiene"],
            "safety": "Ensure proper room ventilation when chemical descalers are utilized."
        }
    }

    def parse_symptom(self, query_text: str) -> Dict[str, Any]:
        text_lower = query_text.lower()

        matched_trade = "General Home Maintenance"
        matched_skills = ["Handyman Maintenance", "General Household Repair"]
        safety_advisory = "Ensure general workspace safety before worker arrival."
        max_score = 0

        for trade, info in self.KEYWORD_MAPPINGS.items():
            score = sum(1 for kw in info["keywords"] if kw in text_lower)
            if score > max_score:
                max_score = score
                matched_trade = trade
                matched_skills = info["skills"]
                safety_advisory = info["safety"]

        # Urgency classification
        emergency_indicators = ["smoke", "spark", "flood", "short", "urgent", "current", "धुआं", "आग", "शॉर्ट", "खतरा"]
        is_emergency = any(w in text_lower for w in emergency_indicators)
        urgency = "EMERGENCY_45_MIN" if is_emergency else ("SAME_DAY" if max_score > 0 else "SCHEDULED")

        return {
            "queryText": query_text,
            "detectedTrade": matched_trade,
            "requiredSkills": matched_skills,
            "recommendedUrgency": urgency,
            "safetyAdvisory": safety_advisory,
            "confidenceScore": 0.94 if max_score >= 2 else (0.85 if max_score == 1 else 0.65),
            "parsedLanguage": "hi-IN" if any(ord(c) >= 2304 and ord(c) <= 2431 for c in query_text) else "en-IN"
        }
