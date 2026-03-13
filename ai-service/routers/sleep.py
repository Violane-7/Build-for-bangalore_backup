import math
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

RECOMMENDED_SLEEP = 8.0  # hours


class SleepEntry(BaseModel):
    date: str
    hours: float


class SleepDebtRequest(BaseModel):
    userId: str
    sleepHistory: List[SleepEntry]


@router.post("")
def sleep_debt(body: SleepDebtRequest):
    """
    Calculate cumulative sleep debt and a recovery plan.
    """
    if not body.sleepHistory:
        return {"userId": body.userId, "totalDebtHours": 0, "recoveryPlan": []}

    total_debt = sum(
        max(0, RECOMMENDED_SLEEP - entry.hours) for entry in body.sleepHistory
    )

    # Recovery: add 1.5 extra hours/night, max 10 nights
    nights_to_recover = min(int(math.ceil(total_debt / 1.5)), 10) if total_debt > 0 else 0

    return {
        "userId": body.userId,
        "totalDebtHours": round(total_debt, 1),
        "daysAnalyzed": len(body.sleepHistory),
        "averageSleep": round(
            sum(e.hours for e in body.sleepHistory) / len(body.sleepHistory), 1
        ),
        "recoveryPlan": {
            "nightsNeeded": nights_to_recover,
            "targetHoursPerNight": RECOMMENDED_SLEEP + 1.5,
            "tip": "Go to bed 1.5 hours earlier for the next"
                   f" {nights_to_recover} nights to recover.",
        },
    }

