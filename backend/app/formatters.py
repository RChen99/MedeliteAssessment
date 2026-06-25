import re


# Parses CMS numeric fields into floats or None.
def parse_number(value) -> float | None:
    if value is None or value == "":
        return None
    try:
        num = float(value) if not isinstance(value, (int, float)) else float(value)
    except (TypeError, ValueError):
        return None
    if num != num or num in (float("inf"), float("-inf")):
        return None
    return num


# Builds a single-line facility address from CMS parts.
def format_address(address: str = "", city: str = "", state: str = "", zip_code: str = "") -> str:
    line1 = (address or "").strip()
    city_state_zip = ", ".join(p for p in [city, state, zip_code] if p).strip()
    if line1 and city_state_zip:
        return f"{line1}, {city_state_zip}"
    return line1 or city_state_zip or "N/A"


# Strips non-digits and normalizes CCN to six digits.
def normalize_ccn(ccn: str) -> str:
    digits = "".join(c for c in ccn if c.isdigit())
    return digits.zfill(6)[-6:]


# Returns whether the CCN is exactly six digits.
def is_valid_ccn(ccn: str) -> bool:
    normalized = normalize_ccn(ccn)
    return len(normalized) == 6 and normalized.isdigit()


# Builds the Medicare Care Compare URL for a CCN.
def medicare_care_compare_url(ccn: str) -> str:
    return f"https://www.medicare.gov/care-compare/details/nursing-home/{normalize_ccn(ccn)}"


# Title-cases CMS provider names for display.
def to_display_name(name: str) -> str:
    lowered = name.lower()
    return re.sub(r"\b([a-z])", lambda m: m.group(1).upper(), lowered)
