"""
Rule-based risk scoring engine.
Each score is 0.0–1.0 (0 = no risk, 1 = high risk).
Replace with trained ML models (Random Forest / XGBoost) for production.
"""
from typing import List, Dict


def calculate_risk_scores(metrics: dict, history: list = []) -> Dict[str, float]:
    return {
        "diabetes":      _diabetes_risk(metrics),
        "cardiac":       _cardiac_risk(metrics),
        "obesity":       _obesity_risk(metrics),
        "stress":        _stress_risk(metrics),
        "sleepDisorder": _sleep_disorder_risk(metrics),
    }


def _diabetes_risk(m: dict) -> float:
    score = 0.0
    if m.get("weight", 70) > 90:
        score += 0.25
    if m.get("calories", 2000) > 2800:
        score += 0.15
    if m.get("steps", 7000) < 4000:
        score += 0.2
    if m.get("stressLevel", 3) > 7:
        score += 0.15
    if m.get("sleep", 7) < 6:
        score += 0.1
    return round(min(score, 1.0), 2)


def _cardiac_risk(m: dict) -> float:
    score = 0.0
    bp_sys = m.get("bloodPressureSystolic", 120)
    if bp_sys > 140:
        score += 0.35
    elif bp_sys > 130:
        score += 0.15
    if m.get("heartRate", 72) > 100:
        score += 0.2
    if m.get("stressLevel", 3) > 7:
        score += 0.2
    if m.get("steps", 7000) < 3000:
        score += 0.2
    return round(min(score, 1.0), 2)


def _obesity_risk(m: dict) -> float:
    score = 0.0
    weight = m.get("weight", 70)
    if weight > 100:
        score += 0.4
    elif weight > 85:
        score += 0.2
    if m.get("calories", 2000) > 3000:
        score += 0.25
    if m.get("steps", 7000) < 5000:
        score += 0.2
    return round(min(score, 1.0), 2)


def _stress_risk(m: dict) -> float:
    stress = m.get("stressLevel", 3)
    score = max(0, (stress - 3) / 7)
    if m.get("sleep", 7) < 6:
        score += 0.15
    if m.get("screenTime", 3) > 8:
        score += 0.1
    return round(min(score, 1.0), 2)


def _sleep_disorder_risk(m: dict) -> float:
    score = 0.0
    sleep = m.get("sleep", 7)
    if sleep < 5:
        score += 0.5
    elif sleep < 6:
        score += 0.3
    elif sleep > 10:
        score += 0.2
    if m.get("screenTime", 3) > 6:
        score += 0.15
    if m.get("stressLevel", 3) > 6:
        score += 0.1
    return round(min(score, 1.0), 2)
