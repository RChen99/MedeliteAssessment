"use client";

import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useState } from "react";
import { AssessmentPdfDocument } from "@/lib/export-pdf";
import { generateDocxBlob, getExportFilename } from "@/lib/export-docx";
import { FacilityReport } from "@/lib/report-model";

interface ExportButtonsProps {
  report: FacilityReport;
}

export default function ExportButtons({ report }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

  const downloadPdf = async () => {
    setExporting("pdf");
    try {
      const blob = await pdf(<AssessmentPdfDocument report={report} />).toBlob();
      saveAs(blob, getExportFilename(report, "pdf"));
    } finally {
      setExporting(null);
    }
  };

  const downloadDocx = async () => {
    setExporting("docx");
    try {
      const blob = await generateDocxBlob(report);
      saveAs(blob, getExportFilename(report, "docx"));
    } finally {
      setExporting(null);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-medelite-navy">Export Report</h2>
      <p className="mt-1 text-sm text-medelite-slate">
        Download a print-ready PDF or editable Word document.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={exporting !== null}
          className="rounded-lg bg-medelite-navy px-6 py-2.5 font-semibold text-white transition hover:bg-medelite-teal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting === "pdf" ? "Generating PDF…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={downloadDocx}
          disabled={exporting !== null}
          className="rounded-lg border border-medelite-navy px-6 py-2.5 font-semibold text-medelite-navy transition hover:bg-medelite-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting === "docx" ? "Generating Word…" : "Download Word"}
        </button>
      </div>
    </section>
  );
}
