from typing import Dict, Any, List

class ZonalDemandForecaster:
    """
    SIH 2026 Zonal Workforce Demand Forecasting Engine.
    Predicts service demand fluctuations across urban zones and identifies workforce deficits.
    """

    BASE_ZONE_WEIGHTS = {
        "Hazratganj": {"demand_multiplier": 1.4, "active_workers": 70},
        "Gomti Nagar": {"demand_multiplier": 1.2, "active_workers": 95},
        "Aliganj": {"demand_multiplier": 1.1, "active_workers": 60},
        "Indira Nagar": {"demand_multiplier": 1.0, "active_workers": 55},
        "Charbagh": {"demand_multiplier": 1.3, "active_workers": 45},
    }

    TRADE_HOURLY_PROFILES = {
        "Electrician": {9: 25, 12: 40, 15: 35, 18: 55, 20: 30},
        "Plumber": {7: 45, 9: 60, 12: 30, 17: 50, 19: 35},
        "Carpenter": {10: 20, 13: 25, 16: 30},
        "AC Technician": {11: 45, 14: 60, 16: 50},
        "Cleaner & Sanitation": {8: 50, 11: 35, 16: 30},
    }

    def forecast_demand(
        self,
        zone: str,
        trade: str,
        hour: int = 14,
        weather: str = "NORMAL",
        is_weekend: bool = False
    ) -> Dict[str, Any]:
        zone_info = self.BASE_ZONE_WEIGHTS.get(zone, {"demand_multiplier": 1.0, "active_workers": 50})
        base_zone_mult = zone_info["demand_multiplier"]
        active_workers = zone_info["active_workers"]

        # Profile hourly base
        trade_profile = self.TRADE_HOURLY_PROFILES.get(trade, {14: 30})
        closest_hour = min(trade_profile.keys(), key=lambda h: abs(h - hour))
        base_demand = trade_profile[closest_hour]

        # Modifiers
        weather_mult = 1.35 if (weather == "RAINY" and trade in ["Plumber", "Electrician"]) or (weather == "HOT" and trade == "AC Technician") else 1.0
        weekend_mult = 1.25 if is_weekend else 1.0

        predicted_demand = int(base_demand * base_zone_mult * weather_mult * weekend_mult)
        deficit = predicted_demand - active_workers

        status = "DEFICIT" if deficit > 15 else ("SURPLUS" if deficit < -15 else "BALANCED")

        recommendations = []
        if status == "DEFICIT":
            donor_zone = "Gomti Nagar" if zone != "Gomti Nagar" else "Indira Nagar"
            recommendations.append(
                f"Dispatch directive: Reallocate {min(25, deficit)} certified {trade}s from {donor_zone} to {zone} with a +₹50 transit incentive."
            )

        return {
            "zone": zone,
            "trade": trade,
            "forecastHour": hour,
            "weatherCondition": weather,
            "isWeekend": is_weekend,
            "predictedDemandJobs": predicted_demand,
            "activeAvailableWorkers": active_workers,
            "netWorkforceDeficit": deficit,
            "marketStatus": status,
            "confidenceScore": 0.92,
            "mobilizationRecommendations": recommendations
        }
