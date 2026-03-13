from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Thresholds for emergency detection
THRESHOLDS = {
    "heartRate":            {"low": 40,  "high": 150},
    "bloodPressureSystolic":{"low": 80,  "high": 180},
    "oxygenSaturation":     {"low": 90,  "high": 100},
}

EMERGENCY_INSTRUCTIONS = {
    "cardiac_arrest": [
        "Call 911 immediately.",
        "Begin CPR: 30 chest compressions, 2 rescue breaths.",
        "Use AED if available.",
        "Do not leave the patient alone.",
    ],
    "hypertensive_crisis": [
        "Call 911 immediately.",
        "Keep the person calm and seated.",
        "Do not give any medications unless prescribed.",
        "Monitor symptoms until help arrives.",
    ],
    "bradycardia": [
        "Call 911 if the person is unresponsive.",
        "Keep them lying down.",
        "Loosen tight clothing.",
        "Monitor breathing.",
    ],
    "hypoxia": [
        "Call 911 immediately.",
        "Sit the person upright.",
        "Use supplemental oxygen if available.",
        "Keep the person calm and still.",
    ],
}


class VitalsRequest(BaseModel):
    userId: str
    heartRate: Optional[float] = None
    bloodPressureSystolic: Optional[float] = None
    oxygenSaturation: Optional[float] = None
    lossOfConsciousness: Optional[bool] = False


@router.post("")
def emergency_detect(body: VitalsRequest):
    """
    Analyse real-time vitals and detect emergency conditions.
    """
    emergency = False
    emergency_type = None
    instructions = []

    if body.lossOfConsciousness:
        emergency = True
        emergency_type = "cardiac_arrest"
        instructions = EMERGENCY_INSTRUCTIONS["cardiac_arrest"]
    elif body.heartRate and body.heartRate > THRESHOLDS["heartRate"]["high"]:
        if body.bloodPressureSystolic and body.bloodPressureSystolic > 180:
            emergency = True
            emergency_type = "hypertensive_crisis"
            instructions = EMERGENCY_INSTRUCTIONS["hypertensive_crisis"]
        else:
            emergency = True
            emergency_type = "tachycardia"
            instructions = ["Sit down and breathe slowly.", "Call 911 if symptoms persist.", "Avoid caffeine and stimulants."]
    elif body.heartRate and body.heartRate < THRESHOLDS["heartRate"]["low"]:
        emergency = True
        emergency_type = "bradycardia"
        instructions = EMERGENCY_INSTRUCTIONS["bradycardia"]
    elif body.oxygenSaturation and body.oxygenSaturation < THRESHOLDS["oxygenSaturation"]["low"]:
        emergency = True
        emergency_type = "hypoxia"
        instructions = EMERGENCY_INSTRUCTIONS["hypoxia"]
    elif body.bloodPressureSystolic and body.bloodPressureSystolic > 180:
        emergency = True
        emergency_type = "hypertensive_crisis"
        instructions = EMERGENCY_INSTRUCTIONS["hypertensive_crisis"]

    return {
        "userId": body.userId,
        "emergency": emergency,
        "emergencyType": emergency_type,
        "instructions": instructions,
        "callEmergencyServices": emergency,
        "vitalsReceived": {
            "heartRate": body.heartRate,
            "bloodPressureSystolic": body.bloodPressureSystolic,
            "oxygenSaturation": body.oxygenSaturation,
        },
    }
