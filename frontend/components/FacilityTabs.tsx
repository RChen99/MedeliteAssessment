"use client";

import { ReactNode, useState } from "react";

const TABS = [
  { id: "entries", label: "Entries" },
  { id: "performance", label: "Performance" },
  { id: "report", label: "Report" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface FacilityTabsProps {
  entries: ReactNode;
  performance: ReactNode;
  report: ReactNode;
}

export default function FacilityTabs({
  entries,
  performance,
  report,
}: FacilityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("entries");

  const panels: Record<TabId, ReactNode> = {
    entries,
    performance,
    report,
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Facility assessment sections"
        className="flex items-end justify-start"
      >
        {TABS.map((tab, index) => {
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`facility-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`facility-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 border border-slate-200 px-5 py-2.5 text-sm font-semibold transition first:rounded-tl-lg ${
                index === TABS.length - 1 ? "rounded-tr-lg" : ""
              } ${
                selected
                  ? "z-10 -mb-px border-b-white bg-white text-medelite-navy"
                  : "bg-slate-100 text-medelite-slate hover:bg-slate-50"
              } ${index > 0 ? "-ml-px" : ""}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-b-xl rounded-tr-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {TABS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`facility-panel-${tab.id}`}
              aria-labelledby={`facility-tab-${tab.id}`}
              hidden={!selected}
              className="space-y-6"
            >
              {selected ? panels[tab.id] : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
