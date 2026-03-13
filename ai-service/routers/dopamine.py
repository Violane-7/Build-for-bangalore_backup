from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DopamineRequest(BaseModel):
    userId: str
    screenTimeHours: float
    socialMediaHours: float = 0
    gamingHours: float = 0
    exerciseHours: float = 0
    sleepHours: float = 7


@router.post("")
def dopamine_score(body: DopamineRequest):
    """
    Estimate dopamine balance score based on lifestyle inputs.
    Score 0–100: 100 = optimal balance, <40 = depleted.
    """
    # Depletion factors (high screen time drains dopamine sensitivity)
    depletion = (
        body.screenTimeHours * 8
        + body.socialMediaHours * 12
        + body.gamingHours * 10
    )

    # Recovery factors
    recovery = (
        body.exerciseHours * 20
        + max(0, body.sleepHours - 6) * 10
    )

    raw_score = 100 - depletion + recovery
    score = max(0, min(100, raw_score))

    if score >= 75:
        status = "Healthy"
        suggestion = "Great dopamine balance. Keep it up."
    elif score >= 50:
        status = "Moderate"
        suggestion = "Reduce social media by 30 min and take a walk."
    elif score >= 25:
        status = "Low"
        suggestion = "Digital detox recommended. Prioritize sleep & exercise."
    else:
        status = "Depleted"
        suggestion = "Significant screen overuse. Take a full day off screens."

    return {
        "userId": body.userId,
        "dopamineScore": round(score, 1),
        "status": status,
        "suggestion": suggestion,
        "breakdown": {
            "depletionScore": round(depletion, 1),
            "recoveryScore": round(recovery, 1),
        },
    }
