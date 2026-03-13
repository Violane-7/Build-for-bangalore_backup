from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import math

router = APIRouter()


class GoalRequest(BaseModel):
    userId: str
    goalDescription: str            # e.g. "lose 5 kg in 3 months"
    currentWeightKg: Optional[float] = 70
    targetWeightKg: Optional[float] = None
    targetWeeks: Optional[int] = 12
    currentSteps: Optional[float] = 6000
    currentSleepHours: Optional[float] = 7


@router.post("")
def goal_plan(body: GoalRequest):
    """
    Generate a weekly milestone plan for a user's health goal.
    """
    milestones = []
    weeks = body.targetWeeks or 12

    # Weight loss plan
    if body.targetWeightKg and body.currentWeightKg:
        total_loss = body.currentWeightKg - body.targetWeightKg
        weekly_loss = total_loss / weeks
        for w in range(1, weeks + 1):
            target = round(body.currentWeightKg - weekly_loss * w, 1)
            steps_target = int(body.currentSteps + (w * 200))
            milestones.append({
                "week": w,
                "targetWeightKg": target,
                "stepsTarget": min(steps_target, 12000),
                "caloriesToBurn": int(weekly_loss * 7700 / 7),  # kcal/day
                "focus": _weekly_focus(w),
            })
    else:
        # Generic wellness plan
        for w in range(1, weeks + 1):
            milestones.append({
                "week": w,
                "focus": _weekly_focus(w),
                "stepsTarget": min(int(body.currentSteps + w * 300), 12000),
                "sleepTarget": min(body.currentSleepHours + (0.1 * w), 8.5),
            })

    return {
        "userId": body.userId,
        "goalDescription": body.goalDescription,
        "totalWeeks": weeks,
        "milestones": milestones,
        "weeklyTip": "Consistency beats intensity. Small daily improvements compound.",
    }


def _weekly_focus(week: int) -> str:
    focuses = [
        "Establish baseline habits", "Increase daily steps", "Improve sleep schedule",
        "Introduce strength training", "Optimize nutrition", "Stress management",
        "Hydration focus", "Recovery and rest", "Cardio improvement",
        "Habit consolidation", "Performance assessment", "Final push & celebrate!",
    ]
    return focuses[(week - 1) % len(focuses)]
