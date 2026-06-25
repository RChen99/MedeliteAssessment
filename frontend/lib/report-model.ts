export interface ManualInputs {
  emr: string;
  currentCensus: string;
  patientType: string;
  previousCoverage: "Yes" | "No" | "";
  previousProviderPerformance: string;
  medicalCoverage: string;
}

export interface MetricTriple {
  facility: number | null;
  stateAverage: number | null;
  nationalAverage: number | null;
}

export interface CmsFacilityData {
  ccn: string;
  officialName: string;
  location: string;
  state: string;
  censusCapacity: number | null;
  overallStarRating: number | null;
  healthInspectionRating: number | null;
  staffingRating: number | null;
  qualityRating: number | null;
  strHospitalization: MetricTriple;
  strEdVisit: MetricTriple;
  ltHospitalization: MetricTriple;
  ltEdVisit: MetricTriple;
  medicareUrl: string;
}

export interface FacilityReport extends CmsFacilityData {
  displayName: string;
  manual: ManualInputs;
}

export const EMPTY_MANUAL: ManualInputs = {
  emr: "",
  currentCensus: "",
  patientType: "",
  previousCoverage: "",
  previousProviderPerformance: "",
  medicalCoverage: "",
};

export interface FacilitySessionResponse {
  cms: CmsFacilityData;
  manual: ManualInputs;
  nameOverride: string;
}

export function buildReport(
  cms: CmsFacilityData,
  manual: ManualInputs,
  nameOverride: string
): FacilityReport {
  const trimmedOverride = nameOverride.trim();
  return {
    ...cms,
    displayName: trimmedOverride || cms.officialName,
    manual,
  };
}

export interface ReportRow {
  label: string;
  value: string;
}

export function getReportRows(report: FacilityReport): ReportRow[] {
  const perfSuffix = report.manual.previousProviderPerformance.trim()
    ? report.manual.previousProviderPerformance.includes("patient")
      ? report.manual.previousProviderPerformance
      : `${report.manual.previousProviderPerformance} Patients per day`
    : "";

  return [
    { label: "Name of Facility", value: report.displayName },
    { label: "Location", value: report.location },
    { label: "EMR", value: report.manual.emr || "—" },
    {
      label: "Census Capacity",
      value: report.censusCapacity != null ? String(report.censusCapacity) : "N/A",
    },
    { label: "Current Census", value: report.manual.currentCensus || "—" },
    { label: "Type of Patient", value: report.manual.patientType || "—" },
    {
      label: "Previous Coverage from Medelite",
      value: report.manual.previousCoverage || "—",
    },
    {
      label: "Previous Provider Performance from Medelite",
      value: perfSuffix || "—",
    },
    { label: "Medical Coverage", value: report.manual.medicalCoverage || "—" },
    {
      label: "Overall Star Rating",
      value: formatStar(report.overallStarRating),
    },
    {
      label: "Health Inspection",
      value: formatStar(report.healthInspectionRating),
    },
    { label: "Staffing", value: formatStar(report.staffingRating) },
    {
      label: "Quality of Resident Care",
      value: formatStar(report.qualityRating),
    },
    {
      label: "Short Term Hospitalization",
      value: formatPercent(report.strHospitalization.facility),
    },
    {
      label: "STR National Avg. for Hospitalization",
      value: formatPercent(report.strHospitalization.nationalAverage),
    },
    {
      label: "STR State National Avg. for Hospitalization",
      value: formatPercent(report.strHospitalization.stateAverage),
    },
    {
      label: "STR ED Visit",
      value: formatPercent(report.strEdVisit.facility),
    },
    {
      label: "STR ED Visits National Avg.",
      value: formatPercent(report.strEdVisit.nationalAverage),
    },
    {
      label: "STR ED Visits State Avg.",
      value: formatPercent(report.strEdVisit.stateAverage),
    },
    {
      label: "LT Hospitalization",
      value: formatRate(report.ltHospitalization.facility),
    },
    {
      label: "LT National Avg. for Hospitalization",
      value: formatRate(report.ltHospitalization.nationalAverage),
    },
    {
      label: "LT State National Avg. for Hospitalization",
      value: formatRate(report.ltHospitalization.stateAverage),
    },
    {
      label: "ED Visit",
      value: formatRate(report.ltEdVisit.facility),
    },
    {
      label: "LT ED Visits National Avg.",
      value: formatRate(report.ltEdVisit.nationalAverage),
    },
    {
      label: "LT ED Visits State Avg.",
      value: formatRate(report.ltEdVisit.stateAverage),
    },
  ];
}

function formatStar(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "N/A";
  return String(value);
}

function formatPercent(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "N/A";
  return `${value.toFixed(1)}%`;
}

function formatRate(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "N/A";
  return value.toFixed(2);
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}
