from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class BioAgeRequest(BaseModel):
    userId: str
    chronologicalAge: int
    bmi: Optional[float] = 22.0
    avgSleepHours: Optional[float] = 7
    avgStepsPerDay: Optional[float] = 7000
    smokingStatus: Optional[bool] = False
    avgStressLevel: Optional[float] = 3   # 1–10
    avgBloodPressureSystolic: Optional[float] = 120
    fastingGlucose: Optional[float] = 90  # mg/dL


@router.post("")
def biological_age(body: BioAgeRequest):
    """
    Estimate biological age from lifestyle and biometric factors.
    """
    age = float(body.chronologicalAge)
    adjustment = 0.0

    # BMI penalty/bonus
    if body.bmi:
        if body.bmi < 18.5 or body.bmi > 30:
            adjustment += 3
        elif body.bmi > 25:
            adjustment += 1.5

    # Sleep
    if body.avgSleepHours < 6:
        adjustment += 4
    elif body.avgSleepHours > 8:
        adjustment -= 1

    # Activity
    if body.avgStepsPerDay < 5000:
        adjustment += 3
    elif body.avgStepsPerDay > 10000:
        adjustment -= 2

    # Smoking
    if body.smokingStatus:
        adjustment += 8

    # Stress
    if body.avgStressLevel > 7:
        adjustment += 3
    elif body.avgStressLevel < 3:
        adjustment -= 1

    # Blood pressure
    if body.avgBloodPressureSystolic > 140:
        adjustment += 4
    elif body.avgBloodPressureSystolic < 120:
        adjustment -= 1

    # Glucose
    if body.fastingGlucose > 126:
        adjustment += 5
    elif body.fastingGlucose > 100:
        adjustment += 2

    biological = round(age + adjustment, 1)
    diff = round(biological - age, 1)

    return {
        "userId": body.userId,
        "chronologicalAge": body.chronologicalAge,
        "biologicalAge": biological,
        "ageDifference": diff,
        "status": "older" if diff > 0 else "younger" if diff < 0 else "equal",
        "insight": _insight(diff),
    }


def _insight(diff: float) -> str:
    if diff > 5:
        return "Your lifestyle is significantly aging you. Focus on sleep, activity, and diet."
    elif diff > 0:
        return "Slightly older biologically. Small lifestyle improvements will help."
    elif diff == 0:
        return "Your biological age matches your actual age."
    else:
        return f"You are {abs(diff)} years biologically younger. Keep up the good habits!"
