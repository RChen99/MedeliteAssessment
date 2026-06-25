"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrandHeader from "@/components/BrandHeader";
import CcnLookupForm from "@/components/CcnLookupForm";
import ExportButtons from "@/components/ExportButtons";
import HospitalizationCharts from "@/components/HospitalizationCharts";
import ManualInputsForm from "@/components/ManualInputsForm";
import ReportPreview from "@/components/ReportPreview";
import StarRatingCards from "@/components/StarRatingCards";
import {
  buildReport,
  EMPTY_MANUAL,
  FacilitySessionResponse,
  ManualInputs,
} from "@/lib/report-model";

export default function HomePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ccn, setCcn] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
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

  const loadStoredFacility = useCallback(
    async (ccnValue: string) => {
      setRestoring(true);
      setError(null);

      try {
        const response = await fetch(`/api/facility/${ccnValue}/stored`);
        if (response.status === 404) {
          setCmsData(null);
          setManual({ ...EMPTY_MANUAL });
          setNameOverride("");
          return;
        }

        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error ?? "Unable to load saved facility data.");
          return;
        }

        applySession(payload as FacilitySessionResponse);
      } catch {
        setError("Unable to load saved facility data.");
      } finally {
        setRestoring(false);
      }
    },
    [applySession]
  );

  useEffect(() => {
    const urlCcn = searchParams.get("ccn")?.trim() ?? "";
    if (!urlCcn) return;

    setCcn(urlCcn);
    void loadStoredFacility(urlCcn);
  }, [searchParams, loadStoredFacility]);

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

  const fetchFacility = async () => {
    const trimmedCcn = ccn.trim();
    if (!trimmedCcn) {
      setError("Please enter a CCN.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/facility/${trimmedCcn}`);
      const payload = await response.json();

      if (!response.ok) {
        setCmsData(null);
        setError(payload.error ?? "Unable to fetch facility data.");
        return;
      }

      applySession(payload as FacilitySessionResponse);
      router.replace(`/?ccn=${trimmedCcn}`, { scroll: false });
    } catch {
      setCmsData(null);
      setError("Unable to reach CMS data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
      <BrandHeader state={cmsData?.state} />

      <div className="mt-6 space-y-6">
        <CcnLookupForm
          ccn={ccn}
          loading={loading || restoring}
          onCcnChange={setCcn}
          onSubmit={fetchFacility}
        />

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
