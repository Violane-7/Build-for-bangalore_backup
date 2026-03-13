from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.risk_engine import calculate_risk_scores

router = APIRouter()


class HealthMetrics(BaseModel):
    steps: Optional[float] = 0
    sleep: Optional[float] = 7
    heartRate: Optional[float] = 72
    bloodPressureSystolic: Optional[float] = 120
    bloodPressureDiastolic: Optional[float] = 80
    weight: Optional[float] = 70
    calories: Optional[float] = 2000
    screenTime: Optional[float] = 3
    waterIntake: Optional[float] = 2
    stressLevel: Optional[float] = 3


class RiskRequest(BaseModel):
    userId: str
    metrics: HealthMetrics
    history: Optional[List[HealthMetrics]] = []


@router.post("/risk")
def predict_risk(body: RiskRequest):
    """
    Predict disease risk scores from health metrics.
    Returns risk scores for diabetes, cardiac, obesity, stress, sleepDisorder.
    """
    scores = calculate_risk_scores(body.metrics.dict(), body.history)
    top_risks = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
    return {
        "userId": body.userId,
        "riskScores": scores,
        "topRisks": [{"condition": k, "score": v} for k, v in top_risks],
        "trend": "stable",  # TODO: compare with history for real trend
    }
