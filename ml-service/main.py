from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from model.ecolens_classifier import EcoLensClassifier

app = FastAPI(
    title="EcoLens ML Service",
    description="CNN-based eco-action image classifier for EcoAlly platform",
    version="1.0.0"
)

# Allow Spring Boot to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Load model once at startup (not on every request)
print("[EcoLens] Loading model...")
classifier = EcoLensClassifier()
print("[EcoLens] Model ready ✓")


# ── Request/Response Models ──────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    imageUrl: str
    studentId: Optional[str] = None
    challengeId: Optional[str] = None
    geoLat: Optional[float] = None
    geoLng: Optional[float] = None


class AnalyzeResponse(BaseModel):
    success: bool
    category: str
    confidence: float
    ecoScore: int
    detectedSpecies: Optional[str]
    isNativeSpecies: Optional[bool]
    autoDecision: str          # AUTO_APPROVED | AUTO_REJECTED | PENDING_REVIEW
    autoDecisionReason: str
    bonusMultiplier: float


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "EcoLens is running", "model": "MobileNetV2"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_image(request: AnalyzeRequest):
    """
    Main endpoint — Spring Boot calls this after Cloudinary upload.
    Returns classification result + auto-decision for gamification.
    """
    if not request.imageUrl:
        raise HTTPException(status_code=400, detail="imageUrl is required")

    result = classifier.predict(
        image_url=request.imageUrl,
        geo_lat=request.geoLat,
        geo_lng=request.geoLng
    )

    if not result["success"]:
        raise HTTPException(status_code=422, detail=result.get("error", "Analysis failed"))

    return result


@app.get("/")
def root():
    return {
        "service": "EcoLens ML Microservice",
        "endpoints": {
            "POST /analyze": "Analyze an eco-action image",
            "GET /health": "Health check"
        }
    }
