"use client";

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
  const update = (field: keyof ManualInputs, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-medelite-navy">
        Operational Inputs
      </h2>
      <p className="mt-1 text-sm text-medelite-slate">
        Internal metrics not available from CMS public data.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-medelite-navy">
            Facility Name Override (optional)
          </span>
          <input
            type="text"
            value={nameOverride}
            onChange={(event) => onNameOverrideChange(event.target.value)}
            placeholder={officialName}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-medelite-teal focus:ring-2"
          />
          <span className="mt-1 block text-xs text-medelite-slate">
            CMS legal name: {officialName}
          </span>
        </label>

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
              update("previousCoverage", event.target.value as ManualInputs["previousCoverage"])
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
    </section>
  );
}
