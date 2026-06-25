"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BackToLookupLink from "@/components/BackToLookupLink";
import BrandHeader from "@/components/BrandHeader";
import ExportButtons from "@/components/ExportButtons";
import HospitalizationCharts from "@/components/HospitalizationCharts";
import ManualInputsForm from "@/components/ManualInputsForm";
import ReportPreview from "@/components/ReportPreview";
import StarRatingCards from "@/components/StarRatingCards";
import UnsupportedCcnWarning from "@/components/UnsupportedCcnWarning";
import { DEMO_CCN } from "@/lib/constants";
import {
  buildReport,
  EMPTY_MANUAL,
  FacilitySessionResponse,
  ManualInputs,
} from "@/lib/report-model";

interface FacilityPageClientProps {
  ccn: string;
}

export default function FacilityPageClient({ ccn }: FacilityPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldFetch = searchParams.get("fetch") === "1";

  const [loading, setLoading] = useState(shouldFetch);
  const [restoring, setRestoring] = useState(!shouldFetch);
  const [error, setError] = useState<string | null>(null);
  const [cmsData, setCmsData] = useState<FacilitySessionResponse["cms"] | null>(
    null
  );
  const [manual, setManual] = useState<ManualInputs>({ ...EMPTY_MANUAL });
  const [nameOverride, setNameOverride] = useState("");

  const report = useMemo(() => {
    if (!cmsData) return null;
    return buildReport(cmsData, manual, nameOverride);
  }, [cmsData, manual, nameOverride]);

  const applySession = useCallback((session: FacilitySessionResponse) => {
    setCmsData(session.cms);
    setManual(session.manual ?? { ...EMPTY_MANUAL });
    setNameOverride(session.nameOverride ?? "");
  }, []);

  const loadStoredFacility = useCallback(async () => {
    setRestoring(true);
    setError(null);

    try {
      const response = await fetch(`/api/facility/${ccn}/stored`);
      if (response.status === 404) {
        setCmsData(null);
        setManual({ ...EMPTY_MANUAL });
        setNameOverride("");
        return false;
      }

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Unable to load saved facility data.");
        return false;
      }

      applySession(payload as FacilitySessionResponse);
      return true;
    } catch {
      setError("Unable to load saved facility data.");
      return false;
    } finally {
      setRestoring(false);
    }
  }, [applySession, ccn]);

  const fetchFacility = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/facility/${ccn}`);
      const payload = await response.json();

      if (!response.ok) {
        setCmsData(null);
        setError(payload.error ?? "Unable to fetch facility data.");
        return;
      }

      applySession(payload as FacilitySessionResponse);
      router.replace(`/facility/${ccn}`, { scroll: false });
    } catch {
      setCmsData(null);
      setError("Unable to reach CMS data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [applySession, ccn, router]);

  useEffect(() => {
    if (ccn !== DEMO_CCN) return;

    if (shouldFetch) {
      void fetchFacility();
      return;
    }

    void loadStoredFacility();
  }, [ccn, shouldFetch, fetchFacility, loadStoredFacility]);

  useEffect(() => {
    if (!cmsData?.ccn) return;

    const timer = window.setTimeout(() => {
      void fetch(`/api/facility/${cmsData.ccn}/inputs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manual, nameOverride }),
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [manual, nameOverride, cmsData?.ccn]);

  if (ccn !== DEMO_CCN) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
        <BrandHeader />
        <div className="mt-6 space-y-6">
          <BackToLookupLink />
          <UnsupportedCcnWarning
            enteredCcn={ccn}
            onUseDemo={() => router.push(`/facility/${DEMO_CCN}?fetch=1`)}
          />
        </div>
      </main>
    );
  }

  const busy = loading || restoring;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
      <BrandHeader state={cmsData?.state} />

      <div className="mt-6 space-y-6">
        <BackToLookupLink />

        {busy && !cmsData && (
          <p className="text-sm text-medelite-slate">
            {loading ? "Fetching facility data from CMS…" : "Loading saved session…"}
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {cmsData && report && (
          <>
            <ManualInputsForm
              values={manual}
              nameOverride={nameOverride}
              officialName={cmsData.officialName}
              onChange={setManual}
              onNameOverrideChange={setNameOverride}
            />
            <StarRatingCards report={report} />
            <HospitalizationCharts report={report} />
            <ReportPreview report={report} />
            <ExportButtons report={report} />
          </>
        )}
      </div>
    </main>
  );
}
