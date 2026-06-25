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
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Facility assessment sections"
        className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
      >
        {TABS.map((tab) => {
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
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                selected
                  ? "bg-medelite-teal text-white shadow-sm"
                  : "text-medelite-slate hover:bg-slate-50 hover:text-medelite-navy"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

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
  );
}
