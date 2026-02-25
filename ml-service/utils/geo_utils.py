"""
geo_utils.py — Geographic utilities for EcoAlly / EcoLens
==========================================================
API Strategy (all free):
  1. BigDataCloud — no API key required, 10k req/day
  2. OpenCage     — optional, 2500/day (set OPENCAGE_API_KEY in .env)
  3. Bounding box — offline fallback, always works
"""

import os
import requests
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

NATIVE_SPECIES_BY_REGION = {
    "IN": {
        "Azadirachta indica": {"common": "Neem Tree", "points": 15},
        "Ficus benghalensis": {"common": "Banyan Tree", "points": 20},
        "Ocimum tenuiflorum": {"common": "Tulsi", "points": 10},
        "Ficus religiosa": {"common": "Peepal Tree", "points": 15},
        "Bambusoideae": {"common": "Bamboo", "points": 12},
        "Nelumbo nucifera": {"common": "Indian Lotus", "points": 18},
        "Madhuca longifolia": {"common": "Mahua", "points": 20},
        "Mangifera indica": {"common": "Mango Tree", "points": 10},
        "Saraca asoca": {"common": "Ashoka Tree", "points": 18},
        "Syzygium cumini": {"common": "Jamun", "points": 12},
        "Phyllanthus emblica": {"common": "Amla", "points": 14},
        "Terminalia arjuna": {"common": "Arjuna Tree", "points": 16},
        "Artocarpus heterophyllus": {"common": "Jackfruit", "points": 10},
        "Moringa oleifera": {"common": "Drumstick Tree", "points": 13},
        "Butea monosperma": {"common": "Flame of the Forest", "points": 17},
    },
    "US": {
        "Cercis canadensis": {"common": "Eastern Redbud", "points": 15},
        "Cornus florida": {"common": "Dogwood", "points": 12},
        "Rudbeckia hirta": {"common": "Black-eyed Susan", "points": 10},
        "Asclepias": {"common": "Milkweed", "points": 20},
        "Acer rubrum": {"common": "Red Maple", "points": 10},
        "Quercus alba": {"common": "White Oak", "points": 18},
        "Pinus strobus": {"common": "Eastern White Pine", "points": 14},
        "Acer saccharum": {"common": "Sugar Maple", "points": 12},
    },
    "GB": {
        "Quercus robur": {"common": "English Oak", "points": 20},
        "Betula pendula": {"common": "Silver Birch", "points": 14},
        "Fraxinus excelsior": {"common": "Common Ash", "points": 15},
        "Prunus avium": {"common": "Wild Cherry", "points": 12},
        "Corylus avellana": {"common": "Hazel", "points": 10},
    },
    "AU": {
        "Eucalyptus": {"common": "Gum Tree", "points": 18},
        "Acacia": {"common": "Wattle", "points": 15},
        "Banksia": {"common": "Banksia", "points": 16},
        "Grevillea": {"common": "Grevillea", "points": 14},
        "Callistemon": {"common": "Bottlebrush", "points": 12},
    },
    "DEFAULT": {},
}


@lru_cache(maxsize=256)
def get_region_from_coords(lat: float, lng: float) -> str:
    if lat is None or lng is None:
        return "DEFAULT"

    try:
        url = (
            "https://api.bigdatacloud.net/data/reverse-geocode-client"
            f"?latitude={lat}&longitude={lng}&localityLanguage=en"
        )
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        code = resp.json().get("countryCode", "")
        if code:
            logger.info(f"[Geo] BigDataCloud → {code}")
            return code
    except Exception as e:
        logger.warning(f"[Geo] BigDataCloud failed: {e}")

    opencage_key = os.getenv("OPENCAGE_API_KEY", "")
    if opencage_key:
        try:
            url = (
                "https://api.opencagedata.com/geocode/v1/json"
                f"?q={lat}+{lng}&key={opencage_key}&limit=1"
            )
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            results = resp.json().get("results", [])
            if results:
                code = results[0].get("components", {}).get(
                    "ISO_3166-1_alpha-2", "DEFAULT"
                )
                logger.info(f"[Geo] OpenCage → {code}")
                return code
        except Exception as e:
            logger.warning(f"[Geo] OpenCage failed: {e}")

    if 8.0 <= lat <= 37.0 and 68.0 <= lng <= 97.5:
        return "IN"
    if 24.0 <= lat <= 72.0 and -170.0 <= lng <= -66.0:
        return "US"
    if 49.5 <= lat <= 61.0 and -8.2 <= lng <= 2.0:
        return "GB"
    if -44.0 <= lat <= -10.0 and 112.0 <= lng <= 154.0:
        return "AU"

    return "DEFAULT"


def is_species_native(scientific_name: str, lat: float, lng: float) -> dict:
    region = get_region_from_coords(lat, lng)
    native_db = NATIVE_SPECIES_BY_REGION.get(region, {})

    if not native_db or not scientific_name:
        return {
            "is_native": False,
            "points": 0,
            "region": region,
            "common_name": None,
            "match_type": "none",
        }

    if scientific_name in native_db:
        e = native_db[scientific_name]
        return {
            "is_native": True,
            "points": e["points"],
            "region": region,
            "common_name": e["common"],
            "match_type": "exact",
        }

    genus = scientific_name.split()[0]
    for sp, e in native_db.items():
        if sp.startswith(genus):
            return {
                "is_native": True,
                "points": e["points"] // 2,
                "region": region,
                "common_name": e["common"],
                "match_type": "genus",
            }

    sci_lower = scientific_name.lower()
    for sp, e in native_db.items():
        if sp.lower() in sci_lower or sci_lower in sp.lower():
            return {
                "is_native": True,
                "points": e["points"] // 2,
                "region": region,
                "common_name": e["common"],
                "match_type": "keyword",
            }

    return {
        "is_native": False,
        "points": 0,
        "region": region,
        "common_name": None,
        "match_type": "none",
    }

