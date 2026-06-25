"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FacilityReport } from "@/lib/report-model";

interface HospitalizationChartsProps {
  report: FacilityReport;
}

function buildChartData(
  label: string,
  metric: FacilityReport["strHospitalization"],
  isPercent: boolean
) {
  const format = (value: number | null) =>
    value == null ? 0 : isPercent ? Number(value.toFixed(1)) : Number(value.toFixed(2));

  return [
    {
      name: label,
      Facility: format(metric.facility),
      State: format(metric.stateAverage),
      National: format(metric.nationalAverage),
    },
  ];
}

export default function HospitalizationCharts({
  report,
}: HospitalizationChartsProps) {
  const charts = [
    {
      title: "Short-Term Hospitalization (%)",
      data: buildChartData("STR Hosp.", report.strHospitalization, true),
      isPercent: true,
    },
    {
      title: "Short-Term ED Visits (%)",
      data: buildChartData("STR ED", report.strEdVisit, true),
      isPercent: true,
    },
    {
      title: "Long-Term Hospitalization (per 1,000 days)",
      data: buildChartData("LT Hosp.", report.ltHospitalization, false),
      isPercent: false,
    },
    {
      title: "Long-Term ED Visits (per 1,000 days)",
      data: buildChartData("LT ED", report.ltEdVisit, false),
      isPercent: false,
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-medelite-navy">
        Hospitalization &amp; ED Benchmarks
      </h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {charts.map(({ title, data, isPercent }) => (
          <div key={title} className="rounded-lg border border-slate-100 p-4">
            <h3 className="mb-3 text-sm font-medium text-medelite-slate">
              {title}
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) =>
                      isPercent ? `${value}%` : value.toFixed(2)
                    }
                  />
                  <Legend />
                  <Bar dataKey="Facility" fill="#1a6b7a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="State" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="National" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
