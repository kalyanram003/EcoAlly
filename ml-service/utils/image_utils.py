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


from PIL import Image
import requests
from io import BytesIO


def download_image(url: str) -> Image.Image:
    """Download image from any URL (Cloudinary, S3, etc.)"""
    headers = {"User-Agent": "EcoLens/1.0"}
    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()
    return Image.open(BytesIO(response.content)).convert("RGB")


def validate_image_url(url: str) -> bool:
    """Check if URL points to a valid image."""
    try:
        headers = {"User-Agent": "EcoLens/1.0"}
        response = requests.head(url, headers=headers, timeout=5, allow_redirects=True)

        content_type = response.headers.get("content-type", "")
        return "image" in content_type.lower()
    except Exception:
        return False

def validate_image_url(url: str) -> bool:
    """Check if URL points to a valid image."""
    try:
        response = requests.head(url, timeout=5)
        content_type = response.headers.get("content-type", "")
        return "image" in content_type
    except Exception:
        return False

