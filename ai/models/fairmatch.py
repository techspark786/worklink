import math
from typing import List, Dict, Any

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate geographic distance in kilometers using the Haversine formula."""
    R = 6371.0  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

class FairMatchRanker:
    """
    SIH 2026 FairMatch™ Multi-Objective Algorithmic Ranking Engine.
    Combines skill relevance, proximity, duty availability, verification tiers, 
    and cooperative workload equity to prevent order monopolization.
    """

    def rank_workers(
        self,
        customer_lat: float,
        customer_lng: float,
        service_query: str,
        candidates: List[Dict[str, Any]],
        urgency: str = "SAME_DAY",
        max_distance_km: float = 25.0
    ) -> List[Dict[str, Any]]:
        scored = []
        query_terms = [t.lower() for t in service_query.split() if len(t) > 2]

        for worker in candidates:
            w_loc = worker.get("location", {})
            w_lat = w_loc.get("latitude", 26.8467)
            w_lng = w_loc.get("longitude", 80.9462)
            distance_km = calculate_haversine_distance(customer_lat, customer_lng, w_lat, w_lng)

            if distance_km > max_distance_km:
                continue

            # 1. Skill Match Score (Max: 30 pts)
            skills = [s.lower() for s in worker.get("skills", [])]
            exact_match = any(service_query.lower() in s or s in service_query.lower() for s in skills)
            if exact_match or not service_query:
                skill_score = 30
            else:
                keyword_hits = sum(1 for q in query_terms if any(q in s for s in skills))
                skill_score = min(30, 15 + keyword_hits * 5)

            # 2. Distance Proximity Decay Score (Max: 25 pts)
            if distance_km <= 2.0:
                distance_score = 25
            elif distance_km <= 5.0:
                distance_score = 22
            elif distance_km <= 10.0:
                distance_score = 18
            elif distance_km <= 15.0:
                distance_score = 12
            else:
                distance_score = max(5, int(25 - distance_km))

            # 3. Immediate Duty Availability Score (Max: 20 pts)
            is_avail = worker.get("isAvailable", True)
            if urgency == "EMERGENCY_45_MIN" and not is_avail:
                availability_score = 0
            else:
                availability_score = 20 if is_avail else 5

            # 4. Cooperative Verification & Trust Score (Max: 15 pts)
            ver_level = worker.get("verificationLevel", 1)
            level_map = {0: 3, 1: 6, 2: 9, 3: 12, 4: 14, 5: 15}
            rating = worker.get("rating", 4.8)
            trust_score = min(15, level_map.get(ver_level, 8) + (1 if rating >= 4.8 else 0))

            # 5. Workload Equity & Experience Score (Max: 10 pts)
            # Cooperative equity bonus: workers with fewer jobs this month receive an equity boost
            completed_jobs = worker.get("totalCompletedJobs", 50)
            equity_bonus = 3 if completed_jobs < 100 else (1 if completed_jobs < 180 else 0)
            exp_years = worker.get("experienceYears", 2)
            experience_score = min(10, 5 + min(3, int(exp_years * 0.5)) + equity_bonus)

            total_score = min(100, skill_score + distance_score + availability_score + trust_score + experience_score)

            scored.append({
                **worker,
                "distanceKm": distance_km,
                "distanceText": f"{distance_km} km",
                "matchScore": total_score,
                "matchBreakdown": {
                    "skillScore": skill_score,
                    "distanceScore": distance_score,
                    "availabilityScore": availability_score,
                    "trustScore": trust_score,
                    "experienceScore": experience_score,
                    "workloadEquityBonus": equity_bonus,
                    "totalScore": total_score,
                }
            })

        # Sort descending by matchScore
        scored.sort(key=lambda w: w["matchScore"], reverse=True)
        return scored
