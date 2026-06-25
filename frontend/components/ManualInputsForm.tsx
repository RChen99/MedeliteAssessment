"use client";

import { useEffect, useState } from "react";
import { EMPTY_MANUAL, ManualInputs } from "@/lib/report-model";

interface ManualInputsFormProps {
  values: ManualInputs;
  nameOverride: string;
  officialName: string;
  onChange: (values: ManualInputs) => void;
  onNameOverrideChange: (value: string) => void;
}

function manualInputsEqual(a: ManualInputs, b: ManualInputs) {
  return (
    a.emr === b.emr &&
    a.currentCensus === b.currentCensus &&
    a.patientType === b.patientType &&
    a.previousCoverage === b.previousCoverage &&
    a.previousProviderPerformance === b.previousProviderPerformance &&
    a.medicalCoverage === b.medicalCoverage
  );
}

export default function ManualInputsForm({
  values,
  nameOverride,
  officialName,
  onChange,
  onNameOverrideChange,
}: ManualInputsFormProps) {
  const [draftNameOverride, setDraftNameOverride] = useState(nameOverride);
  const [draftManual, setDraftManual] = useState<ManualInputs>({ ...values });

  useEffect(() => {
    setDraftNameOverride(nameOverride);
  }, [nameOverride]);

  useEffect(() => {
    setDraftManual({ ...values });
  }, [values]);

  const updateDraft = (field: keyof ManualInputs, value: string) => {
    setDraftManual((current) => ({ ...current, [field]: value }));
  };

  const applyOverride = () => {
    onNameOverrideChange(draftNameOverride.trim());
  };

  const resetOverride = () => {
    setDraftNameOverride("");
    onNameOverrideChange("");
  };

  const saveManual = () => {
    onChange({ ...draftManual });
  };

  const clearManual = () => {
    setDraftManual({ ...EMPTY_MANUAL });
    onChange({ ...EMPTY_MANUAL });
  };

  const hasPendingOverride =
    draftNameOverride.trim() !== nameOverride.trim();
  const hasPendingManual = !manualInputsEqual(draftManual, values);
  const manualIsEmpty = manualInputsEqual(draftManual, EMPTY_MANUAL);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-medelite-navy">
        Operational Inputs
      </h2>
      <p className="mt-1 text-sm text-medelite-slate">
        Internal metrics not available from CMS public data.
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-medelite-light/40 p-4">
        <h3 className="text-lg font-semibold text-medelite-navy">
          Optional Inputs
        </h3>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-medelite-navy">
            Facility Name Override
          </span>
          <input
            type="text"
            value={draftNameOverride}
            onChange={(event) => setDraftNameOverride(event.target.value)}
            placeholder={officialName}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
          />
          <span className="mt-1 block text-xs text-medelite-slate">
            CMS legal name: {officialName}
          </span>
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={resetOverride}
            disabled={!nameOverride && !draftNameOverride}
            className="rounded-lg border border-medelite-navy px-4 py-2 text-sm font-semibold text-medelite-navy transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Override
          </button>
          <button
            type="button"
            onClick={applyOverride}
            disabled={!draftNameOverride.trim() || !hasPendingOverride}
            className="rounded-lg bg-medelite-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-medelite-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            Override
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-medelite-navy">
          Required Inputs
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-medelite-navy">EMR</span>
            <input
              type="text"
              value={draftManual.emr}
              onChange={(event) => updateDraft("emr", event.target.value)}
              placeholder='e.g. "PCC"'
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-medelite-navy">
              Current Census
            </span>
            <input
              type="number"
              min={0}
              value={draftManual.currentCensus}
              onChange={(event) =>
                updateDraft("currentCensus", event.target.value)
              }
              placeholder="e.g. 112"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-medelite-navy">
              Type of Patient
            </span>
            <select
              value={draftManual.patientType}
              onChange={(event) => updateDraft("patientType", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
            >
              <option value="">Select…</option>
              <option value="Short Term">Short Term</option>
              <option value="Long Term">Long Term</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-medelite-navy">
              Previous Coverage from Medelite
            </span>
            <select
              value={draftManual.previousCoverage}
              onChange={(event) =>
                updateDraft(
                  "previousCoverage",
                  event.target.value as ManualInputs["previousCoverage"]
                )
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
            >
              <option value="">Select…</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-medelite-navy">
              Previous Provider Performance from Medelite
            </span>
            <input
              type="text"
              value={draftManual.previousProviderPerformance}
              onChange={(event) =>
                updateDraft("previousProviderPerformance", event.target.value)
              }
              placeholder="e.g. About 30 patients/day"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-medelite-navy">
              Medical Coverage
            </span>
            <input
              type="text"
              value={draftManual.medicalCoverage}
              onChange={(event) =>
                updateDraft("medicalCoverage", event.target.value)
              }
              placeholder="e.g. Optometry, PCP, Podiatry"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={clearManual}
            disabled={manualIsEmpty && manualInputsEqual(values, EMPTY_MANUAL)}
            className="rounded-lg border border-medelite-navy px-4 py-2 text-sm font-semibold text-medelite-navy transition hover:bg-medelite-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={saveManual}
            disabled={!hasPendingManual}
            className="rounded-lg bg-medelite-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-medelite-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
