from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class BaselineRequest(BaseModel):
    userId: str
    previousScore: float      # 0–100 wellness score
    currentScore: float
    previousCredits: Optional[int] = 0


@router.post("")
def baseline_compare(body: BaselineRequest):
    """
    Compare current health against previous baseline.
    Returns improvement percentage and health credits earned.
    """
    improvement = ((body.currentScore - body.previousScore) / max(body.previousScore, 1)) * 100
    credits_earned = max(0, int(improvement * 5))  # 5 credits per % improvement

    return {
        "userId": body.userId,
        "previousScore": body.previousScore,
        "currentScore": body.currentScore,
        "improvementPercent": round(improvement, 2),
        "creditsEarned": credits_earned,
        "totalCredits": body.previousCredits + credits_earned,
        "adaptiveGoal": _suggest_next_goal(improvement),
    }


def _suggest_next_goal(improvement: float) -> str:
    if improvement >= 10:
        return "Excellent progress! Challenge yourself with a fitness goal."
    elif improvement >= 5:
        return "Great improvement! Focus on sleep quality this week."
    elif improvement >= 0:
        return "Keep going! Add 1,000 more steps per day."
    else:
        return "Recovery needed. Prioritize sleep and hydration."
