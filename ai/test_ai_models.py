import sys
import os
import io

# Force UTF-8 on Windows stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Add ai directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.fairmatch import FairMatchRanker, calculate_haversine_distance
from models.demand_forecast import ZonalDemandForecaster
from models.pricing_engine import CooperativePricingEngine
from models.nlp_diagnostics import VernacularSymptomParser

def test_ai_suite():
    print("==================================================")
    print("🚀 SHRAMSETU AI SUITE AUTOMATED VERIFICATION")
    print("==================================================")

    # 1. Test Haversine & FairMatch Ranker
    print("\n[1] Testing FairMatch™ Ranker...")
    ranker = FairMatchRanker()
    dist = calculate_haversine_distance(26.8467, 80.9462, 26.8500, 80.9500)
    print(f" -> Haversine Distance: {dist} km")
    assert dist > 0 and dist < 1.0, "Haversine distance calculation error"

    sample_candidates = [
        {
            "id": "w1",
            "name": "Ramesh Kumar",
            "skills": ["Electrical Wiring", "Ceiling Fan Repair", "MCB Fixing"],
            "experienceYears": 7,
            "verificationLevel": 4,
            "isAvailable": True,
            "totalCompletedJobs": 142,
            "rating": 4.9,
            "location": {"latitude": 26.8500, "longitude": 80.9500}
        },
        {
            "id": "w2",
            "name": "Suresh Chandra",
            "skills": ["Pipe Fitting", "Leakage Fix"],
            "experienceYears": 5,
            "verificationLevel": 3,
            "isAvailable": True,
            "totalCompletedJobs": 60,  # Lower jobs, should get workload equity bonus
            "rating": 4.7,
            "location": {"latitude": 26.8600, "longitude": 80.9600}
        }
    ]

    ranked = ranker.rank_workers(26.8467, 80.9462, "ceiling fan repair", sample_candidates)
    assert len(ranked) == 2, "Ranking count mismatch"
    assert ranked[0]["id"] == "w1", "Top match should be Ramesh Kumar"
    print(f" ✓ FairMatch Top Worker: {ranked[0]['name']} (Score: {ranked[0]['matchScore']}%)")
    print(f"   Breakdown: {ranked[0]['matchBreakdown']}")

    # 2. Test Zonal Demand Forecaster
    print("\n[2] Testing Zonal Demand Forecaster...")
    forecaster = ZonalDemandForecaster()
    forecast = forecaster.forecast_demand("Hazratganj", "Plumber", hour=9, weather="RAINY")
    print(f" ✓ Zone: {forecast['zone']} | Predicted Demand: {forecast['predictedDemandJobs']} jobs | Net Deficit: {forecast['netWorkforceDeficit']}")
    print(f"   Status: {forecast['marketStatus']} | Recommendation: {forecast['mobilizationRecommendations']}")
    assert forecast["netWorkforceDeficit"] > 0, "Rainy Hazratganj plumbing should have workforce deficit"

    # 3. Test Cooperative Pricing Engine
    print("\n[3] Testing Cooperative Fair Pricing Engine...")
    pricing_engine = CooperativePricingEngine()
    pricing = pricing_engine.calculate_pricing("Electrician", urgency="EMERGENCY_45_MIN", worker_base_rate=400)
    b = pricing["breakdown"]
    adv = pricing["cooperativeAdvantage"]
    print(f" ✓ Trade: {pricing['trade']} (Floor: ₹{pricing['statutoryMinimumWageFloor']})")
    print(f"   Base: ₹{b['workerBaseWage']} + Surge: ₹{b['emergencySurge']} = Worker Payout: ₹{b['totalWorkerPayout']}")
    print(f"   7% Welfare Cess: ₹{b['cooperativeWelfareCess']} | Platform Fee: ₹{b['platformFacilitationFee']} | Total: ₹{b['totalCustomerPayable']}")
    print(f"   Customer Savings vs Aggregator: ₹{adv['customerSavingsAmount']} | Worker Surplus: ₹{adv['workerSurplusEarnings']}")
    assert b["totalCustomerPayable"] == b["totalWorkerPayout"] + b["cooperativeWelfareCess"] + b["platformFacilitationFee"]
    assert b["workerBaseWage"] >= 380, "Statutory minimum wage floor violation"

    # 4. Test Vernacular Symptom Parser
    print("\n[4] Testing Vernacular NLP Symptom Parser...")
    parser = VernacularSymptomParser()
    hindi_query = "सीलिंग पंखा बहुत गर्म हो रहा है और उसमें से धुआं निकल रहा है"
    diagnosis = parser.parse_symptom(hindi_query)
    print(f" ✓ Query: '{hindi_query}'")
    print(f"   Detected Trade: {diagnosis['detectedTrade']} | Urgency: {diagnosis['recommendedUrgency']}")
    print(f"   Safety Advisory: {diagnosis['safetyAdvisory']}")
    assert diagnosis["detectedTrade"] == "Electrician", "Trade detection error for Hindi fan query"
    assert diagnosis["recommendedUrgency"] == "EMERGENCY_45_MIN", "Urgency detection error for smoke query"

    print("\n==================================================")
    print("🎉 ALL AI AND ML MODULES VALIDATED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    test_ai_suite()
