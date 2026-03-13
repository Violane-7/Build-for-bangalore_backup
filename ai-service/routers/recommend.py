from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict

router = APIRouter()


class RecommendRequest(BaseModel):
    userId: str
    riskScores: Dict[str, float]
    metrics: Optional[dict] = {}


RECOMMENDATIONS_MAP = {
    "diabetes": [
        "Reduce refined sugar and white rice intake",
        "Aim for 10,000 steps daily",
        "Get fasting blood glucose tested quarterly",
    ],
    "cardiac": [
        "Limit sodium to under 2g/day",
        "30 minutes of moderate cardio 5x per week",
        "Monitor blood pressure weekly",
    ],
    "obesity": [
        "Create a 300–500 calorie daily deficit",
        "Increase protein to 1.2g per kg body weight",
        "Limit processed foods and sugary drinks",
    ],
    "stress": [
        "Practice 10 minutes of mindfulness daily",
        "Reduce screen time by 1 hour",
        "Maintain a consistent sleep schedule",
    ],
    "sleepDisorder": [
        "Keep a consistent sleep/wake schedule",
        "Avoid screens 1 hour before bed",
        "Limit caffeine after 2pm",
    ],
}


@router.post("")
def recommend(body: RecommendRequest):
    """
    Generate personalized recommendations based on risk scores.
    """
    recommendations = []
    for condition, score in body.riskScores.items():
        if score > 0.4 and condition in RECOMMENDATIONS_MAP:
            for rec in RECOMMENDATIONS_MAP[condition]:
                recommendations.append({
                    "condition": condition,
                    "risk": round(score, 2),
                    "action": rec,
                    "priority": "high" if score > 0.7 else "medium",
                })
    return {
        "userId": body.userId,
        "recommendations": recommendations[:10],  # top 10
        "generatedAt": "now",
    }
