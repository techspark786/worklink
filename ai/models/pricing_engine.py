from typing import Dict, Any

class CooperativePricingEngine:
    """
    SIH 2026 Cooperative Fair Pricing Engine.
    Enforces state statutory minimum wage floors and transparent, non-exploitative pricing.
    """

    STATUTORY_MINIMUM_HOURLY_FLOORS = {
        "Electrician": 380,
        "Plumber": 350,
        "Carpenter": 450,
        "AC Technician": 550,
        "Painter": 400,
        "Cleaner & Sanitation": 320,
        "Domestic Helper": 300,
        "Appliance Repair": 400,
    }

    def calculate_pricing(
        self,
        trade: str,
        urgency: str = "SAME_DAY",
        worker_base_rate: int = 0
    ) -> Dict[str, Any]:
        statutory_floor = self.STATUTORY_MINIMUM_HOURLY_FLOORS.get(trade, 350)
        
        # Base wage must never be below the statutory floor
        effective_base_wage = max(statutory_floor, worker_base_rate if worker_base_rate > 0 else statutory_floor)

        # Emergency surcharge capped at 1.25x
        surge_amount = 0
        if urgency == "EMERGENCY_45_MIN":
            surge_amount = int(effective_base_wage * 0.20)  # capped at 20% surge
        
        total_worker_payout = effective_base_wage + surge_amount
        welfare_cess = int(total_worker_payout * 0.07)   # 7% to Cooperative Member Health Shield
        platform_fee = int(total_worker_payout * 0.05)   # 5% to Digital Infrastructure & GST
        total_customer_payable = total_worker_payout + welfare_cess + platform_fee

        # Commercial middleman aggregator comparison (corporate apps charge ~45% markup and take 25% from worker)
        aggregator_price = int(effective_base_wage * 1.45)
        aggregator_worker_cut = int(aggregator_price * 0.25)
        customer_savings = max(0, aggregator_price - total_customer_payable)
        worker_surplus_vs_aggregator = total_worker_payout - (aggregator_price - aggregator_worker_cut)

        return {
            "trade": trade,
            "urgency": urgency,
            "statutoryMinimumWageFloor": statutory_floor,
            "breakdown": {
                "workerBaseWage": effective_base_wage,
                "emergencySurge": surge_amount,
                "totalWorkerPayout": total_worker_payout,
                "cooperativeWelfareCess": welfare_cess,
                "platformFacilitationFee": platform_fee,
                "totalCustomerPayable": total_customer_payable
            },
            "cooperativeAdvantage": {
                "aggregatorEstimatedPrice": aggregator_price,
                "customerSavingsAmount": customer_savings,
                "workerSurplusEarnings": max(0, worker_surplus_vs_aggregator),
                "guarantee": "100% of base rate credited directly to worker. Zero corporate commission."
            }
        }
