from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.cms_api import fetch_facility_by_ccn
from app.errors import CmsApiError, FacilityNotFoundError
from app.formatters import is_valid_ccn, normalize_ccn
from app.models import CmsFacilityData, FacilityInputsUpdate, FacilitySessionResponse, ManualInputs
from app.storage import get_facility_record, update_manual_inputs, upsert_cms_record

router = APIRouter()


def _session_from_record(record: dict) -> FacilitySessionResponse:
    return FacilitySessionResponse(
        cms=CmsFacilityData.model_validate(record["cms"]),
        manual=ManualInputs.model_validate(record.get("manual") or {}),
        name_override=record.get("nameOverride") or "",
    )


@router.get("/facility/{ccn}/stored")
async def get_stored_facility(ccn: str):
    normalized = normalize_ccn(ccn)

    if not is_valid_ccn(normalized):
        return JSONResponse(
            status_code=400,
            content={"error": "Please enter a valid 6-digit CCN."},
        )

    record = get_facility_record(normalized)
    if record is None or "cms" not in record:
        return JSONResponse(
            status_code=404,
            content={"error": "No saved facility data for this CCN."},
        )

    return JSONResponse(
        status_code=200,
        content=_session_from_record(record).model_dump(by_alias=True),
    )


@router.get("/facility/{ccn}")
async def get_facility(ccn: str):
    normalized = normalize_ccn(ccn)

    if not is_valid_ccn(normalized):
        return JSONResponse(
            status_code=400,
            content={"error": "Please enter a valid 6-digit CCN."},
        )

    try:
        data = await fetch_facility_by_ccn(normalized)
        record = upsert_cms_record(normalized, data.model_dump(by_alias=True))
        session = _session_from_record(record)
        return JSONResponse(
            status_code=200,
            content=session.model_dump(by_alias=True),
        )
    except FacilityNotFoundError as exc:
        return JSONResponse(status_code=404, content={"error": str(exc)})
    except CmsApiError as exc:
        return JSONResponse(status_code=502, content={"error": str(exc)})
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "An unexpected error occurred. Please try again."},
        )


@router.put("/facility/{ccn}/inputs")
async def save_facility_inputs(ccn: str, body: FacilityInputsUpdate):
    normalized = normalize_ccn(ccn)

    if not is_valid_ccn(normalized):
        return JSONResponse(
            status_code=400,
            content={"error": "Please enter a valid 6-digit CCN."},
        )

    record = update_manual_inputs(
        normalized,
        body.manual.model_dump(by_alias=True),
        body.name_override,
    )
    if record is None:
        return JSONResponse(
            status_code=404,
            content={"error": "Fetch facility data before saving inputs."},
        )

    return JSONResponse(
        status_code=200,
        content=_session_from_record(record).model_dump(by_alias=True),
    )
