import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

DATABASE_PATH = Path(__file__).resolve().parent.parent / "data" / "database.json"


def load_database() -> dict[str, Any]:
    if not DATABASE_PATH.exists():
        return {}
    with DATABASE_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def save_database(data: dict[str, Any]) -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with DATABASE_PATH.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2)


def get_facility_record(ccn: str) -> dict[str, Any] | None:
    return load_database().get(ccn)


def upsert_cms_record(ccn: str, cms: dict[str, Any]) -> dict[str, Any]:
    database = load_database()
    existing = database.get(ccn, {})
    record = {
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "cms": cms,
        "manual": existing.get("manual") or empty_manual(),
        "nameOverride": existing.get("nameOverride") or "",
    }
    database[ccn] = record
    save_database(database)
    return record


def update_manual_inputs(
    ccn: str, manual: dict[str, Any], name_override: str
) -> dict[str, Any] | None:
    database = load_database()
    record = database.get(ccn)
    if record is None:
        return None
    record["manual"] = manual
    record["nameOverride"] = name_override
    database[ccn] = record
    save_database(database)
    return record


def empty_manual() -> dict[str, str]:
    return {
        "emr": "",
        "currentCensus": "",
        "patientType": "",
        "previousCoverage": "",
        "previousProviderPerformance": "",
        "medicalCoverage": "",
    }
