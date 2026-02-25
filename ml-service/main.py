"""
main.py — EcoLens FastAPI Service for EcoAlly
==============================================
Called by Spring Boot after Cloudinary upload:
  POST /analyze { imageUrl, geoLat, geoLng, studentId, challengeId }

Start the service:
  uvicorn main:app --host 0.0.0.0 --port 5000 --reload
"""

import os
import logging


from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional

from model.ecolens_classifier import EcoLensClassifier

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("ecolens")

app = FastAPI(
    title="EcoLens ML Service",
    description="CNN-based eco-action image classifier for EcoAlly platform",
    version="2.0.0",
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8080,http://localhost:3000,http://localhost:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

logger.info("[EcoLens] Loading model...")
classifier = EcoLensClassifier()
logger.info("[EcoLens] Model ready ✓")


class AnalyzeRequest(BaseModel):
    imageUrl: str
    studentId: Optional[str] = None
    challengeId: Optional[str] = None
    geoLat: Optional[float] = None
    geoLng: Optional[float] = None

    @field_validator("imageUrl")
    @classmethod
    def must_be_https(cls, v: str) -> str:
        if not v.startswith(("http://", "https://")):
            raise ValueError("imageUrl must be a valid HTTP(S) URL")
        return v


class AnalyzeResponse(BaseModel):
    success: bool
    category: str
    confidence: float
    ecoScore: int
    detectedSpecies: Optional[str]
    isNativeSpecies: Optional[bool]
    autoDecision: str
    autoDecisionReason: str
    bonusMultiplier: float
    scoreBreakdown: Optional[dict] = None
    cheatFlags: Optional[list] = None


@app.get("/health")
def health_check():
    return {
        "status": "EcoLens is running ✓",
        "model": "MobileNetV2",
        "finetuned": classifier.is_finetuned,
        "plantnet": bool(os.getenv("PLANTNET_API_KEY", "")),
        "geocoding": True,
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_image(request: AnalyzeRequest):
    """
    Main endpoint — Spring Boot calls this after Cloudinary upload.
    Validates → classifies → identifies species → checks native → returns decision.
    """
    logger.info(
        f"[/analyze] student={request.studentId} challenge={request.challengeId} "
        f"lat={request.geoLat} lng={request.geoLng}"
    )

    try:
        result = classifier.predict(
            image_url=request.imageUrl,
            geo_lat=request.geoLat,
            geo_lng=request.geoLng,
        )
    except Exception as e:
        logger.error(f"[/analyze] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal analysis error")

    if not result.get("success"):
        logger.warning(f"[/analyze] Analysis failed: {result.get('error')}")
        raise HTTPException(
            status_code=422,
            detail=result.get("error", "Image analysis failed"),
        )

    logger.info(
        f"[/analyze] ✓ category={result['category']} "
        f"score={result['ecoScore']} decision={result['autoDecision']} "
        f"species={result.get('detectedSpecies')} native={result.get('isNativeSpecies')}"
    )

    return result


@app.get("/")
def root():
    return {
        "service": "EcoLens ML Microservice",
        "version": "2.0.0",
        "endpoints": {
            "POST /analyze": "Analyse an eco-action image from Cloudinary URL",
            "GET  /health": "Health check + feature flags",
        },
    }

