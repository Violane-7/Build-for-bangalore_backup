from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import json

router = APIRouter()

# Simplified nutrition database (per 100g)
NUTRITION_DB = {
    "apple":       {"calories": 52,  "sugar": 10, "fiber": 2.4, "fat": 0.2, "protein": 0.3},
    "banana":      {"calories": 89,  "sugar": 12, "fiber": 2.6, "fat": 0.3, "protein": 1.1},
    "bread":       {"calories": 265, "sugar": 5,  "fiber": 2.7, "fat": 3.2, "protein": 9.0},
    "milk":        {"calories": 61,  "sugar": 5,  "fiber": 0,   "fat": 3.3, "protein": 3.2},
    "chicken":     {"calories": 165, "sugar": 0,  "fiber": 0,   "fat": 3.6, "protein": 31},
    "rice":        {"calories": 130, "sugar": 0,  "fiber": 0.4, "fat": 0.3, "protein": 2.7},
    "default":     {"calories": 100, "sugar": 5,  "fiber": 1,   "fat": 2,   "protein": 3},
}


class GroceryItem(BaseModel):
    name: str
    quantity_g: Optional[float] = 100


class GroceryAnalyzeRequest(BaseModel):
    userId: str
    items: List[GroceryItem]


@router.post("")
def grocery_analyze(body: GroceryAnalyzeRequest):
    """
    Analyze grocery items for nutrition and generate recommendations.
    Accepts a list of items. For image-based OCR, use /grocery-analyze/image.
    """
    results = []
    total = {"calories": 0, "sugar": 0, "fiber": 0, "fat": 0, "protein": 0}

    for item in body.items:
        db_entry = NUTRITION_DB.get(item.name.lower(), NUTRITION_DB["default"])
        ratio = item.quantity_g / 100
        nutrition = {k: round(v * ratio, 1) for k, v in db_entry.items()}

        recs = []
        if nutrition["sugar"] > 15:
            recs.append("High sugar — consider reducing portion size.")
        if nutrition["fiber"] < 2:
            recs.append("Low fiber — pair with vegetables.")
        if nutrition["fat"] > 10:
            recs.append("High fat — choose leaner alternatives.")

        results.append({
            "name": item.name,
            "quantity_g": item.quantity_g,
            "nutrition": nutrition,
            "recommendations": recs,
        })

        for k in total:
            total[k] = round(total[k] + nutrition[k], 1)

    return {
        "userId": body.userId,
        "items": results,
        "totalNutrition": total,
        "overallRecommendation": _overall_rec(total),
    }


def _overall_rec(total: dict) -> str:
    if total["sugar"] > 50:
        return "This cart is high in sugar. Focus on whole foods."
    if total["fiber"] > 25:
        return "Good fiber content. Well balanced cart."
    return "Balanced cart. Ensure adequate protein and fiber daily."
