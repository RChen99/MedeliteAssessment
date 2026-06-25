"use client";

import BrandHeader from "@/components/BrandHeader";
import { FacilityReport, getReportRows } from "@/lib/report-model";

interface ReportPreviewProps {
  report: FacilityReport;
}

export default function ReportPreview({ report }: ReportPreviewProps) {
  const rows = getReportRows(report);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-medelite-navy">Report Preview</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
        <div className="p-4">
          <BrandHeader state={report.state} />
        </div>
        <dl className="divide-y divide-slate-100">
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="grid gap-1 px-4 py-3 sm:grid-cols-2 sm:gap-4"
            >
              <dt className="text-sm font-medium text-medelite-slate">{label}</dt>
              <dd className="text-sm font-semibold text-medelite-navy">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-slate-100 px-4 py-3">
          <a
            href={report.medicareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-medelite-teal underline hover:text-medelite-navy"
          >
            View on Medicare Care Compare
          </a>
        </div>
      </div>
    </section>
  );
}
