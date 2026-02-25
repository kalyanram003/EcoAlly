"""
ecolens_classifier.py — EcoLens CNN Classifier for EcoAlly
===========================================================
Architecture : MobileNetV2 fine-tuned on eco-action categories
Species ID   : PlantNet API (POST multipart — correct v2 API usage)
               → colour heuristic fallback when API unavailable
Native check : geo_utils.is_species_native() with BigDataCloud geocoding
Anti-cheat   : image_utils.detect_cheating() (no OpenCV needed)
Caching      : in-memory hash cache for species lookups (saves API quota)
"""

import os
import logging
import hashlib
from io import BytesIO

import numpy as np
import requests
import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms

from utils.geo_utils import is_species_native
from utils.image_utils import (
    download_image,
    get_image_quality_score,
    detect_cheating,
)

logger = logging.getLogger(__name__)

ECO_CATEGORIES = [
    "plant",
    "water_body",
    "waste",
    "wildlife",
    "urban_green",
    "irrelevant",
]

PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY", "")
PLANTNET_URL = "https://my-api.plantnet.org/v2/identify/all"
PLANTNET_MIN_CONF = 0.15

_IMAGENET_ECO_MAP = {
    "plant": set(list(range(0, 30)) + [940, 985, 986, 987, 992, 993]),
    "wildlife": set(list(range(80, 400))),
    "water_body": {978, 979, 980, 955, 736, 973, 974, 975},
    "waste": {412, 413, 440, 441, 468, 469, 530, 531},
    "urban_green": {716, 726, 733, 866, 580, 832, 833},
}


