from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class MetricTriple(CamelModel):
    facility: float | None
    state_average: float | None
    national_average: float | None


class CmsFacilityData(CamelModel):
    ccn: str
    official_name: str
    location: str
    state: str
    census_capacity: float | None
    overall_star_rating: float | None
    health_inspection_rating: float | None
    staffing_rating: float | None
    quality_rating: float | None
    str_hospitalization: MetricTriple
    str_ed_visit: MetricTriple
    lt_hospitalization: MetricTriple
    lt_ed_visit: MetricTriple
    medicare_url: str


class ManualInputs(CamelModel):
    emr: str = ""
    current_census: str = ""
    patient_type: str = ""
    previous_coverage: str = ""
    previous_provider_performance: str = ""
    medical_coverage: str = ""


class FacilitySessionResponse(CamelModel):
    cms: CmsFacilityData
    manual: ManualInputs
    name_override: str = ""


class FacilityInputsUpdate(CamelModel):
    manual: ManualInputs
    name_override: str = ""
