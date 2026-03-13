from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class ExposomeRequest(BaseModel):
    userId: str
    aqi: float                        # 0–500
    uvIndex: float                    # 0–11+
    temperatureCelsius: float
    humidity: float                   # 0–100
    pathogenRisk: Optional[float] = 0.3   # 0–1 from external source
    userConditions: Optional[list] = []   # e.g. ["asthma", "diabetes"]


@router.post("")
def exposome_risk(body: ExposomeRequest):
    """
    Assess personalised environmental risk and suggest preventive actions.
    """
    suggestions = []
    risk_level = "low"
    risk_score = 0.0

    # AQI assessment
    if body.aqi > 150:
        suggestions.append("Wear N95 mask outdoors.")
        risk_score += 0.3
        risk_level = "high"
    elif body.aqi > 100:
        suggestions.append("Limit outdoor activity. Consider a mask.")
        risk_score += 0.15

    # UV assessment
    if body.uvIndex >= 8:
        suggestions.append("Apply SPF 50+ sunscreen. Wear a hat.")
        risk_score += 0.2
    elif body.uvIndex >= 3:
        suggestions.append("Apply SPF 30 sunscreen for extended outdoor time.")
        risk_score += 0.05

    # Temperature
    if body.temperatureCelsius > 38:
        suggestions.append("Stay hydrated. Avoid peak sun hours (11am–3pm).")
        risk_score += 0.15
    elif body.temperatureCelsius < 5:
        suggestions.append("Dress in warm layers. Risk of respiratory infections higher.")
        risk_score += 0.1

    # Pathogen risk
    if body.pathogenRisk > 0.6:
        suggestions.append("High pathogen risk. Wash hands frequently. Avoid crowded spaces.")
        risk_score += 0.2
    elif body.pathogenRisk > 0.3:
        suggestions.append("Moderate pathogen risk. Maintain hand hygiene.")
        risk_score += 0.1

    # Outdoor suitability
    outdoor_safe = body.aqi < 100 and body.uvIndex < 6 and body.temperatureCelsius < 35
    if outdoor_safe:
        suggestions.append("Conditions are good for a walk or outdoor exercise.")

    if risk_score >= 0.5:
        risk_level = "high"
    elif risk_score >= 0.25:
        risk_level = "moderate"

    return {
        "userId": body.userId,
        "riskLevel": risk_level,
        "riskScore": round(min(risk_score, 1.0), 2),
        "outdoorSafe": outdoor_safe,
        "suggestions": suggestions,
        "pathogenRisk": body.pathogenRisk,
    }