class EcoLensClassifier:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"[EcoLens] Device: {self.device}")

        self.model, self.is_finetuned = self._build_model()
        self.transform = self._build_transform()
        self._species_cache: dict = {}

        if self.is_finetuned:
            logger.info("[EcoLens] ✓ Fine-tuned weights loaded")
        else:
            logger.warning(
                "[EcoLens] ⚠ No fine-tuned weights — using ImageNet fallback. "
                "Run train.py for best accuracy."
            )

        if not PLANTNET_API_KEY:
            logger.warning(
                "[EcoLens] ⚠ PLANTNET_API_KEY not set — species ID uses "
                "colour heuristic only."
            )

    def _build_model(self) -> tuple:
        weights_path = os.getenv(
            "MODEL_WEIGHTS_PATH", "model/weights/ecolens_finetuned.pth"
        )
        is_finetuned = os.path.exists(weights_path)

        if is_finetuned:
            model = models.mobilenet_v2(weights=None)
            in_features = model.classifier[1].in_features
            model.classifier = nn.Sequential(
                nn.Dropout(p=0.2),
                nn.Linear(in_features, len(ECO_CATEGORIES)),
            )
            model.load_state_dict(torch.load(weights_path, map_location=self.device))
        else:
            model = models.mobilenet_v2(
                weights=models.MobileNet_V2_Weights.IMAGENET1K_V1
            )

        model.to(self.device).eval()
        return model, is_finetuned

    def _build_transform(self) -> transforms.Compose:
        return transforms.Compose(
            [
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225],
                ),
            ]
        )

    def predict(self, image_url: str, geo_lat: float = None, geo_lng: float = None) -> dict:
        try:
            image = download_image(image_url)
        except Exception as e:
            return self._error_response(str(e))

        cheat = detect_cheating(image)
        cheat_penalty = cheat["confidence_penalty"]
        if cheat["is_suspicious"]:
            logger.warning(f"[EcoLens] ⚠ Suspicious: {cheat['issues']}")

        tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.model(tensor)
            probs = torch.softmax(logits, dim=1)
            conf, pred_idx = torch.max(probs, dim=1)

        if self.is_finetuned:
            category = ECO_CATEGORIES[int(pred_idx.item())]
            category_conf = float(conf.item())
        else:
            category, category_conf = self._imagenet_to_eco(probs[0].cpu().numpy())

        effective_conf = max(0.0, category_conf - (cheat_penalty / 100))

        detected_species = None
        common_name = None
        species_conf = 0.0

        if category == "plant" and effective_conf > 0.45:
            plantnet = self._identify_species_plantnet(image, image_url)
            if plantnet:
                detected_species = plantnet["scientific_name"]
                common_name = plantnet["common_name"]
                species_conf = plantnet["confidence"]
            else:
                fallback = self._identify_species_heuristic(image)
                detected_species = fallback["scientific_name"]
                common_name = fallback["common_name"]
                species_conf = fallback["confidence"]

        native_result = None
        if detected_species:
            native_result = is_species_native(detected_species, geo_lat, geo_lng)

        is_native = native_result["is_native"] if native_result else None
        native_pts = native_result["points"] if native_result else 0

        if detected_species and common_name and detected_species != common_name:
            display_species = f"{common_name} ({detected_species})"
        else:
            display_species = detected_species

        score_data = self._calculate_eco_score(
            category=category,
            confidence=effective_conf,
            image=image,
            species_conf=species_conf,
            native_pts=native_pts,
            geo_lat=geo_lat,
            geo_lng=geo_lng,
            cheat_penalty=cheat_penalty,
        )
        eco_score = score_data["total"]

        auto_decision = self._get_auto_decision(
            eco_score, cheat["requires_manual_review"]
        )
        reason = self._generate_reason(
            category, eco_score, effective_conf, display_species, cheat["is_suspicious"]
        )

        return {
            "success": True,
            "category": category,
            "confidence": round(effective_conf * 100, 2),
            "ecoScore": eco_score,
            "detectedSpecies": display_species,
            "isNativeSpecies": is_native,
            "autoDecision": auto_decision,
            "autoDecisionReason": reason,
            "bonusMultiplier": self._get_bonus_multiplier(
                display_species, is_native
            ),
            "scoreBreakdown": score_data["breakdown"],
            "cheatFlags": cheat["issues"],
        }

    def _identify_species_plantnet(
        self, image: Image.Image, image_url: str
    ) -> dict | None:
        if not PLANTNET_API_KEY:
            return None

        img_hash = self._image_hash(image)
        if img_hash in self._species_cache:
            logger.info("[PlantNet] Cache hit ✓")
            return self._species_cache[img_hash]

        try:
            buffer = BytesIO()
            image.save(buffer, format="JPEG", quality=85)
            buffer.seek(0)

            files = {"images": ("photo.jpg", buffer, "image/jpeg")}
            data = {"organs": ["auto"]}
            params = {
                "api-key": PLANTNET_API_KEY,
                "include-related-images": "false",
                "lang": "en",
            }

            resp = requests.post(
                PLANTNET_URL, params=params, files=files, data=data, timeout=10
            )
            resp.raise_for_status()
            api_data = resp.json()

            results = api_data.get("results", [])
            if not results:
                return None

            top = results[0]
            score = top.get("score", 0)

            if score < PLANTNET_MIN_CONF:
                logger.info(f"[PlantNet] Low confidence ({score:.2%}) — discarding")
                return None

            scientific = top["species"]["scientificNameWithoutAuthor"]
            common_names = top["species"].get("commonNames", [])
            common = common_names[0] if common_names else scientific.split()[0]

            result = {
                "scientific_name": scientific,
                "common_name": common,
                "confidence": score,
            }
            self._species_cache[img_hash] = result
            logger.info(f"[PlantNet] ✓ {scientific} ({score:.2%})")
            return result

        except requests.exceptions.Timeout:
            logger.warning("[PlantNet] Timeout — using heuristic")
        except requests.exceptions.HTTPError as e:
            logger.warning(f"[PlantNet] HTTP {e.response.status_code} — using heuristic")
        except Exception as e:
            logger.warning(f"[PlantNet] Error: {e} — using heuristic")

        return None

    def _identify_species_heuristic(self, image: Image.Image) -> dict:
        pixels = np.array(image, dtype=float)
        r = np.mean(pixels[:, :, 0])
        g = np.mean(pixels[:, :, 1])
        b = np.mean(pixels[:, :, 2])
        green_ratio = g / (r + 1e-5)
        is_warm_flower = r > g and r > b and r > 120

        if green_ratio > 1.3 and g > 80:
            return {
                "scientific_name": "Azadirachta indica",
                "common_name": "Neem Tree",
                "confidence": 0.35,
            }
        elif green_ratio > 1.15:
            return {
                "scientific_name": "Ocimum tenuiflorum",
                "common_name": "Tulsi",
                "confidence": 0.30,
            }
        elif is_warm_flower and r > b * 1.3:
            return {
                "scientific_name": "Hibiscus rosa-sinensis",
                "common_name": "Hibiscus",
                "confidence": 0.25,
            }
        elif is_warm_flower:
            return {
                "scientific_name": "Tagetes",
                "common_name": "Marigold",
                "confidence": 0.25,
            }
        else:
            return {
                "scientific_name": "Unknown",
                "common_name": "Unknown Plant",
                "confidence": 0.10,
            }

    def _imagenet_to_eco(self, probs: np.ndarray) -> tuple:
        scores = {
            cat: float(probs[list(indices)].sum())
            for cat, indices in _IMAGENET_ECO_MAP.items()
        }
        best = max(scores, key=scores.get)
        if scores[best] < 0.05:
            return "irrelevant", float(probs.max())
        return best, min(1.0, scores[best] * 2.5)

    def _calculate_eco_score(
        self,
        category,
        confidence,
        image,
        species_conf=0.0,
        native_pts=0,
        geo_lat=None,
        geo_lng=None,
        cheat_penalty=0,
    ) -> dict:
        base_scores = {
            "plant": 50,
            "water_body": 45,
            "wildlife": 48,
            "waste": 40,
            "urban_green": 35,
            "irrelevant": 0,
        }
        base = base_scores.get(category, 0)
        conf_bonus = int(confidence * 20)
        quality_bonus = get_image_quality_score(image)
        species_bonus = (
            15
            if species_conf > 0.8
            else 10
            if species_conf > 0.5
            else 5
            if species_conf > 0.15
            else 0
        )
        native_bonus = min(20, native_pts)
        geo_bonus = 5 if (geo_lat is not None and geo_lng is not None) else 0

        total = max(
            0,
            min(
                100,
                base
                + conf_bonus
                + quality_bonus
                + species_bonus
                + native_bonus
                + geo_bonus
                - cheat_penalty,
            ),
        )

        return {
            "total": total,
            "breakdown": {
                "base_category": base,
                "confidence": conf_bonus,
                "image_quality": quality_bonus,
                "species_id": species_bonus,
                "native_species": native_bonus,
                "geo_verified": geo_bonus,
                "cheat_penalty": -cheat_penalty,
            },
        }

    def _get_auto_decision(self, eco_score: int, needs_review: bool) -> str:
        if needs_review:
            return "PENDING_REVIEW"
        if eco_score >= 70:
            return "AUTO_APPROVED"
        if eco_score < 40:
            return "AUTO_REJECTED"
        return "PENDING_REVIEW"

    def _get_bonus_multiplier(self, species: str, is_native: bool) -> float:
        if species and is_native:
            return 1.5
        if species and "Unknown" not in (species or ""):
            return 1.2
        return 1.0

    def _generate_reason(
        self, category, eco_score, confidence, species, is_suspicious
    ) -> str:
        if is_suspicious:
            return "Image flagged — possible screenshot or re-upload. Please take a fresh photo."
        if category == "irrelevant":
            return "Image does not show an environmental action. Submit a photo of a plant, wildlife, or eco-activity."
        if eco_score >= 70:
            base = f"High-confidence {category.replace('_', ' ')} detected"
            return (
                f"{base} — identified as {species}. Great eco-action! 🌿"
                if species
                else f"{base}. Keep it up! 🌍"
            )
        if eco_score < 40:
            return f"Low confidence ({int(confidence * 100)}%). Please retake in good lighting."
        return (
            f"Moderate confidence in {category.replace('_', ' ')}. Sent for teacher review."
        )

    def _image_hash(self, image: Image.Image) -> str:
        return hashlib.md5(image.resize((64, 64)).tobytes()).hexdigest()

    def _error_response(self, message: str) -> dict:
        return {
            "success": False,
            "error": message,
            "category": "irrelevant",
            "confidence": 0.0,
            "ecoScore": 0,
            "detectedSpecies": None,
            "isNativeSpecies": None,
            "autoDecision": "AUTO_REJECTED",
            "autoDecisionReason": message,
            "bonusMultiplier": 1.0,
            "scoreBreakdown": {},
            "cheatFlags": [],
        }

