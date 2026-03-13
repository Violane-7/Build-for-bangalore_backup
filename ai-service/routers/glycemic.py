from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import math

router = APIRouter()

# Glycemic index reference data (simplified)
GI_TABLE = {
    "white rice": 73, "brown rice": 50, "white bread": 75, "whole wheat bread": 53,
    "oats": 55, "banana": 51, "apple": 36, "sugar": 65, "potato": 78,
    "pasta": 49, "milk": 35, "default": 55,
}


class MealItem(BaseModel):
    name: str
    quantity_g: float = 100


class GlycemicRequest(BaseModel):
    userId: str
    meals: List[MealItem]
    diabeticRisk: Optional[float] = 0.3


@router.post("")
def glycemic_curve(body: GlycemicRequest):
    """
    Model the blood glucose response curve after a meal.
    Returns data points for a 2-hour post-meal glucose curve.
    """
    # Estimate total glycemic load
    total_gl = sum(
        (GI_TABLE.get(item.name.lower(), GI_TABLE["default"]) * item.quantity_g / 100)
        for item in body.meals
    )

    # Generate curve: peaks at 45 min, returns to baseline by 2 hours
    baseline = 90  # mg/dL fasting
    peak_rise = total_gl * 0.8 * (1 + body.diabeticRisk * 0.5)
    curve = []
    for t in range(0, 130, 10):  # 0 to 120 min in 10-min steps
        if t <= 45:
            glucose = baseline + peak_rise * math.sin(math.pi * t / 90)
        else:
            glucose = baseline + peak_rise * math.exp(-0.025 * (t - 45))
        curve.append({"time_min": t, "glucose_mg_dl": round(glucose, 1)})

    peak_glucose = max(p["glucose_mg_dl"] for p in curve)
    return {
        "userId": body.userId,
        "curve": curve,
        "peakGlucose": peak_glucose,
        "totalGlycemicLoad": round(total_gl, 1),
        "warning": peak_glucose > 180,
    }
