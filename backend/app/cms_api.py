import asyncio
from typing import Any

import httpx

from app.errors import CmsApiError, FacilityNotFoundError
from app.formatters import (
    format_address,
    medicare_care_compare_url,
    normalize_ccn,
    parse_number,
    to_display_name,
)
from app.models import CmsFacilityData, MetricTriple

CMS_BASE = "https://data.cms.gov/provider-data/api/1/datastore/query"
DATASETS = {
    "provider_info": "4pq5-n9py",
    "claims_measures": "ijh5-nb2v",
    "state_averages": "xcdc-v8bm",
}
CLAIM_MEASURE_CODES = {
    "str_hospitalization": "521",
    "str_ed_visit": "522",
    "lt_hospitalization": "551",
    "lt_ed_visit": "552",
}
STATE_AVG_FIELDS = {
    "str_hospitalization": "percentage_of_short_stay_residents_who_were_rehospitalized__1d02",
    "str_ed_visit": "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911",
    "lt_hospitalization": "number_of_hospitalizations_per_1000_longstay_resident_days",
    "lt_ed_visit": "number_of_outpatient_emergency_department_visits_per_1000_l_de9d",
}
MAX_ATTEMPTS = 3
RETRY_DELAY_SECONDS = 0.5


# Queries a CMS datastore dataset with retry on failure.
async def query_cms(
    client: httpx.AsyncClient,
    dataset_id: str,
    property_name: str,
    value: str,
    limit: int = 50,
) -> list[dict[str, Any]]:
    params = {
        "conditions[0][property]": property_name,
        "conditions[0][value]": value,
        "conditions[0][operator]": "=",
        "limit": str(limit),
    }
    url = f"{CMS_BASE}/{dataset_id}/0"
    last_error: Exception | None = None

    for attempt in range(MAX_ATTEMPTS):
        try:
            response = await client.get(url, params=params, timeout=30.0)
            if response.status_code >= 400:
                raise CmsApiError()
            data = response.json()
            return data.get("results") or []
        except CmsApiError:
            raise
        except Exception as exc:
            last_error = exc
            if attempt < MAX_ATTEMPTS - 1:
                await asyncio.sleep(RETRY_DELAY_SECONDS)

    raise CmsApiError() from last_error


# Combines facility, state, and national metric values.
def build_metric_triple(
    facility_value: float | None,
    state_row: dict[str, Any] | None,
    nation_row: dict[str, Any] | None,
    field: str,
) -> MetricTriple:
    column = STATE_AVG_FIELDS[field]
    return MetricTriple(
        facility=facility_value,
        state_average=parse_number(state_row.get(column) if state_row else None),
        national_average=parse_number(nation_row.get(column) if nation_row else None),
    )


# Finds the observed score for a claims measure code.
def get_claim_score(rows: list[dict[str, Any]], measure_code: str) -> float | None:
    for row in rows:
        if str(row.get("measure_code")) == measure_code:
            return parse_number(row.get("observed_score"))
    return None


# Loads and merges all CMS datasets for one CCN.
async def fetch_facility_by_ccn(raw_ccn: str) -> CmsFacilityData:
    ccn = normalize_ccn(raw_ccn)

    async with httpx.AsyncClient() as client:
        provider_rows = await query_cms(
            client,
            DATASETS["provider_info"],
            "cms_certification_number_ccn",
            ccn,
            limit=1,
        )

        if not provider_rows:
            raise FacilityNotFoundError(ccn)

        provider = provider_rows[0]
        state = str(provider.get("state") or "").upper()

        claim_rows = await query_cms(
            client,
            DATASETS["claims_measures"],
            "cms_certification_number_ccn",
            ccn,
            limit=10,
        )
        state_rows = (
            await query_cms(
                client,
                DATASETS["state_averages"],
                "state_or_nation",
                state,
                limit=1,
            )
            if state
            else []
        )
        nation_rows = await query_cms(
            client,
            DATASETS["state_averages"],
            "state_or_nation",
            "NATION",
            limit=1,
        )

    state_row = state_rows[0] if state_rows else None
    nation_row = nation_rows[0] if nation_rows else None

    return CmsFacilityData(
        ccn=ccn,
        official_name=to_display_name(str(provider.get("provider_name") or "Unknown Facility")),
        location=format_address(
            address=str(provider.get("provider_address") or ""),
            city=str(provider.get("citytown") or ""),
            state=state,
            zip_code=str(provider.get("zip_code") or ""),
        ),
        state=state or "—",
        census_capacity=parse_number(provider.get("number_of_certified_beds")),
        overall_star_rating=parse_number(provider.get("overall_rating")),
        health_inspection_rating=parse_number(provider.get("health_inspection_rating")),
        staffing_rating=parse_number(provider.get("staffing_rating")),
        quality_rating=parse_number(provider.get("qm_rating")),
        str_hospitalization=build_metric_triple(
            get_claim_score(claim_rows, CLAIM_MEASURE_CODES["str_hospitalization"]),
            state_row,
            nation_row,
            "str_hospitalization",
        ),
        str_ed_visit=build_metric_triple(
            get_claim_score(claim_rows, CLAIM_MEASURE_CODES["str_ed_visit"]),
            state_row,
            nation_row,
            "str_ed_visit",
        ),
        lt_hospitalization=build_metric_triple(
            get_claim_score(claim_rows, CLAIM_MEASURE_CODES["lt_hospitalization"]),
            state_row,
            nation_row,
            "lt_hospitalization",
        ),
        lt_ed_visit=build_metric_triple(
            get_claim_score(claim_rows, CLAIM_MEASURE_CODES["lt_ed_visit"]),
            state_row,
            nation_row,
            "lt_ed_visit",
        ),
        medicare_url=medicare_care_compare_url(ccn),
    )
