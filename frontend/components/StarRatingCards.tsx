"use client";

import { FacilityReport } from "@/lib/report-model";

interface StarRatingCardsProps {
  report: FacilityReport;
}

function StarDisplay({ rating }: { rating: number | null }) {
  if (rating == null) {
    return <span className="text-sm text-medelite-slate">N/A</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={index < rating ? "text-amber-400" : "text-slate-300"}
          aria-hidden
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm font-semibold text-medelite-navy">
        {rating}/5
      </span>
    </div>
  );
}

const cards = [
  { key: "overallStarRating", label: "Overall" },
  { key: "healthInspectionRating", label: "Health Inspection" },
  { key: "staffingRating", label: "Staffing" },
  { key: "qualityRating", label: "Quality of Care" },
] as const;

export default function StarRatingCards({ report }: StarRatingCardsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-medelite-navy">Star Ratings</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-lg border border-slate-100 bg-medelite-light p-4"
          >
            <p className="text-sm font-medium text-medelite-slate">{label}</p>
            <div className="mt-2">
              <StarDisplay rating={report[key]} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
