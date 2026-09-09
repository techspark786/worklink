from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from models.fairmatch import FairMatchRanker
from models.demand_forecast import ZonalDemandForecaster
from models.pricing_engine import CooperativePricingEngine
from models.nlp_diagnostics import VernacularSymptomParser

app = FastAPI(
    title="ShramSetu AI Microservice",
    description="Smart India Hackathon 2026: AI-Powered FairMatch, Zonal Demand Forecasting & Cooperative Fair Pricing Engine",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core AI Models
fairmatch_model = FairMatchRanker()
demand_model = ZonalDemandForecaster()
pricing_model = CooperativePricingEngine()
nlp_parser = VernacularSymptomParser()

# Request Schemas
class SymptomPayload(BaseModel):
    queryText: str = Field(..., example="सीलिंग पंखा बहुत गर्म हो रहा है और उसमें से धुआं निकल रहा है")

class MatchCandidate(BaseModel):
    id: str
    name: str
    skills: List[str]
    experienceYears: Optional[int] = 1
    verificationLevel: Optional[int] = 1
    isAvailable: Optional[bool] = True
    hourlyRate: Optional[int] = 350
    rating: Optional[float] = 4.8
    totalCompletedJobs: Optional[int] = 50
    cooperativeName: Optional[str] = "Lucknow Labour Cooperative Society Ltd."
    location: Optional[Dict[str, float]] = None

class MatchPayload(BaseModel):
    customerLat: float = Field(26.8467, example=26.8467)
    customerLng: float = Field(80.9462, example=80.9462)
    serviceQuery: str = Field(..., example="Electrician ceiling fan repair")
    urgency: Optional[str] = Field("SAME_DAY", example="SAME_DAY")
    maxDistanceKm: Optional[float] = Field(25.0, example=25.0)
    candidates: List[Dict[str, Any]]

class DemandPayload(BaseModel):
    zone: str = Field("Hazratganj", example="Hazratganj")
    trade: str = Field("Plumber", example="Plumber")
    hour: Optional[int] = Field(14, example=14)
    weather: Optional[str] = Field("NORMAL", example="NORMAL")
    isWeekend: Optional[bool] = Field(False, example=False)

class PricingPayload(BaseModel):
    trade: str = Field("Electrician", example="Electrician")
    urgency: Optional[str] = Field("SAME_DAY", example="SAME_DAY")
    workerBaseRate: Optional[int] = Field(0, example=400)

@app.get("/")
def read_root():
    return {
        "service": "ShramSetu AI Microservice",
        "status": "ONLINE",
        "version": "2.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "ShramSetu AI Engine",
        "models": {
            "fairmatch": "ACTIVE",
            "demandForecast": "ACTIVE",
            "pricingEngine": "ACTIVE",
            "nlpVernacular": "ACTIVE"
        }
    }

@app.post("/api/v1/nlp/diagnose")
def diagnose_symptom(payload: SymptomPayload):
    """
    Multilingual vernacular symptom understanding in Hindi (Devanagari), Hinglish, and English.
    Extracts trade, required competencies, recommended urgency, and safety warnings.
    """
    return nlp_parser.parse_symptom(payload.queryText)

@app.post("/api/v1/predict/match")
def predict_fairmatch(payload: MatchPayload):
    """
    FairMatch™ Multi-Objective Algorithmic Ranking Engine.
    Evaluates skill match (30%), Haversine proximity (25%), availability (20%), 
    cooperative trust (15%), and workload equity rebalancing (10%).
    """
    ranked = fairmatch_model.rank_workers(
        customer_lat=payload.customerLat,
        customer_lng=payload.customerLng,
        service_query=payload.serviceQuery,
        candidates=payload.candidates,
        urgency=payload.urgency,
        max_distance_km=payload.maxDistanceKm
    )
    return {
        "query": payload.serviceQuery,
        "urgency": payload.urgency,
        "totalRanked": len(ranked),
        "workers": ranked
    }

@app.post("/api/v1/predict/demand")
def predict_demand(payload: DemandPayload):
    """
    Predicts 24-hour zonal service demand shifts and outputs cooperative deficit reallocation directives.
    """
    return demand_model.forecast_demand(
        zone=payload.zone,
        trade=payload.trade,
        hour=payload.hour,
        weather=payload.weather,
        is_weekend=payload.isWeekend
    )

@app.post("/api/v1/pricing/estimate")
def estimate_pricing(payload: PricingPayload):
    """
    Calculates non-exploitative cooperative fair pricing with statutory wage floor guarantees.
    """
    return pricing_model.calculate_pricing(
        trade=payload.trade,
        urgency=payload.urgency,
        worker_base_rate=payload.workerBaseRate
    )

@app.get("/api/v1/pricing/floors")
def get_statutory_floors():
    """Returns statutory minimum wage floors compliant with UP State Labour Gazette."""
    return {
        "authority": "Uttar Pradesh State Labour Gazette",
        "currency": "INR",
        "hourlyFloors": pricing_model.STATUTORY_MINIMUM_HOURLY_FLOORS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
