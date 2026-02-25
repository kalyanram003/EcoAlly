# from PIL import Image
# import requests
# from io import BytesIO


# def download_image(url: str) -> Image.Image:
#     """
#     Download image from any URL (Cloudinary, S3, Wikimedia, etc.)
#     Raises an exception if the image cannot be loaded.
#     """
#     headers = {
#         # Use a browser-like user agent to avoid 403 errors
#         "User-Agent": "Mozilla/5.0"
#     }

#     try:
#         response = requests.get(
#             url,
#             headers=headers,
#             timeout=15,
#             allow_redirects=True
#         )
#         response.raise_for_status()

#         content_type = response.headers.get("content-type", "").lower()
#         if "image" not in content_type:
#             raise ValueError("URL does not point to a valid image")

#         return Image.open(BytesIO(response.content)).convert("RGB")

#     except requests.exceptions.RequestException as e:
#         raise ValueError(f"Could not load image: {e}")
#     except Exception as e:
#         raise ValueError(f"Invalid image file: {e}")


"""
image_utils.py — Image utilities for EcoAlly / EcoLens
Anti-cheat uses only numpy + Pillow — no OpenCV dependency needed.
"""

import logging
from io import BytesIO

import numpy as np
import requests
from PIL import Image, ImageStat

logger = logging.getLogger(__name__)


def download_image(url: str, timeout: int = 15) -> Image.Image:
    if not url or not url.startswith(("http://", "https://")):
        raise ValueError("Invalid image URL")

    headers = {"User-Agent": "EcoLens/2.0 (EcoAlly Platform)"}
    try:
        resp = requests.get(
            url, headers=headers, timeout=timeout, allow_redirects=True
        )
        resp.raise_for_status()
    except requests.exceptions.Timeout:
        raise ValueError(f"Timed out downloading image (>{timeout}s)")
    except requests.exceptions.HTTPError as e:
        raise ValueError(f"HTTP {e.response.status_code} error fetching image")
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Network error: {e}")

    content_type = resp.headers.get("content-type", "").lower()
    if "image" not in content_type:
        raise ValueError(f"URL is not an image (content-type: {content_type})")

    try:
        return Image.open(BytesIO(resp.content)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Could not decode image: {e}")


def get_image_quality_score(image: Image.Image) -> int:
    w, h = image.size
    gray = np.array(image.convert("L"), dtype=float)
    resolution_score = min(8, int((w * h) / (640 * 480) * 8))
    sharpness_score = min(7, int(float(np.var(gray)) / 500))
    return resolution_score + sharpness_score


def detect_cheating(image: Image.Image) -> dict:
    issues = []
    penalty = 0
    img_arr = np.array(image, dtype=float)
    w, h = image.size

    if float(np.var(img_arr)) < 200:
        issues.append("Image appears blank or solid colour")
        penalty += 30

    SCREEN_SIZES = {
        (1080, 1920),
        (1920, 1080),
        (2160, 3840),
        (3840, 2160),
        (1284, 2778),
        (1170, 2532),
        (1125, 2436),
        (750, 1334),
        (1080, 2340),
        (1080, 2400),
        (1080, 2280),
        (2560, 1600),
        (1440, 900),
        (1366, 768),
        (1920, 1200),
    }
    if (w, h) in SCREEN_SIZES or (h, w) in SCREEN_SIZES:
        row_vars = np.var(img_arr, axis=1).mean(axis=1)
        col_vars = np.var(img_arr, axis=0).mean(axis=1)
        band_score = float((row_vars < 5).mean() + (col_vars < 5).mean())
        if band_score > 0.3:
            issues.append("Screenshot resolution with UI-like bands detected")
            penalty += 20

    try:
        quantised = image.quantize(colors=8)
        hist = quantised.histogram()
        if max(hist) / sum(hist) > 0.75:
            issues.append("Unnaturally uniform colour — possible clip-art or stock image")
            penalty += 15
    except Exception:
        pass

    mean_brightness = sum(ImageStat.Stat(image).mean) / 3
    if mean_brightness > 230:
        issues.append("Image severely overexposed — possible screen re-photography")
        penalty += 10

    return {
        "is_suspicious": len(issues) > 0,
        "issues": issues,
        "confidence_penalty": min(penalty, 50),
        "requires_manual_review": len(issues) >= 2,
    }


