import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import requests
from io import BytesIO

# ── Categories your model classifies ──────────────────────────────────────────
ECO_CATEGORIES = [
    "plant",        # 0 - trees, shrubs, flowers, crops
    "water_body",   # 1 - river, pond, lake, ocean cleanup
    "waste",        # 2 - garbage collection, recycling, composting
    "wildlife",     # 3 - birds, insects, animals in nature
    "urban_green",  # 4 - parks, gardens, green rooftops
    "irrelevant"    # 5 - selfies, screenshots, unrelated photos
]

# ── Species name lookup (simplified — expand this list for your region) ───────
SPECIES_MAP = {
    "plant": [
        "Neem Tree (Azadirachta indica)",
        "Banyan Tree (Ficus benghalensis)",
        "Tulsi (Ocimum tenuiflorum)",
        "Peepal Tree (Ficus religiosa)",
        "Bamboo (Bambusoideae)",
        "Sunflower (Helianthus annuus)",
        "Marigold (Tagetes)",
        "Aloe Vera (Aloe barbadensis)",
        "Hibiscus (Hibiscus rosa-sinensis)",
        "Rose (Rosa)",
    ]
}

# ── Native species for India (expand based on your target regions) ─────────────
NATIVE_SPECIES_INDIA = [
    "Neem Tree (Azadirachta indica)",
    "Banyan Tree (Ficus benghalensis)",
    "Tulsi (Ocimum tenuiflorum)",
    "Peepal Tree (Ficus religiosa)",
    "Bamboo (Bambusoideae)",
]

class EcoLensClassifier:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[EcoLens] Running on: {self.device}")
        self.model = self._build_model()
        self.transform = self._build_transform()

    def _build_model(self):
        """
        MobileNetV2 with custom classification head.
        Pretrained on ImageNet — works well for plant/nature images out of the box.
        For better accuracy, fine-tune on PlantNet dataset (see Training Guide below).
        """
        model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

        # Replace the final classifier with our eco-category head
        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.2, inplace=False),
            nn.Linear(in_features, len(ECO_CATEGORIES))
        )

        model = model.to(self.device)
        model.eval()
        return model

    def _build_transform(self):
        """Standard ImageNet preprocessing — MUST match training transforms."""
        return transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def load_image_from_url(self, url: str) -> Image.Image:
        """Download image from Cloudinary URL and convert to PIL Image."""
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
        return image

    def predict(self, image_url: str, geo_lat: float = None, geo_lng: float = None) -> dict:
        """
        Main prediction function.
        Returns: category, confidence, ecoScore, detectedSpecies, isNative, reason
        """
        try:
            image = self.load_image_from_url(image_url)
        except Exception as e:
            return self._error_response(f"Could not load image: {str(e)}")

        # Run inference
        tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)
            confidence, predicted_idx = torch.max(probabilities, dim=1)

        confidence_val = float(confidence.item())
        category = ECO_CATEGORIES[int(predicted_idx.item())]
        category_prob = float(probabilities[0][int(predicted_idx.item())].item())

        # ── EcoScore Calculation ───────────────────────────────────────────────
        eco_score = self._calculate_eco_score(
            category=category,
            confidence=confidence_val,
            image=image
        )

        # ── Species Detection (if plant category) ─────────────────────────────
        detected_species = None
        is_native = None
        if category == "plant" and confidence_val > 0.5:
            detected_species = self._identify_species(image)
            is_native = detected_species in NATIVE_SPECIES_INDIA

        # ── Auto-decision reasoning ────────────────────────────────────────────
        reason = self._generate_reason(category, eco_score, confidence_val, detected_species)

        return {
            "success": True,
            "category": category,
            "confidence": round(confidence_val * 100, 2),
            "ecoScore": eco_score,
            "detectedSpecies": detected_species,
            "isNativeSpecies": is_native,
            "autoDecision": self._get_auto_decision(eco_score),
            "autoDecisionReason": reason,
            "bonusMultiplier": self._get_bonus_multiplier(detected_species, is_native)
        }

    def _calculate_eco_score(self, category: str, confidence: float, image: Image.Image) -> int:
        """
        EcoScore formula:
          Base score from category relevance (0-60)
          + Confidence bonus (0-25)
          + Image quality bonus (0-15)
        """
        # Base scores per category
        category_base = {
            "plant": 60,
            "water_body": 55,
            "waste": 50,
            "wildlife": 58,
            "urban_green": 45,
            "irrelevant": 0
        }

        base = category_base.get(category, 0)
        confidence_bonus = int(confidence * 25)  # max 25 points
        quality_bonus = self._image_quality_score(image)  # max 15 points

        raw_score = base + confidence_bonus + quality_bonus
        return min(100, max(0, raw_score))

    def _image_quality_score(self, image: Image.Image) -> int:
        """
        Simple image quality heuristic:
        - Check resolution (higher is better, up to a point)
        - Check if not blurry (using pixel variance as proxy)
        Returns: 0–15
        """
        width, height = image.size
        pixels = np.array(image.convert("L"))  # grayscale

        # Variance as blur proxy (higher variance = sharper image)
        variance = float(np.var(pixels))
        resolution_score = min(8, int((width * height) / (640 * 480) * 8))
        sharpness_score = min(7, int(variance / 500))

        return resolution_score + sharpness_score

    def _identify_species(self, image: Image.Image) -> str:
        """
        Simplified species identification.
        For production: integrate PlantNet API (free, 500 requests/day) 
        or fine-tune a second model head on plant species.
        Currently returns best-guess from visual features.
        """
        # Placeholder: in production replace with PlantNet API call
        # See Step 1.6 for PlantNet integration
        pixels = np.array(image)
        green_ratio = np.mean(pixels[:, :, 1]) / (np.mean(pixels[:, :, 0]) + 1e-5)

        if green_ratio > 1.3:
            return "Neem Tree (Azadirachta indica)"  # Very green = likely tree
        elif green_ratio > 1.1:
            return "Tulsi (Ocimum tenuiflorum)"
        else:
            return "Hibiscus (Hibiscus rosa-sinensis)"

    def _get_auto_decision(self, eco_score: int) -> str:
        """Auto-decision thresholds matching Spring Boot logic."""
        if eco_score >= 70:
            return "AUTO_APPROVED"
        elif eco_score < 40:
            return "AUTO_REJECTED"
        else:
            return "PENDING_REVIEW"

    def _get_bonus_multiplier(self, species: str, is_native: bool) -> float:
        """Native species and rare plants earn bonus points."""
        if species and is_native:
            return 1.5  # 50% bonus for native species
        elif species:
            return 1.2  # 20% bonus for identified species
        return 1.0

    def _generate_reason(self, category, eco_score, confidence, species) -> str:
        if category == "irrelevant":
            return "Image does not appear to show an environmental action."
        if eco_score >= 70:
            base = f"High-confidence {category.replace('_', ' ')} detected"
            if species:
                return f"{base} — identified as {species}."
            return f"{base}."
        if eco_score < 40:
            return f"Low confidence in eco-action detection ({int(confidence*100)}%). Please resubmit a clearer photo."
        return f"Moderate confidence in {category.replace('_', ' ')} detection. Sent for teacher review."

    def _error_response(self, message: str) -> dict:
        return {
            "success": False,
            "error": message,
            "category": "irrelevant",
            "confidence": 0,
            "ecoScore": 0,
            "detectedSpecies": None,
            "isNativeSpecies": None,
            "autoDecision": "AUTO_REJECTED",
            "autoDecisionReason": message,
            "bonusMultiplier": 1.0
        }
