"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FacilityReport } from "@/lib/report-model";

interface HospitalizationChartsProps {
  report: FacilityReport;
}

const BAR_COLORS = ["#1a6b7a", "#64748b", "#2dd4bf"];
const HOVER_BAR_COLORS = ["#0f2744", "#475569", "#0d9488"];

function buildChartData(
  metric: FacilityReport["strHospitalization"],
  isPercent: boolean
) {
  const format = (value: number | null) =>
    value == null ? 0 : isPercent ? Number(value.toFixed(1)) : Number(value.toFixed(2));

  return [
    { name: "Facility", value: format(metric.facility) },
    { name: "State", value: format(metric.stateAverage) },
    { name: "National", value: format(metric.nationalAverage) },
  ];
}

function BenchmarkChart({
  title,
  data,
  isPercent,
}: {
  title: string;
  data: ReturnType<typeof buildChartData>;
  isPercent: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-slate-100 p-4">
      <h3 className="mb-3 text-sm font-medium text-medelite-slate">{title}</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={false}
              formatter={(value: number) =>
                isPercent ? `${value}%` : value.toFixed(2)
              }
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              activeBar={false}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    hoveredIndex === index
                      ? HOVER_BAR_COLORS[index]
                      : BAR_COLORS[index]
                  }
                  stroke="none"
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function HospitalizationCharts({
  report,
}: HospitalizationChartsProps) {
  const charts = [
    {
      title: "Short-Term Hospitalization (%)",
      data: buildChartData(report.strHospitalization, true),
      isPercent: true,
    },
    {
      title: "Short-Term ED Visits (%)",
      data: buildChartData(report.strEdVisit, true),
      isPercent: true,
    },
    {
      title: "Long-Term Hospitalization (per 1,000 days)",
      data: buildChartData(report.ltHospitalization, false),
      isPercent: false,
    },
    {
      title: "Long-Term ED Visits (per 1,000 days)",
      data: buildChartData(report.ltEdVisit, false),
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
          <BenchmarkChart
            key={title}
            title={title}
            data={data}
            isPercent={isPercent}
          />
        ))}
      </div>
    </section>
  );
}
