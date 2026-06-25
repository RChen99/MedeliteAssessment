"use client";

import { useEffect, useState } from "react";
import { ManualInputs } from "@/lib/report-model";

interface ManualInputsFormProps {
  values: ManualInputs;
  nameOverride: string;
  officialName: string;
  onChange: (values: ManualInputs) => void;
  onNameOverrideChange: (value: string) => void;
}

export default function ManualInputsForm({
  values,
  nameOverride,
  officialName,
  onChange,
  onNameOverrideChange,
}: ManualInputsFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [draftNameOverride, setDraftNameOverride] = useState(nameOverride);

  useEffect(() => {
    setDraftNameOverride(nameOverride);
  }, [nameOverride]);

  const update = (field: keyof ManualInputs, value: string) => {
    onChange({ ...values, [field]: value });
  };

  const applyOverride = () => {
    onNameOverrideChange(draftNameOverride.trim());
  };

  const resetOverride = () => {
    setDraftNameOverride("");
    onNameOverrideChange("");
  };

  const hasPendingOverride =
    draftNameOverride.trim() !== nameOverride.trim();

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
        aria-expanded={expanded}
      >
        <div>
          <h2 className="text-lg font-semibold text-medelite-navy">
            Operational Inputs (optional)
          </h2>
          <p className="mt-1 text-sm text-medelite-slate">
            Internal metrics not available from CMS public data.
          </p>
        </div>
        <span
          aria-hidden="true"
          className="text-xl font-bold leading-none text-medelite-teal"
        >
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 px-6 pb-6">
          <div className="mt-4 rounded-lg border border-slate-200 bg-medelite-light/40 p-4">
            <label className="block">
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

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-medelite-navy">EMR</span>
              <input
                type="text"
                value={values.emr}
                onChange={(event) => update("emr", event.target.value)}
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
                value={values.currentCensus}
                onChange={(event) => update("currentCensus", event.target.value)}
                placeholder="e.g. 112"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-medelite-navy">
                Type of Patient
              </span>
              <input
                type="text"
                value={values.patientType}
                onChange={(event) => update("patientType", event.target.value)}
                placeholder="e.g. Long-term & Short-term"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-medelite-navy">
                Previous Coverage from Medelite
              </span>
              <select
                value={values.previousCoverage}
                onChange={(event) =>
                  update(
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
                value={values.previousProviderPerformance}
                onChange={(event) =>
                  update("previousProviderPerformance", event.target.value)
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
                value={values.medicalCoverage}
                onChange={(event) => update("medicalCoverage", event.target.value)}
                placeholder="e.g. Optometry, PCP, Podiatry"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
              />
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
