# Native species database by country/region
# Expand this dictionary for countries you target

NATIVE_SPECIES_BY_REGION = {
    "IN": [  # India
        "Neem Tree (Azadirachta indica)",
        "Banyan Tree (Ficus benghalensis)",
        "Tulsi (Ocimum tenuiflorum)",
        "Peepal Tree (Ficus religiosa)",
        "Bamboo (Bambusoideae)",
        "Indian Lotus (Nelumbo nucifera)",
        "Mahua (Madhuca longifolia)",
    ],
    "US": [  # United States
        "Eastern Redbud (Cercis canadensis)",
        "Dogwood (Cornus florida)",
        "Black-eyed Susan (Rudbeckia hirta)",
        "Milkweed (Asclepias)",
        "Red Maple (Acer rubrum)",
    ],
    "DEFAULT": []
}


def get_region_from_coords(lat: float, lng: float) -> str:
    """
    Simple bounding box region detection.
    For production: use reverse geocoding API (e.g., OpenCage free tier).
    """
    if lat is None or lng is None:
        return "DEFAULT"
    # India bounding box
    if 8.0 <= lat <= 37.0 and 68.0 <= lng <= 97.5:
        return "IN"
    # USA bounding box
    if 24.0 <= lat <= 49.0 and -125.0 <= lng <= -66.0:
        return "US"
    return "DEFAULT"


def is_species_native(species: str, lat: float, lng: float) -> bool:
    """Check if detected species is native to the student's location."""
    region = get_region_from_coords(lat, lng)
    native_list = NATIVE_SPECIES_BY_REGION.get(region, [])
    return species in native_list
